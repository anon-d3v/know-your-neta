/**
 * MPLADS Data Import Script
 *
 * This script imports MPLADS (MP Local Area Development Scheme) data from CSV files
 * into Supabase database tables.
 *
 * Usage:
 *   node scripts/import-mplads.js
 *
 * Prerequisites:
 *   1. Create the required tables in Supabase (see schema below)
 *   2. Set environment variables: SUPABASE_URL, SUPABASE_SERVICE_KEY
 *   3. Place CSV files in D:\KYN\ directory
 */

// Load environment variables from .env file
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const CSV_DIR = 'D:\\KYN';
const CSV_FILES = {
  allocations: 'Allocated Limit for MPs.csv',
  worksRecommended: 'Works Recommended.csv',
  worksSanctioned: 'Works Sanctioned.csv',
  worksCompleted: 'Works Completed.csv',
  expenditures: 'Expenditure on Completed and On-going Works as on Date.csv',
};

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Use service key for admin operations

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables are required');
  console.error('Set them in your environment or .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================================
// CSV Parsing Utilities
// ============================================================================

/**
 * Parse a CSV file and return array of objects
 */
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());

  if (lines.length === 0) return [];

  // Parse header (handle BOM)
  const headerLine = lines[0].replace(/^\uFEFF/, '');
  const headers = parseCSVLine(headerLine);

  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const record = {};
      headers.forEach((header, idx) => {
        record[header.trim()] = values[idx]?.trim() || '';
      });
      records.push(record);
    }
  }

  return records;
}

/**
 * Parse a single CSV line handling quoted fields
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

/**
 * Parse Indian currency format (e.g., "9,80,00,000" or "14,12,89,442")
 */
