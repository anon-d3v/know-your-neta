/**
 * KYN Data Build Script
 * Parses 544 MP Profile markdown files into optimized JSON
 * Run with: npx tsx scripts/build-data.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface BasicInfo {
  fullName: string;
  constituency: string;
  stateUT: string;
  politicalParty: string;
  age: number;
  panCardStatus: 'Provided' | 'Not Provided';
}

interface FinancialInfo {
  year: number;
  movableAssets: number;
  immovableAssets: number;
  totalAssets: number;
  totalAssetsFormatted: string;
}

interface Charge {
  count: number;
  description: string;
}

interface CriminalInfo {
  hasCases: boolean;
  totalCases: number;
  seriousIPCSections: number;
  otherIPCSections: number;
  charges: Charge[];
}

interface ElectionHistoryItem {
  year: number;
  party: string;
  constituency: string;
}

interface AssetGrowth {
  assets2019: number;
  assets2019Formatted: string;
  assets2024: number;
  assets2024Formatted: string;
  assetChange: number;
  assetChangeFormatted: string;
  growthPercentage: number;
}

interface IncomeSource {
  self: string;
  spouse: string;
}

interface ReElectionInfo {
  electionHistory: ElectionHistoryItem[];
  assetGrowth: AssetGrowth;
  incomeSource: IncomeSource;
}

interface MPProfile {
  id: string;
  slug: string;
  basic: BasicInfo;
  financial: FinancialInfo;
  criminal: CriminalInfo;
  reElection: ReElectionInfo | null;
  searchText: string;
}

interface IndexData {
  meta: {
    totalMPs: number;
    generatedAt: string;
    version: string;
  };
  indexes: {
    byState: Record<string, string[]>;
    byParty: Record<string, string[]>;
    withCriminalCases: string[];
    noCriminalCases: string[];
    reElected: string[];
    firstTime: string[];
  };
  stats: {
    totalAssets: number;
    totalAssetsFormatted: string;
    avgAge: number;
    totalCriminalCases: number;
    partyDistribution: Record<string, number>;
    stateDistribution: Record<string, number>;
  };
}

// =============================================================================
// PARSING UTILITIES
// =============================================================================

function parseIndianNumber(str: string): number {
  if (!str) return 0;
  // Remove commas and parse
  const cleaned = str.replace(/,/g, '').trim();
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? 0 : num;
}

function formatCrore(amount: number): string {
  const crore = amount / 10000000;
  if (crore >= 1) {
    return `${Math.round(crore)} Crore+`;
  }
  const lakh = amount / 100000;
  if (lakh >= 1) {
    return `${Math.round(lakh)} Lakh+`;
  }
  return `${amount}`;
}

function generateId(filename: string): string {
  return filename
    .replace('.md', '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// =============================================================================
// MARKDOWN PARSER
// =============================================================================

function parseMarkdownToMP(content: string, filename: string): MPProfile {
  const id = generateId(filename);
  const slug = filename.replace('.md', '');

  // Parse Basic Information
  const nameMatch = content.match(/^# (.+)$/m);
  const fullName = nameMatch ? nameMatch[1].trim() : 'Unknown';

  const constituencyMatch = content.match(/\| \*\*Constituency\*\* \| (.+?) \|/);
  const constituency = constituencyMatch ? constituencyMatch[1].trim() : 'Unknown';

  const stateMatch = content.match(/\| \*\*State\/UT\*\* \| (.+?) \|/);
  const stateUT = stateMatch ? stateMatch[1].trim() : 'Unknown';

  const partyMatch = content.match(/\| \*\*Political Party\*\* \| (.+?) \|/);
  const politicalParty = partyMatch ? partyMatch[1].trim() : 'Unknown';

  const ageMatch = content.match(/\| \*\*Age\*\* \| (\d+) years \|/);
  const age = ageMatch ? parseInt(ageMatch[1], 10) : 0;

  const panMatch = content.match(/\| \*\*PAN Card Status\*\* \| (.+?) \|/);
  const panCardStatus = panMatch && panMatch[1].includes('Provided') ? 'Provided' : 'Not Provided';

  const basic: BasicInfo = {
    fullName,
    constituency,
    stateUT,
    politicalParty,
    age,
    panCardStatus,
  };

  // Parse Financial Information
  const movableMatch = content.match(/\| \*\*Movable Assets\*\* \| ([\d,]+) \|/);
  const movableAssets = movableMatch ? parseIndianNumber(movableMatch[1]) : 0;

  const immovableMatch = content.match(/\| \*\*Immovable Assets\*\* \| ([\d,]+) \|/);
  const immovableAssets = immovableMatch ? parseIndianNumber(immovableMatch[1]) : 0;

  const totalMatch = content.match(/\| \*\*Total Assets\*\* \| ([\d,]+)/);
  const totalAssets = totalMatch ? parseIndianNumber(totalMatch[1]) : movableAssets + immovableAssets;

  const financial: FinancialInfo = {
    year: 2024,
    movableAssets,
    immovableAssets,
    totalAssets,
    totalAssetsFormatted: formatCrore(totalAssets),
  };

  // Parse Criminal Record
  const noCriminalMatch = content.match(/\*\*No criminal cases declared\*\*/);
  const hasCases = !noCriminalMatch;

  let totalCases = 0;
  let seriousIPCSections = 0;
  let otherIPCSections = 0;
  const charges: Charge[] = [];

  if (hasCases) {
    const totalCasesMatch = content.match(/\| \*\*Total Criminal Cases\*\* \| (\d+) \|/);
    totalCases = totalCasesMatch ? parseInt(totalCasesMatch[1], 10) : 0;

    const seriousMatch = content.match(/\| \*\*Serious IPC Sections\*\* \| (\d+) \|/);
    seriousIPCSections = seriousMatch ? parseInt(seriousMatch[1], 10) : 0;

    const otherMatch = content.match(/\| \*\*Other IPC Sections\*\* \| (\d+) \|/);
    otherIPCSections = otherMatch ? parseInt(otherMatch[1], 10) : 0;

    // Parse charges list
    const chargeRegex = /- \*\*(\d+)\*\* charge\(s\): (.+)/g;
    let chargeMatch;
    while ((chargeMatch = chargeRegex.exec(content)) !== null) {
      charges.push({
        count: parseInt(chargeMatch[1], 10),
        description: chargeMatch[2].trim(),
      });
    }
  }

  const criminal: CriminalInfo = {
    hasCases,
    totalCases,
    seriousIPCSections,
    otherIPCSections,
    charges,
  };

  // Parse Re-election Information (if present)
  let reElection: ReElectionInfo | null = null;
  const reElectedMatch = content.match(/## Re-elected MP Information/);

  if (reElectedMatch) {
    // Parse election history
    const electionHistory: ElectionHistoryItem[] = [];
    const historyRegex = /\| \*\*(\d{4})\*\* \| (.+?) \| (.+?) \|/g;
    let historyMatch;
    while ((historyMatch = historyRegex.exec(content)) !== null) {
      electionHistory.push({
        year: parseInt(historyMatch[1], 10),
        party: historyMatch[2].trim(),
        constituency: historyMatch[3].trim(),
      });
    }

    // Parse asset growth
    const assets2019Match = content.match(/\| \*\*Assets in 2019\*\* \| ([\d,]+)/);
    const assets2019 = assets2019Match ? parseIndianNumber(assets2019Match[1]) : 0;

    const assets2024Match = content.match(/\| \*\*Assets in 2024\*\* \| ([\d,]+)/);
    const assets2024 = assets2024Match ? parseIndianNumber(assets2024Match[1]) : totalAssets;

    const assetChangeMatch = content.match(/\| \*\*Asset Change\*\* \| ([\d,]+)/);
    const assetChange = assetChangeMatch ? parseIndianNumber(assetChangeMatch[1]) : assets2024 - assets2019;

    const growthMatch = content.match(/\| \*\*Growth Percentage\*\* \| (\d+)%/);
    const growthPercentage = growthMatch ? parseInt(growthMatch[1], 10) : 0;

    // Parse income sources
    const selfIncomeMatch = content.match(/\*\*Self:\*\* (.+)/);
    const selfIncome = selfIncomeMatch ? selfIncomeMatch[1].trim() : 'Not disclosed';

    const spouseIncomeMatch = content.match(/\*\*Spouse:\*\* (.+)/);
    const spouseIncome = spouseIncomeMatch ? spouseIncomeMatch[1].trim() : 'Not disclosed';

    reElection = {
      electionHistory,
      assetGrowth: {
        assets2019,
        assets2019Formatted: formatCrore(assets2019),
        assets2024,
        assets2024Formatted: formatCrore(assets2024),
        assetChange,
        assetChangeFormatted: formatCrore(assetChange),
        growthPercentage,
      },
      incomeSource: {
        self: selfIncome,
        spouse: spouseIncome,
      },
    };
  }

  // Build search text for fast filtering
  const searchText = [
    fullName,
    constituency,
    stateUT,
    politicalParty,
  ].join(' ').toLowerCase();

  return {
    id,
    slug,
    basic,
    financial,
    criminal,
    reElection,
    searchText,
  };
}

