# MPLADS Manual Import Guide

This guide explains how to manually download MPLADS CSV files and import them into Supabase.

## Overview

The MPLADS import workflow consists of:
1. **Manual Download**: Download 5 CSV files from MPLADS portal
2. **Place Files**: Save them to `D:\KYN` directory
3. **Run Import**: Execute `npm run import:mplads`

## Prerequisites

### 1. Environment Setup

Create a `.env` file in `kyn-app/` directory with:

```env
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
```

> **Important**: Use the **Service Role Key** (not the anon key) for imports. Find it in Supabase Dashboard → Settings → API → Service Role Key.

### 2. Database Schema

Ensure the MPLADS tables exist in your Supabase database. If not already created, run the SQL from [`mplads-schema.sql`](./mplads-schema.sql) in Supabase SQL Editor.

## Step-by-Step Import Process

### Step 1: Download CSV Files from MPLADS Portal

1. **Visit MPLADS Portal**: https://mplads.gov.in/
2. **Navigate to Public Reports Section**
3. **Download these 5 files** (save them with exact names):

   | File Name | Description |
   |-----------|-------------|
   | `Allocated Limit for MPs.csv` | MP-wise allocated funds |
   | `Works Recommended.csv` | Works that are recommended |
   | `Works Sanctioned.csv` | Works that are sanctioned |
   | `Works Completed.csv` | Works that are completed |
   | `Expenditure on Completed and On-going Works as on Date.csv` | Expenditure details |

4. **Save Location**: Place all 5 CSV files in `D:\KYN` directory

### Step 2: Verify Files

Check that all files are present:

```cmd
dir D:\KYN\*.csv
```

You should see:
```
Allocated Limit for MPs.csv
Works Recommended.csv
Works Sanctioned.csv
Works Completed.csv
Expenditure on Completed and On-going Works as on Date.csv
```

### Step 3: Run Import Script

From the `kyn-app/` directory:

```cmd
npm run import:mplads
```

**Optional**: To clear existing data and do a fresh import:

```cmd
npm run import:mplads -- --clear
```

### Step 4: Monitor Progress

The import script will:
- ✅ Load MPs from database for matching
- ✅ Import allocations (1 record per MP)
- ✅ Import completed works (highest priority)
- ✅ Import sanctioned works
- ✅ Import recommended works
- ✅ Import expenditures
- ✅ Display summary statistics

**Expected output:**
```
╔════════════════════════════════════════════════════════════╗
║           MPLADS Data Import Script                        ║
╚════════════════════════════════════════════════════════════╝

CSV Directory: D:\KYN
Supabase URL: https://your-project.supabase.co

Loading MPs from database...
Loaded 543 MPs

=== Importing Allocations ===
Parsed 543 allocation records
Inserting 543 allocations...
Imported: 543, Skipped: 0

=== Importing Completed Works ===
File has 50000 lines
...
```

## Duplicate Handling

The import script **handles duplicates automatically**:

- **Allocations**: Uses `upsert` with `mp_id` as conflict key
  - Re-running updates existing records with new data
  
- **Works**: Uses `upsert` with `work_id` as conflict key
  - Duplicate work IDs are skipped (`ignoreDuplicates: true`)
  - Completed status takes priority over Sanctioned/Recommended
  
- **Expenditures**: Regular insert with database constraints preventing duplicates

**You can safely re-run the import** without worrying about duplicate records.

## Updating Data

To refresh MPLADS data:

1. Download fresh CSV files from MPLADS portal (overwrite old ones in `D:\KYN`)
2. Run: `npm run import:mplads`
3. The script will update changed records automatically

## Troubleshooting

### Error: Missing CSV Files

```
Error: File not found: D:\KYN\Allocated Limit for MPs.csv
```

**Solution**: Ensure all 5 CSV files are in `D:\KYN` with exact file names (case-sensitive).

### Error: Missing Environment Variables

```
Error: SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables are required
```

**Solution**: Create `.env` file in `kyn-app/` directory with Supabase credentials.

### Error: Could not match MP

```
Could not match MP: SHRI XYZ (Constituency Name)
```

**Solution**: This is normal for MPs whose names don't exactly match the database. The script will skip these records. Check the summary to see how many were skipped.

### Error: Database Connection Failed

```
Error loading MPs: connect ECONNREFUSED
```

**Solution**: 
- Check your internet connection
- Verify SUPABASE_URL is correct
- Ensure Supabase project is not paused

## Data Verification

After import, verify data in Supabase:

1. Go to https://app.supabase.com
2. Select your project → Table Editor
3. Check these tables:
   - `mplads_allocations` - Should have ~543 records (one per MP)
   - `mplads_works` - Should have 100K+ records
   - `mplads_expenditures` - Should have 50K+ records

## CSV File Details

### Allocated Limit for MPs.csv
- **Records**: ~543 (one per MP)
- **Key Fields**: MP Name, Constituency, State, Allocated Amount
- **Imported to**: `mplads_allocations` table

### Works Recommended.csv
- **Records**: ~50,000
- **Key Fields**: Work ID, MP Name, Category, Work Type, Amount, Date
- **Imported to**: `mplads_works` table (status: 'Recommended')

### Works Sanctioned.csv
- **Records**: ~40,000
- **Key Fields**: Work ID, MP Name, Category, Work Type, Amount, Date
- **Imported to**: `mplads_works` table (status: 'Sanctioned')

### Works Completed.csv
- **Records**: ~30,000
- **Key Fields**: Work ID, MP Name, Category, Final Amount, Completion Date
- **Imported to**: `mplads_works` table (status: 'Completed')

### Expenditure on Completed and On-going Works as on Date.csv
- **Records**: ~80,000
- **Key Fields**: Work ID, Vendor Name, Amount, Expenditure Date
- **Imported to**: `mplads_expenditures` table

## Schedule for Updates

MPLADS portal typically updates data:
- **Monthly**: New expenditures and work progress
- **Quarterly**: Major updates to allocations

**Recommended**: Download fresh CSVs and re-import monthly.

## Need Help?

- **Import Script Issues**: Check [`import-mplads.js`](./import-mplads.js) for implementation details
- **Database Schema**: Review [`mplads-schema.sql`](./mplads-schema.sql)
- **Supabase Setup**: See [`.env.example`](../.env.example) for environment variables

---

**Last Updated**: February 2026