function parseIndianCurrency(str) {
  if (!str) return 0;
  // Remove currency symbol, spaces, and commas
  const cleaned = str.replace(/[₹\s,]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Parse date in various formats
 */
function parseDate(str) {
  if (!str || str === 'N/A') return null;

  // Try DD-MMM-YYYY format (e.g., "22-Jul-2024")
  const match = str.match(/(\d{1,2})-([A-Za-z]{3})-(\d{4})/);
  if (match) {
    const months = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
      'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
      'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    const [, day, mon, year] = match;
    const month = months[mon];
    if (month) {
      return `${year}-${month}-${day.padStart(2, '0')}`;
    }
  }

  return null;
}

/**
 * Normalize MP name for matching
 */
function normalizeName(name) {
  if (!name) return '';
  return name
    .toUpperCase()
    .replace(/^(SHRI|SMT|DR|PROF|KU)\s+/i, '') // Remove prefixes
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalize constituency name for matching
 */
function normalizeConstituency(constituency) {
  if (!constituency) return '';
  return constituency
    .toUpperCase()
    .replace(/\s*\(SC\)\s*/g, '') // Remove (SC) with any surrounding spaces
    .replace(/\s*\(ST\)\s*/g, '') // Remove (ST) with any surrounding spaces
    .replace(/\s+/g, ' ')  // Normalize multiple spaces to single space
    .trim();
}

// ============================================================================
// MP Matching
// ============================================================================

let mpCache = new Map(); // name+constituency -> mp_id
let mpByName = new Map(); // normalized name -> mp record

/**
 * Load all MPs from database for matching
 */
async function loadMPs() {
  console.log('Loading MPs from database...');

  const { data: mps, error } = await supabase
    .from('mps')
    .select('id, full_name, constituency, state_ut');

  if (error) {
    console.error('Error loading MPs:', error);
    throw error;
  }

  console.log(`Loaded ${mps.length} MPs`);

  // Build lookup maps
  mps.forEach(mp => {
    const normalizedName = normalizeName(mp.full_name);
    const normalizedConstituency = normalizeConstituency(mp.constituency);

    // Primary key: name + constituency
    const key = `${normalizedName}|${normalizedConstituency}`;
    mpCache.set(key, mp.id);

    // Secondary: just name (for fuzzy matching)
    if (!mpByName.has(normalizedName)) {
      mpByName.set(normalizedName, []);
    }
    mpByName.get(normalizedName).push(mp);
  });

  return mps;
}

/**
 * Find MP ID by name and constituency
 */
function findMPId(mpName, constituency) {
  const normalizedName = normalizeName(mpName);
  const normalizedConstituency = normalizeConstituency(constituency);

  // Try exact match first
  const exactKey = `${normalizedName}|${normalizedConstituency}`;
  if (mpCache.has(exactKey)) {
    return mpCache.get(exactKey);
  }

  // Try matching by name only (if unique)
  const candidates = mpByName.get(normalizedName);
  if (candidates && candidates.length === 1) {
    return candidates[0].id;
  }

  // Try partial name match
  for (const [name, mps] of mpByName.entries()) {
    if (name.includes(normalizedName) || normalizedName.includes(name)) {
      if (mps.length === 1) {
        return mps[0].id;
      }
      // Check constituency match among candidates
      for (const mp of mps) {
        if (normalizeConstituency(mp.constituency) === normalizedConstituency) {
          return mp.id;
        }
      }
    }
  }

  return null;
}

// ============================================================================
// Import Functions
// ============================================================================

/**
 * Import allocations from CSV
 */
async function importAllocations() {
  console.log('\n=== Importing Allocations ===');

  const filePath = path.join(CSV_DIR, CSV_FILES.allocations);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return { imported: 0, skipped: 0, errors: [] };
  }

  const records = parseCSV(filePath);
  console.log(`Parsed ${records.length} allocation records`);

  const allocations = [];
  const errors = [];
  let skipped = 0;

  for (const record of records) {
    const mpName = record["Hon'ble Member Of Parliament"];
    const constituency = record['Constituency'];
    const state = record['State Name'];
    const allocatedAmount = parseIndianCurrency(record['Allocated Amount ( ₹ )']);

    // Skip grand total row
    if (mpName === ' ' || !mpName) {
      skipped++;
      continue;
    }

    const mpId = findMPId(mpName, constituency);

    if (!mpId) {
      errors.push(`Could not match MP: ${mpName} (${constituency})`);
      skipped++;
      continue;
    }

    allocations.push({
      mp_id: mpId,
      mp_name: mpName,
      constituency: constituency,
      state: state,
      allocated_amount: allocatedAmount,
    });
  }

  // Insert in batches
  if (allocations.length > 0) {
    console.log(`Inserting ${allocations.length} allocations...`);

    const batchSize = 100;
    for (let i = 0; i < allocations.length; i += batchSize) {
      const batch = allocations.slice(i, i + batchSize);
      const { error } = await supabase
        .from('mplads_allocations')
        .upsert(batch, { onConflict: 'mp_id' });

      if (error) {
        console.error(`Batch insert error at ${i}:`, error);
        errors.push(`Batch error: ${error.message}`);
      }
    }
  }

  console.log(`Imported: ${allocations.length}, Skipped: ${skipped}`);
  if (errors.length > 0) {
    console.log(`Errors (first 10):`, errors.slice(0, 10));
  }

  return { imported: allocations.length, skipped, errors };
}

/**
 * Import works from CSV (Recommended, Sanctioned, or Completed)
 */
async function importWorks(type) {
  const fileMap = {
    'Recommended': CSV_FILES.worksRecommended,
    'Sanctioned': CSV_FILES.worksSanctioned,
    'Completed': CSV_FILES.worksCompleted,
  };

  console.log(`\n=== Importing ${type} Works ===`);

  const filePath = path.join(CSV_DIR, fileMap[type]);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return { imported: 0, skipped: 0, errors: [] };
  }

  // Read file in chunks due to large size
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());

  console.log(`File has ${lines.length} lines`);

  const headerLine = lines[0].replace(/^\uFEFF/, '');
  const headers = parseCSVLine(headerLine);

  const works = [];
  const errors = [];
  let skipped = 0;
  let processed = 0;

  // Process in batches to handle large files
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) {
      skipped++;
      continue;
    }

    const record = {};
    headers.forEach((header, idx) => {
      record[header.trim()] = values[idx]?.trim() || '';
    });

    processed++;

    const mpName = record["Hon'ble Member Of Parliament"];
    const constituency = record['Constituency'];

    // Extract work ID properly - format is like "WS/MP641/2024-2025/133906-Description text"
    // The ID portion is everything before the last dash followed by text
    const workField = record['Work'] || '';
    let workId = `WORK_${i}`;

    // Match pattern: ends with /NUMBER-text, extract everything up to and including the number
    const idMatch = workField.match(/^(.+\/\d+)-/);
    if (idMatch) {
      workId = idMatch[1]; // e.g., "WS/MP641/2024-2025/133906"
    } else if (workField) {
      // Fallback: use the whole field if no match (shouldn't happen normally)
      workId = workField.substring(0, 100); // Limit length
    }

    if (!mpName) {
      skipped++;
      continue;
    }

    const mpId = findMPId(mpName, constituency);

    if (!mpId) {
      if (errors.length < 100) {
        errors.push(`Could not match MP: ${mpName} (${constituency})`);
      }
      skipped++;
      continue;
    }

    // Determine amount field based on type
    let recommendedAmount = 0;
    let sanctionedAmount = null;
    let finalAmount = null;

    if (type === 'Recommended' || type === 'Sanctioned') {
      recommendedAmount = parseIndianCurrency(record['RECOMMENDED AMOUNT ( ₹ )']);
    }
    if (type === 'Completed') {
      finalAmount = parseIndianCurrency(record['FINAL AMOUNT ( ₹ )']);
      recommendedAmount = finalAmount; // Use final as recommended if not available
    }

    const work = {
      work_id: workId,
      mp_id: mpId,
      category: record['Work Category'] || 'Normal/Others',
      work_type: record['Work'] || '',
      description: record['Work Description'] || '',
      state: record['State'] || '',
      district: record['IDA'] || '',
      recommended_amount: recommendedAmount,
      sanctioned_amount: type === 'Sanctioned' ? recommendedAmount : sanctionedAmount,
      final_amount: finalAmount,
      status: type,
      recommendation_date: parseDate(record['Recommendation Date']),
      completion_date: type === 'Completed' ? parseDate(record['Completed Date']) : null,
      rating: record['Average Rating'] && record['Average Rating'] !== 'N/A'
        ? parseFloat(record['Average Rating']) : null,
      has_image: record['Image'] === 'Images',
    };

    works.push(work);

    // Insert in batches of 500
    if (works.length >= 500) {
      const inserted = await insertWorksBatch(works, errors);
      works.length = 0;
      console.log(`Processed ${processed} records, batch inserted ${inserted}...`);
    }
  }

  // Insert remaining
  if (works.length > 0) {
    const inserted = await insertWorksBatch(works, errors);
    console.log(`Final batch inserted ${inserted}...`);
  }

  console.log(`Imported: ${processed - skipped}, Skipped: ${skipped}`);
  if (errors.length > 0) {
    console.log(`Errors (first 10):`, errors.slice(0, 10));
  }

  return { imported: processed - skipped, skipped, errors };
}