// =============================================================================
// INDEX BUILDER
// =============================================================================

function buildIndexes(mps: MPProfile[]): IndexData {
  const byState: Record<string, string[]> = {};
  const byParty: Record<string, string[]> = {};
  const withCriminalCases: string[] = [];
  const noCriminalCases: string[] = [];
  const reElected: string[] = [];
  const firstTime: string[] = [];

  let totalAssets = 0;
  let totalAge = 0;
  let totalCriminalCases = 0;
  const partyDistribution: Record<string, number> = {};
  const stateDistribution: Record<string, number> = {};

  for (const mp of mps) {
    const { id, basic, financial, criminal, reElection } = mp;

    // Index by state
    if (!byState[basic.stateUT]) {
      byState[basic.stateUT] = [];
    }
    byState[basic.stateUT].push(id);

    // Index by party
    if (!byParty[basic.politicalParty]) {
      byParty[basic.politicalParty] = [];
    }
    byParty[basic.politicalParty].push(id);

    // Index by criminal cases
    if (criminal.hasCases) {
      withCriminalCases.push(id);
    } else {
      noCriminalCases.push(id);
    }

    // Index by re-election status
    if (reElection) {
      reElected.push(id);
    } else {
      firstTime.push(id);
    }

    // Aggregate stats
    totalAssets += financial.totalAssets;
    totalAge += basic.age;
    totalCriminalCases += criminal.totalCases;

    // Party distribution
    partyDistribution[basic.politicalParty] = (partyDistribution[basic.politicalParty] || 0) + 1;

    // State distribution
    stateDistribution[basic.stateUT] = (stateDistribution[basic.stateUT] || 0) + 1;
  }

  return {
    meta: {
      totalMPs: mps.length,
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
    },
    indexes: {
      byState,
      byParty,
      withCriminalCases,
      noCriminalCases,
      reElected,
      firstTime,
    },
    stats: {
      totalAssets,
      totalAssetsFormatted: formatCrore(totalAssets),
      avgAge: Math.round(totalAge / mps.length),
      totalCriminalCases,
      partyDistribution,
      stateDistribution,
    },
  };
}

