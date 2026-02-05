import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const mpDataPath = path.join(__dirname, '../src/data/mp-data.json');
const mpData = JSON.parse(fs.readFileSync(mpDataPath, 'utf-8'));

interface MPProfile {
  id: string;
  slug: string;
  basic: {
    fullName: string;
    constituency: string;
    stateUT: string;
    politicalParty: string;
    age: number;
    panCardStatus: string;
  };
  education?: { qualification: string; details: string };
  financial: {
    year: number;
    movableAssets: number;
    immovableAssets: number;
    totalAssets: number;
  };
  criminal: {
    hasCases: boolean;
    totalCases: number;
    seriousIPCSections: number;
    otherIPCSections: number;
    charges: Array<{ count: number; description: string; ipcSection?: string }>;
  };
  reElection?: {
    assetGrowth?: { assets2019?: number; growthPercentage?: number };
    incomeSource?: { self?: string; spouse?: string };
  } | null;
}

async function migrateMPs() {
  console.log(`\nMigrating ${mpData.length} MPs...\n`);
  let success = 0, errors = 0;

  for (const mp of mpData as MPProfile[]) {
    try {
      const { error: mpErr } = await supabase.from('mps').upsert({
        id: mp.id,
        slug: mp.slug,
        full_name: mp.basic.fullName,
        constituency: mp.basic.constituency,
        state_ut: mp.basic.stateUT,
        political_party: mp.basic.politicalParty,
        age: mp.basic.age,
        pan_card_status: mp.basic.panCardStatus,
        education_qualification: mp.education?.qualification || null,
        education_details: mp.education?.details || null,
        financial_year: mp.financial.year,
        movable_assets: mp.financial.movableAssets,
        immovable_assets: mp.financial.immovableAssets,
        total_assets: mp.financial.totalAssets,
        has_criminal_cases: mp.criminal.hasCases,
        total_criminal_cases: mp.criminal.totalCases,
        serious_ipc_sections: mp.criminal.seriousIPCSections,
        other_ipc_sections: mp.criminal.otherIPCSections,
        is_re_elected: mp.reElection !== null,
        assets_2019: mp.reElection?.assetGrowth?.assets2019 || null,
        asset_growth_percentage: mp.reElection?.assetGrowth?.growthPercentage || null,
        photo_url: `mp-photos/${mp.id}.jpg`,
      });

      if (mpErr) {
        console.error(`Error ${mp.id}:`, mpErr.message);
        errors++;
        continue;
      }

      if (mp.criminal.charges?.length > 0) {
        const charges = mp.criminal.charges.map((c) => ({
          mp_id: mp.id,
          count: c.count,
          description: c.description,
          ipc_section: c.ipcSection || null,
        }));

        const { error } = await supabase.from('mp_charges').upsert(charges, {
          onConflict: 'mp_id,description',
          ignoreDuplicates: true,
        });
        if (error) console.error(`Charges error ${mp.id}:`, error.message);
      }

      success++;
      if (success % 50 === 0) console.log(`${success}/${mpData.length} done`);
    } catch (e) {
      console.error(`Error ${mp.id}:`, e);
      errors++;
    }
  }

  console.log(`\nDone! Success: ${success}, Errors: ${errors}`);
}

async function updateStats() {
  console.log('\nUpdating stats...');
  const { data: mps, error } = await supabase.from('mps').select('*');
  if (error || !mps) { console.error('Stats error:', error); return; }

  const partyDist: Record<string, number> = {};
  const stateDist: Record<string, number> = {};
  let totalAssets = 0, withCases = 0, reElected = 0;

  mps.forEach((mp) => {
    partyDist[mp.political_party] = (partyDist[mp.political_party] || 0) + 1;
    stateDist[mp.state_ut] = (stateDist[mp.state_ut] || 0) + 1;
    totalAssets += mp.total_assets || 0;
    if (mp.has_criminal_cases) withCases++;
    if (mp.is_re_elected) reElected++;
  });

  const { error: statsErr } = await supabase.from('app_stats').upsert({
    id: 'main',
    total_mps: mps.length,
    total_assets: totalAssets,
    mps_with_cases: withCases,
    mps_without_cases: mps.length - withCases,
    re_elected_count: reElected,
    first_time_count: mps.length - reElected,
    party_distribution: partyDist,
    state_distribution: stateDist,
    updated_at: new Date().toISOString(),
  });

  if (statsErr) console.error('Stats error:', statsErr);
  else console.log('Stats updated!');
}

async function main() {
  console.log('=== KYN Migration ===');
  console.log(`URL: ${SUPABASE_URL}`);
  console.log(`MPs: ${mpData.length}`);

  await migrateMPs();
  await updateStats();

  console.log('\n=== Done ===');
}

main().catch(console.error);
