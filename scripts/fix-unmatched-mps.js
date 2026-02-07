/**
 * Fix Unmatched MPs using Fuzzy Matching
 *
 * Matches MPs from MPLADS CSV to the mps table using fuzzy name matching
 * combined with constituency matching for accuracy.
 */

require('dotenv').config();
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// CSV parsing utilities
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (char === ',' && !inQuotes) { result.push(current); current = ''; }
    else { current += char; }
  }
  result.push(current);
  return result;
}

function parseIndianCurrency(str) {
  if (!str) return 0;
  const cleaned = str.replace(/[₹\s,]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

// Normalize for comparison
function normalize(str) {
  if (!str) return '';
  return str
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, ' ')  // Remove special chars
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeConstituency(c) {
  if (!c) return '';
  return c
    .toUpperCase()
    .replace(/\(SC\)|\(ST\)/gi, '')
    .replace(/_[A-Z]{2}$/, '')  // Remove _UP, _BR suffixes
    .replace(/[^A-Z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Extract name parts
function extractNameParts(name) {
  if (!name) return { first: '', last: '', initials: [], words: [] };

  // Remove prefixes
  let cleaned = name
    .replace(/^(SHRI|SMT|DR|ADV|PROF|MR|MS|MRS|SWAMI)\.?\s+/gi, '')
    .replace(/\s+(JI|MAHARAJ|SAHEB|SAHIB)$/gi, '')
    .trim();

  // Handle "Alias" - take first part
  if (cleaned.includes(' ALIAS ')) {
    cleaned = cleaned.split(' ALIAS ')[0].trim();
  }
  if (cleaned.includes('(')) {
    cleaned = cleaned.replace(/\([^)]+\)/g, '').trim();
  }

  const normalized = normalize(cleaned);
  const words = normalized.split(' ').filter(w => w.length > 0);

  // Extract initials (single letters)
  const initials = words.filter(w => w.length === 1);
  const fullWords = words.filter(w => w.length > 1);

  return {
    first: fullWords[0] || '',
    last: fullWords[fullWords.length - 1] || '',
    initials,
    words: fullWords,
    all: words
  };
}

// Calculate similarity score between two names
function nameSimilarity(name1, name2) {
  const parts1 = extractNameParts(name1);
  const parts2 = extractNameParts(name2);

  let score = 0;

  // Check if last names match
  if (parts1.last && parts2.last) {
    if (parts1.last === parts2.last) {
      score += 50;
    } else if (parts1.last.includes(parts2.last) || parts2.last.includes(parts1.last)) {
      score += 30;
    } else if (levenshteinDistance(parts1.last, parts2.last) <= 2) {
      score += 25;
    }
  }

  // Check first name or initial match
  if (parts1.first && parts2.first) {
    if (parts1.first === parts2.first) {
      score += 40;
    } else if (parts1.first[0] === parts2.first[0]) {
      // First letter matches - could be initial
      score += 20;
    } else if (levenshteinDistance(parts1.first, parts2.first) <= 2) {
      score += 15;
    }
  }

  // Check if any initials match first letters of full words
  for (const initial of parts1.initials) {
    if (parts2.words.some(w => w[0] === initial)) {
      score += 10;
    }
  }
  for (const initial of parts2.initials) {
    if (parts1.words.some(w => w[0] === initial)) {
      score += 10;
    }
  }

  // Check for common words
  const commonWords = parts1.words.filter(w => parts2.words.includes(w));
  score += commonWords.length * 15;

  // Check for partial word matches
  for (const w1 of parts1.words) {
    for (const w2 of parts2.words) {
      if (w1 !== w2 && (w1.includes(w2) || w2.includes(w1))) {
        score += 10;
      }
    }
  }

  return score;
}

// Levenshtein distance for fuzzy matching
function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

// Find best matching MP
function findBestMatch(csvMp, dbMps) {
  const csvConstituency = normalizeConstituency(csvMp.constituency);

  let bestMatch = null;
  let bestScore = 0;

  for (const dbMp of dbMps) {
    const dbConstituency = normalizeConstituency(dbMp.constituency);

    // Constituency must match (with some flexibility)
    const constituencyMatch =
      dbConstituency === csvConstituency ||
      dbConstituency.includes(csvConstituency) ||
      csvConstituency.includes(dbConstituency) ||
      levenshteinDistance(dbConstituency, csvConstituency) <= 3;

    if (!constituencyMatch) continue;

    // Calculate name similarity
    const nameScore = nameSimilarity(csvMp.name, dbMp.full_name);

    // Boost score if constituency is exact match
    const totalScore = nameScore + (dbConstituency === csvConstituency ? 20 : 0);

    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestMatch = { mp: dbMp, score: totalScore };
    }
  }

  // Require minimum score of 50 for a match
  return bestScore >= 50 ? bestMatch : null;
}

async function main() {
  console.log('Loading MPs from database...');
  const { data: dbMps } = await supabase.from('mps').select('id, full_name, constituency, state_ut');
  console.log(`Loaded ${dbMps.length} MPs from database`);

  // Unmatched MPs from the previous analysis
  const unmatchedMps = [
    { name: 'Andimuthu Raja', constituency: 'NILGIRIS(SC)', state: 'Tamil Nadu' },
    { name: 'BAG MITALI', constituency: 'ARAMBAG(SC)', state: 'West Bengal' },
    { name: 'Balashowry Vallabbhaneni', constituency: 'MACHILIPATNAM', state: 'Andhra Pradesh' },
    { name: 'Bhagirath Chaudhary', constituency: 'AJMER', state: 'Rajasthan' },
    { name: 'Bharatsinhji Shankarji Dabhi', constituency: 'PATAN', state: 'Gujarat' },
    { name: 'Bhupathiraju Srinivasa varma', constituency: 'NARASAPURAM', state: 'Andhra Pradesh' },
    { name: 'C.M.RAMESH', constituency: 'ANAKAPALLE', state: 'Andhra Pradesh' },
    { name: 'CHANDRA SHEKHAR', constituency: 'NAGINA(SC)', state: 'Uttar Pradesh' },
    { name: 'CHAVAN VASANTRAO BALWANTRAO', constituency: 'NANDED', state: 'Maharashtra' },
    { name: 'CN Annadurai', constituency: 'TIRUVANNAMALAI', state: 'Tamil Nadu' },
    { name: 'D M Kathir Anand', constituency: 'VELLORE', state: 'Tamil Nadu' },
    { name: 'D Ravikumar', constituency: 'VILUPPURAM(SC)', state: 'Tamil Nadu' },
    { name: 'Daggubati Purandeshwari', constituency: 'RAJAHMUNDRY', state: 'Andhra Pradesh' },
    { name: 'Devendra Alias Bhole Singh', constituency: 'AKBARPUR', state: 'Uttar Pradesh' },
    { name: 'Devusinh Jesingbhai Chauhan', constituency: 'KHEDA', state: 'Gujarat' },
    { name: 'DR.K.SUDHAKAR', constituency: 'CHIKBALLAPUR', state: 'Karnataka' },
    { name: 'Durga Das Uikey', constituency: 'BETUL(ST)', state: 'Madhya Pradesh' },
    { name: 'Ganesan Selvam', constituency: 'KANCHEEPURAM(SC)', state: 'Tamil Nadu' },
    { name: 'GM Harish Balayogi', constituency: 'AMALAPURAM(SC)', state: 'Andhra Pradesh' },
    { name: 'GURMEET SINGH MEET HAYER', constituency: 'SANGRUR', state: 'Punjab' },
    { name: 'Hasmukh Bhai Soma Bhai Patel', constituency: 'AHMEDABAD EAST', state: 'Gujarat' },
    { name: 'Kalaben Mohanbhai Delkar', constituency: 'DADRA & NAGAR HAVELI (ST)', state: 'The Dadra And Nagar Haveli And Daman And Diu' },
    { name: 'Kangana Ranaut', constituency: 'MANDI', state: 'Himachal Pradesh' },
    { name: 'Kani K Navas', constituency: 'RAMANATHAPURAM', state: 'Tamil Nadu' },
    { name: 'Kinjarapu Ram Mohan Naidu', constituency: 'SRIKAKULAM', state: 'Andhra Pradesh' },
    { name: 'Kirti Vardhan Singh', constituency: 'GONDA', state: 'Uttar Pradesh' },
    { name: 'Kishan Reddy Gangapuram', constituency: 'SECUNDERABAD', state: 'Telangana' },
    { name: 'Lavu Sri Krishna Devarayalu', constituency: 'NARASARAOPET', state: 'Andhra Pradesh' },
    { name: 'Maddila Gurumoorthy', constituency: 'TIRUPATI(SC)', state: 'Andhra Pradesh' },
    { name: 'Mala Rajya Laxmi Shah', constituency: 'TEHRI GARHWAL', state: 'Uttarakhand' },
    { name: 'Mitesh Rameshbhai Bakabhai Patel', constituency: 'ANAND', state: 'Gujarat' },
    { name: 'Mohamed Haneefa', constituency: 'LADAKH', state: 'Ladakh' },
    { name: 'MOHITE PATIL DHAIRYASHEEL RAJSINH', constituency: 'MADHA', state: 'Maharashtra' },
    { name: 'Omprakash Bhupalsinh Alias Pawan Rajenimbalkar', constituency: 'OSMANABAD', state: 'Maharashtra' },
    { name: 'Pankaj Chowdhary', constituency: 'MAHARAJGANJ_UP', state: 'Uttar Pradesh' },
    { name: 'Parvatagouda Chandanagouda Gaddigoudar', constituency: 'BAGALKOT', state: 'Karnataka' },
    { name: 'Piyush Vedprakash Goyal', constituency: 'MUMBAI NORTH', state: 'Maharashtra' },
    { name: 'Prabhubhai Nagarbhai Vasava', constituency: 'BARDOLI(ST)', state: 'Gujarat' },
    { name: 'Pralhad Venkatesh Joshi', constituency: 'DHARWAD', state: 'Karnataka' },
    { name: 'Prataprao Jadhav', constituency: 'BULDHANA', state: 'Maharashtra' },
    { name: 'Prof SP Singh Baghel', constituency: 'AGRA(SC)', state: 'Uttar Pradesh' },
    { name: 'RADHE SHYAM RATHIYA', constituency: 'RAIGARH(ST)', state: 'Chhattisgarh' },
    { name: 'Rajeshbhai Naranbhai Chudasama', constituency: 'JUNAGADH', state: 'Gujarat' },
    { name: 'Rajiv Ranjan (Lalan) Singh', constituency: 'MUNGER', state: 'Bihar' },
    { name: 'Rajnath Singh', constituency: 'LUCKNOW', state: 'Uttar Pradesh' },
    { name: 'Ramesh Chandappa Jigajinagi', constituency: 'BIJAPUR(SC)', state: 'Karnataka' },
    { name: 'Ravindra Shyamnarayan Alias Ravi Kishan Shukla', constituency: 'GORAKHPUR', state: 'Uttar Pradesh' },
    { name: 'S Venkatesan', constituency: 'MADURAI', state: 'Tamil Nadu' },
    { name: 'S. Jagathrakshakan', constituency: 'ARAKKONAM', state: 'Tamil Nadu' },
    { name: 'Sanjay Haribhau Jadhav', constituency: 'PARBHANI', state: 'Maharashtra' },
    { name: 'Sanjay Kumar Bandi', constituency: 'KARIMNAGAR', state: 'Telangana' },
    { name: 'Saumitra khan', constituency: 'BISHNUPUR(SC)', state: 'West Bengal' },
    { name: 'Shatrughan Sinha', constituency: 'ASANSOL', state: 'West Bengal' },
    { name: 'Shri B Y Raghavendra', constituency: 'SHIMOGA', state: 'Karnataka' },
    { name: 'Shri Deepak (Dev) Adhikari', constituency: 'GHATAL', state: 'West Bengal' },
    { name: 'Shri Janardan Singh Sigriwal', constituency: 'MAHARAJGANJ_BR', state: 'Bihar' },
    { name: 'Shri Kumbakudi Sudhakaran', constituency: 'KANNUR', state: 'Kerala' },
    { name: 'Shri M K Raghavan', constituency: 'KOZHIKODE', state: 'Kerala' },
    { name: 'Shri NK Premachandran', constituency: 'KOLLAM', state: 'Kerala' },
    { name: 'Shri PP Chaudhary', constituency: 'PALI', state: 'Rajasthan' },
    { name: 'Shri Suresh Kodikunnil', constituency: 'MAVELIKKARA(SC)', state: 'Kerala' },
    { name: 'Shri vijayakumar Vasanth', constituency: 'KANNIYAKUMARI', state: 'Tamil Nadu' },
    { name: 'Shrirang Appa Barne', constituency: 'MAVAL', state: 'Maharashtra' },
    { name: 'Sivanath Kesineni', constituency: 'VIJAYAWADA', state: 'Andhra Pradesh' },
    { name: 'Smt Hema Malini', constituency: 'MATHURA', state: 'Uttar Pradesh' },
    { name: 'Smt Raksha Nikhil Khadse', constituency: 'RAVER', state: 'Maharashtra' },
    { name: 'Smt S Jothimani', constituency: 'KARUR', state: 'Tamil Nadu' },
    { name: 'Smt Supriya Sadanand Sule', constituency: 'BARAMATI', state: 'Maharashtra' },
    { name: 'Sribharat MathuKumli', constituency: 'VISAKHAPATNAM', state: 'Andhra Pradesh' },
    { name: 'Sudip Bandyopadhyay', constituency: 'KOLKATA UTTAR', state: 'West Bengal' },
    { name: 'Sunil Dattatray Tatkare', constituency: 'RAIGAD', state: 'Maharashtra' },
    { name: 'Swami Sachchidanandhari Sakshi ji Maharaj', constituency: 'UNNAO', state: 'Uttar Pradesh' },
    { name: 'T Sumathy (A) Thamizhachi Thangapandian', constituency: 'CHENNAI SOUTH', state: 'Tamil Nadu' },
    { name: 'Thalikkottai Rajuthevar Baalu', constituency: 'SRIPERUMBUDUR', state: 'Tamil Nadu' },
    { name: 'Thirumaa Valavan Thol', constituency: 'CHIDAMBARAM(SC)', state: 'Tamil Nadu' },
    { name: 'UTKARSH VERMA MADHUR', constituency: 'KHERI', state: 'Uttar Pradesh' },
    { name: 'V S Matheswaran', constituency: 'NAMAKKAL', state: 'Tamil Nadu' },
    { name: 'Vaithilingam Ve', constituency: 'Puducherry', state: 'Puducherry' },
    { name: 'Vellalath Kochukrishnan Nair Sreekandan', constituency: 'PALAKKAD', state: 'Kerala' },
    { name: 'Vijay Kumar Dubey', constituency: 'KUSHI NAGAR', state: 'Uttar Pradesh' },
    { name: 'Vinod Chavda', constituency: 'KACHCHH(SC)', state: 'Gujarat' },
    { name: 'Vishnu Dutt Sharma', constituency: 'KHAJURAHO', state: 'Madhya Pradesh' },
    { name: 'VISHWESHWAR HEGDE KAGERI', constituency: 'UTTARA KANNADA', state: 'Karnataka' },
    { name: 'Y S Avinash Reddy', constituency: 'KADAPA', state: 'Andhra Pradesh' },
    { name: 'Yogendra Chandoliya', constituency: 'NORTH WEST DELHI(SC)', state: 'Delhi' },
  ];

  console.log(`\nFinding matches for ${unmatchedMps.length} unmatched MPs...\n`);

  const matches = [];
  const stillUnmatched = [];

  for (const csvMp of unmatchedMps) {
    const match = findBestMatch(csvMp, dbMps);

    if (match) {
      matches.push({
        csv: csvMp,
        db: match.mp,
        score: match.score
      });
      console.log(`✓ ${csvMp.name} (${csvMp.constituency})`);
      console.log(`  → ${match.mp.full_name} (${match.mp.constituency}) [score: ${match.score}]`);
    } else {
      stillUnmatched.push(csvMp);
      console.log(`✗ ${csvMp.name} (${csvMp.constituency}) - NO MATCH FOUND`);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Matched: ${matches.length}`);
  console.log(`Still unmatched: ${stillUnmatched.length}`);
  console.log(`${'='.repeat(60)}\n`);

  if (stillUnmatched.length > 0) {
    console.log('Still unmatched MPs:');
    stillUnmatched.forEach((mp, i) => {
      console.log(`  ${i + 1}. ${mp.name} | ${mp.constituency} | ${mp.state}`);
    });
  }

  // Now update the MPLADS data with the matched MPs
  if (matches.length > 0) {
    console.log('\nUpdating MPLADS allocations...');

    // Read the allocations CSV to get the amounts
    const content = fs.readFileSync('D:/KYN/Allocated Limit for MPs.csv', 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());
    const headers = parseCSVLine(lines[0].replace(/^\uFEFF/, ''));

    const csvData = new Map();
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length !== headers.length) continue;
      const record = {};
      headers.forEach((h, idx) => { record[h.trim()] = values[idx]?.trim() || ''; });
      const key = `${record["Hon'ble Member Of Parliament"]}|${record['Constituency']}`;
      csvData.set(key, record);
    }

    const allocationsToInsert = [];

    for (const match of matches) {
      const key = `${match.csv.name}|${match.csv.constituency}`;
      const record = csvData.get(key);

      if (record) {
        allocationsToInsert.push({
          mp_id: match.db.id,
          mp_name: match.csv.name,
          constituency: match.csv.constituency,
          state: match.csv.state,
          allocated_amount: parseIndianCurrency(record['Allocated Amount ( ₹ )']),
        });
      }
    }

    if (allocationsToInsert.length > 0) {
      const { error } = await supabase
        .from('mplads_allocations')
        .upsert(allocationsToInsert, { onConflict: 'mp_id' });

      if (error) {
        console.error('Error inserting allocations:', error.message);
      } else {
        console.log(`Inserted ${allocationsToInsert.length} allocations`);
      }
    }

    // Now we need to also import works for these newly matched MPs
    console.log('\nImporting works for newly matched MPs...');

    const matchedMpIds = new Map();
    for (const match of matches) {
      matchedMpIds.set(`${match.csv.name}|${normalizeConstituency(match.csv.constituency)}`, match.db.id);
    }

    // Import from each works file
    const workFiles = [
      { file: 'Works Completed.csv', status: 'Completed' },
      { file: 'Works Sanctioned.csv', status: 'Sanctioned' },
      { file: 'Works Recommended.csv', status: 'Recommended' },
    ];

    for (const { file, status } of workFiles) {
      const filePath = `D:/KYN/${file}`;
      if (!fs.existsSync(filePath)) continue;

      console.log(`Processing ${file}...`);

      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n').filter(l => l.trim());
      const headers = parseCSVLine(lines[0].replace(/^\uFEFF/, ''));

      const works = [];

      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length !== headers.length) continue;

        const record = {};
        headers.forEach((h, idx) => { record[h.trim()] = values[idx]?.trim() || ''; });

        const mpName = record["Hon'ble Member Of Parliament"];
        const constituency = record['Constituency'];
        const key = `${mpName}|${normalizeConstituency(constituency)}`;

        const mpId = matchedMpIds.get(key);
        if (!mpId) continue;

        const workField = record['Work'] || '';
        let workId = `WORK_${i}`;
        const idMatch = workField.match(/^(.+\/\d+)-/);
        if (idMatch) {
          workId = idMatch[1];
        }

        let recommendedAmount = 0;
        let finalAmount = null;

        if (status === 'Recommended' || status === 'Sanctioned') {
          recommendedAmount = parseIndianCurrency(record['RECOMMENDED AMOUNT ( ₹ )']);
        }
        if (status === 'Completed') {
          finalAmount = parseIndianCurrency(record['FINAL AMOUNT ( ₹ )']);
          recommendedAmount = finalAmount;
        }

        works.push({
          work_id: workId,
          mp_id: mpId,
          category: record['Work Category'] || 'Normal/Others',
          work_type: record['Work'] || '',
          description: record['Work Description'] || '',
          state: record['State'] || '',
          district: record['IDA'] || '',
          recommended_amount: recommendedAmount,
          sanctioned_amount: status === 'Sanctioned' ? recommendedAmount : null,
          final_amount: finalAmount,
          status: status,
        });
      }

      if (works.length > 0) {
        // Deduplicate
        const uniqueWorks = new Map();
        for (const work of works) {
          uniqueWorks.set(work.work_id, work);
        }

        const deduped = Array.from(uniqueWorks.values());

        // Insert in batches
        const batchSize = 50;
        let inserted = 0;
        for (let i = 0; i < deduped.length; i += batchSize) {
          const batch = deduped.slice(i, i + batchSize);
          const { error } = await supabase
            .from('mplads_works')
            .upsert(batch, { onConflict: 'work_id', ignoreDuplicates: true });

          if (!error) {
            inserted += batch.length;
          }
        }

        console.log(`  Inserted ${inserted} ${status} works`);
      }
    }
  }

  console.log('\nDone!');
}

main().catch(console.error);