// =============================================================================
// MAIN BUILD FUNCTION
// =============================================================================

async function buildMPDatabase() {
  console.log('🏛️  KYN Data Build Script');
  console.log('========================\n');

  const profilesDir = path.resolve(__dirname, '../../MP_Profiles');
  const outputDir = path.resolve(__dirname, '../src/data');

  // Check if profiles directory exists
  if (!fs.existsSync(profilesDir)) {
    console.error(`❌ Error: MP_Profiles directory not found at ${profilesDir}`);
    process.exit(1);
  }

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Created output directory: ${outputDir}`);
  }

  // Read all markdown files
  const files = fs.readdirSync(profilesDir).filter(f => f.endsWith('.md'));
  console.log(`📄 Found ${files.length} markdown files\n`);

  // Parse all files
  const mps: MPProfile[] = [];
  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    try {
      const filePath = path.join(profilesDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const mp = parseMarkdownToMP(content, file);
      mps.push(mp);
      successCount++;
    } catch (error) {
      console.error(`❌ Error parsing ${file}:`, error);
      errorCount++;
    }
  }

  console.log(`✅ Successfully parsed: ${successCount} files`);
  if (errorCount > 0) {
    console.log(`❌ Failed to parse: ${errorCount} files`);
  }

  // Sort MPs by name
  mps.sort((a, b) => a.basic.fullName.localeCompare(b.basic.fullName));

  // Build indexes
  const indexes = buildIndexes(mps);

  // Write MP data
  const mpDataPath = path.join(outputDir, 'mp-data.json');
  fs.writeFileSync(mpDataPath, JSON.stringify(mps, null, 2));
  console.log(`\n📊 MP data written to: ${mpDataPath}`);

  // Write indexes
  const indexPath = path.join(outputDir, 'index.json');
  fs.writeFileSync(indexPath, JSON.stringify(indexes, null, 2));
  console.log(`📇 Index data written to: ${indexPath}`);

  // Print summary stats
  console.log('\n📈 Summary Statistics:');
  console.log(`   Total MPs: ${indexes.meta.totalMPs}`);
  console.log(`   Total Assets: ${indexes.stats.totalAssetsFormatted}`);
  console.log(`   Average Age: ${indexes.stats.avgAge} years`);
  console.log(`   Total Criminal Cases: ${indexes.stats.totalCriminalCases}`);
  console.log(`   MPs with Cases: ${indexes.indexes.withCriminalCases.length}`);
  console.log(`   MPs without Cases: ${indexes.indexes.noCriminalCases.length}`);
  console.log(`   Re-elected MPs: ${indexes.indexes.reElected.length}`);
  console.log(`   First-time MPs: ${indexes.indexes.firstTime.length}`);
  console.log(`   Unique Parties: ${Object.keys(indexes.indexes.byParty).length}`);
  console.log(`   Unique States/UTs: ${Object.keys(indexes.indexes.byState).length}`);

  console.log('\n✨ Build complete!\n');
}

// Run the build
buildMPDatabase().catch(console.error);