/**
 * Insert works batch - deduplicate within batch first, then bulk insert
 */
async function insertWorksBatch(works, errors) {
  // Deduplicate by work_id within the batch (keep latest/most complete)
  const uniqueWorks = new Map();
  for (const work of works) {
    const existing = uniqueWorks.get(work.work_id);
    if (!existing) {
      uniqueWorks.set(work.work_id, work);
    } else {
      // Keep the one with more complete data (prefer Completed > Sanctioned > Recommended)
      const statusPriority = { 'Completed': 3, 'Sanctioned': 2, 'Recommended': 1 };
      if ((statusPriority[work.status] || 0) > (statusPriority[existing.status] || 0)) {
        uniqueWorks.set(work.work_id, work);
      }
    }
  }

  const deduped = Array.from(uniqueWorks.values());

  // Insert in smaller sub-batches to avoid timeout
  const subBatchSize = 50;
  let totalInserted = 0;

  for (let i = 0; i < deduped.length; i += subBatchSize) {
    const subBatch = deduped.slice(i, i + subBatchSize);

    const { error } = await supabase
      .from('mplads_works')
      .upsert(subBatch, {
        onConflict: 'work_id',
        ignoreDuplicates: false, // Allow updates so Completed/Sanctioned can overwrite Recommended
      });

    if (error) {
      // Only log unique errors
      if (!error.message.includes('duplicate') && errors.length < 20) {
        errors.push(`Batch error: ${error.message}`);
      }
    } else {
      totalInserted += subBatch.length;
    }
  }

  return totalInserted;
}

/**
 * Import expenditures from CSV
 */
