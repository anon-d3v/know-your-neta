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

const MP_PHOTOS_DIR = path.join(__dirname, '../assets/images/mp-photos');
const PARTY_SYMBOLS_DIR = path.join(__dirname, '../assets/images/party-symbols');

async function uploadMPPhotos() {
  console.log('\nUploading MP photos...');
  if (!fs.existsSync(MP_PHOTOS_DIR)) {
    console.error(`Dir not found: ${MP_PHOTOS_DIR}`);
    return;
  }

  const files = fs.readdirSync(MP_PHOTOS_DIR);
  console.log(`Found ${files.length} photos`);

  let ok = 0, err = 0, skip = 0;

  for (const file of files) {
    const fp = path.join(MP_PHOTOS_DIR, file);
    if (fs.statSync(fp).isDirectory()) continue;

    try {
      const buf = fs.readFileSync(fp);
      const ext = path.extname(file).toLowerCase();
      const type = ext === '.png' ? 'image/png' : 'image/jpeg';

      const { error } = await supabase.storage.from('mp-photos').upload(file, buf, {
        contentType: type,
        cacheControl: '31536000',
        upsert: true,
      });

      if (error) {
        if (error.message.includes('already exists')) skip++;
        else { console.error(`${file}:`, error.message); err++; }
      } else {
        ok++;
        if (ok % 50 === 0) console.log(`${ok}/${files.length} uploaded`);
      }
    } catch (e) {
      console.error(`${file}:`, e);
      err++;
    }
  }

  console.log(`Photos done! Uploaded: ${ok}, Skipped: ${skip}, Errors: ${err}`);
}

async function uploadPartySymbols() {
  console.log('\nUploading party symbols...');
  if (!fs.existsSync(PARTY_SYMBOLS_DIR)) {
    console.error(`Dir not found: ${PARTY_SYMBOLS_DIR}`);
    return;
  }

  const files = fs.readdirSync(PARTY_SYMBOLS_DIR);
  console.log(`Found ${files.length} symbols`);

  let ok = 0, err = 0, skip = 0;

  for (const file of files) {
    const fp = path.join(PARTY_SYMBOLS_DIR, file);
    if (fs.statSync(fp).isDirectory()) continue;

    try {
      const buf = fs.readFileSync(fp);
      const ext = path.extname(file).toLowerCase();
      const type = ext === '.png' ? 'image/png' : 'image/jpeg';

      const { error } = await supabase.storage.from('party-symbols').upload(file, buf, {
        contentType: type,
        cacheControl: '31536000',
        upsert: true,
      });

      if (error) {
        if (error.message.includes('already exists')) skip++;
        else { console.error(`${file}:`, error.message); err++; }
      } else {
        ok++;
      }
    } catch (e) {
      console.error(`${file}:`, e);
      err++;
    }
  }

  console.log(`Symbols done! Uploaded: ${ok}, Skipped: ${skip}, Errors: ${err}`);
}

async function createBuckets() {
  console.log('Setting up buckets...');

  const { error: e1 } = await supabase.storage.createBucket('mp-photos', {
    public: true,
    fileSizeLimit: 5242880,
    allowedMimeTypes: ['image/jpeg', 'image/png'],
  });
  if (e1 && !e1.message.includes('already exists')) console.error('mp-photos:', e1.message);
  else console.log('mp-photos ready');

  const { error: e2 } = await supabase.storage.createBucket('party-symbols', {
    public: true,
    fileSizeLimit: 2097152,
    allowedMimeTypes: ['image/jpeg', 'image/png'],
  });
  if (e2 && !e2.message.includes('already exists')) console.error('party-symbols:', e2.message);
  else console.log('party-symbols ready');
}

async function main() {
  console.log('=== KYN Image Upload ===');
  console.log(`URL: ${SUPABASE_URL}`);

  await createBuckets();
  await uploadMPPhotos();
  await uploadPartySymbols();

  console.log('\n=== Done ===');
}

main().catch(console.error);