async function importExpenditures() {
  console.log('\n=== Importing Expenditures ===');

  const filePath = path.join(CSV_DIR, CSV_FILES.expenditures);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return { imported: 0, skipped: 0, errors: [] };
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());

  console.log(`File has ${lines.length} lines`);

  const headerLine = lines[0].replace(/^\uFEFF/, '');
  const headers = parseCSVLine(headerLine);

  const expenditures = [];
  const errors = [];
  let skipped = 0;
  let processed = 0;

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) {
      skipped++;
      continue;
    }

    const record = {};
    headers.forEach((header, idx) => {
      record[header.trim()] = values[idx]?.trim() || '';
    });

    processed++;

    const workId = record['Work Id'];
    const vendorName = record['Vendor Name'];
    const amount = parseIndianCurrency(record['Fund Disbursed Amount ( ₹ )']);
    const expenditureDate = parseDate(record['Expenditure Date']);
    const paymentStatus = record['Work Status'] || 'Payment Success';

    if (!workId || !vendorName) {
      skipped++;
      continue;
    }

    expenditures.push({
      work_id: workId,
      vendor_name: vendorName,
      amount: amount,
      expenditure_date: expenditureDate,
      payment_status: paymentStatus,
    });

    // Insert in batches of 500
    if (expenditures.length >= 500) {
      const { error } = await supabase
        .from('mplads_expenditures')
        .insert(expenditures);

      if (error) {
        console.error('Batch insert error:', error.message);
        errors.push(`Batch error: ${error.message}`);
      }

      expenditures.length = 0;
      console.log(`Processed ${processed} records...`);
    }
  }

  // Insert remaining
  if (expenditures.length > 0) {
    const { error } = await supabase
      .from('mplads_expenditures')
      .insert(expenditures);

    if (error) {
      errors.push(`Final batch error: ${error.message}`);
    }
  }

  console.log(`Imported: ${processed - skipped}, Skipped: ${skipped}`);
  if (errors.length > 0) {
    console.log(`Errors (first 10):`, errors.slice(0, 10));
  }

  return { imported: processed - skipped, skipped, errors };
}

// ============================================================================
// Main
// ============================================================================

/**
 * Clear tables for fresh import
 */
async function clearTables() {
  console.log('\n=== Clearing Existing Data ===');

  // Delete in order to respect foreign keys
  const tables = ['mplads_expenditures', 'mplads_works', 'mplads_allocations'];

  for (const table of tables) {
    const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) {
      console.log(`Warning: Could not clear ${table}: ${error.message}`);
    } else {
      console.log(`Cleared ${table}`);
    }
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║           MPLADS Data Import Script                        ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log();
  console.log(`CSV Directory: ${CSV_DIR}`);
  console.log(`Supabase URL: ${supabaseUrl}`);
  console.log();

  // Check for --clear flag
  const shouldClear = process.argv.includes('--clear');
  if (shouldClear) {
    await clearTables();
  }

  try {
    // Load MPs for matching
    await loadMPs();

    // Import in order: Recommended → Sanctioned → Completed
    // This ensures more advanced statuses (Completed/Sanctioned) overwrite Recommended
    // Completed is the final/most important status
    const results = {
      allocations: await importAllocations(),
      worksRecommended: await importWorks('Recommended'),
      worksSanctioned: await importWorks('Sanctioned'),
      worksCompleted: await importWorks('Completed'),
      expenditures: await importExpenditures(),
    };

    // Summary
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                    Import Summary                          ║');
    console.log('╚════════════════════════════════════════════════════════════╝');

    let totalImported = 0;
    let totalSkipped = 0;
    let totalErrors = 0;

    for (const [name, result] of Object.entries(results)) {
      console.log(`\n${name}:`);
      console.log(`  Imported: ${result.imported}`);
      console.log(`  Skipped:  ${result.skipped}`);
      console.log(`  Errors:   ${result.errors.length}`);

      totalImported += result.imported;
      totalSkipped += result.skipped;
      totalErrors += result.errors.length;
    }

    console.log('\n────────────────────────────────────────');
    console.log(`Total Imported: ${totalImported}`);
    console.log(`Total Skipped:  ${totalSkipped}`);
    console.log(`Total Errors:   ${totalErrors}`);
    console.log('\nImport completed!');

  } catch (error) {
    console.error('\nFatal error:', error);
    process.exit(1);
  }
}

main();
