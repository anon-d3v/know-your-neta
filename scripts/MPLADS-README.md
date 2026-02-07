# MPLADS Data Integration

This guide explains how to import MPLADS (Member of Parliament Local Area Development Scheme) data into the KYN app.

## Overview

The MPLADS feature displays:
- Fund allocation per MP (~₹5 Cr/year)
- Works recommended, sanctioned, and completed
- Expenditure tracking with vendor details
- Utilization percentage and progress

## CSV Files Required

Place these 5 files in `D:\KYN\`:

| File | Description | Size |
|------|-------------|------|
| `Allocated Limit for MPs.csv` | Budget per MP | Small |
| `Works Recommended.csv` | Recommended works | ~24 MB |
| `Works Sanctioned.csv` | Sanctioned works | ~17 MB |
| `Works Completed.csv` | Completed works | ~4 MB |
| `Expenditure on Completed and On-going Works as on Date.csv` | Payment details | ~11 MB |

## Setup Steps

### 1. Create Database Tables

Run the SQL schema in Supabase SQL Editor:

```bash
# Copy and paste contents of scripts/mplads-schema.sql into Supabase SQL Editor
```

Or run via psql:
```bash
psql -h your-project.supabase.co -U postgres -d postgres -f scripts/mplads-schema.sql
```

### 2. Set Environment Variables

Create/update `.env` file:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

> **Important**: Use the `service_role` key (not `anon` key) for import operations.

### 3. Run Import Script

```bash
npm run import:mplads
```

Or directly:
```bash
node scripts/import-mplads.js
```

## Database Schema

### mplads_allocations
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| mp_id | TEXT | Reference to mps.id |
| mp_name | TEXT | MP full name |
| constituency | TEXT | Constituency name |
| state | TEXT | State/UT |
| allocated_amount | DECIMAL | Total allocated (₹) |

### mplads_works
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| work_id | TEXT | Unique work identifier |
| mp_id | TEXT | Reference to mps.id |
| category | TEXT | 'Normal/Others' or 'Repair and Renovation' |
| work_type | TEXT | Type of work |
| description | TEXT | Work description |
| state | TEXT | State |
| district | TEXT | District/IDA |
| recommended_amount | DECIMAL | Recommended amount (₹) |
| sanctioned_amount | DECIMAL | Sanctioned amount (₹) |
| final_amount | DECIMAL | Final/completed amount (₹) |
| status | TEXT | 'Recommended', 'Sanctioned', 'Completed' |
| recommendation_date | DATE | Date recommended |
| completion_date | DATE | Date completed |
| rating | DECIMAL | Average rating (if available) |
| has_image | BOOLEAN | Whether work has images |

### mplads_expenditures
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| work_id | TEXT | Reference to mplads_works.work_id |
| vendor_name | TEXT | Vendor/contractor name |
| amount | DECIMAL | Disbursed amount (₹) |
| expenditure_date | DATE | Payment date |
| payment_status | TEXT | 'Payment Success' or 'Payment In-Progress' |

## API Functions

```typescript
// Fetch MP's MPLADS allocation
const allocation = await fetchMPLADSAllocation(mpId);

// Fetch MP's works (optionally filter by status)
const works = await fetchMPWorks(mpId, 'Completed');

// Fetch complete MPLADS summary for MP
const summary = await fetchMPLADSSummary(mpId);

// Fetch work expenditure details
const expenditures = await fetchWorkExpenditures(workId);
```

## React Hooks

```typescript
// In MP detail page
const { data: summary, isLoading } = useMPLADSSummary(mpId);

// Fetch works with optional status filter
const { data: works } = useMPWorks(mpId, 'Completed');

// Global MPLADS statistics
const { data: stats } = useMPLADSGlobalStats();
```

## UI Components

### MPLADSOverview
Card showing fund summary on MP detail page:
- Allocated amount
- Utilization percentage with progress bar
- Works breakdown by status
- Link to full works list

### WorkCard
Individual work item card showing:
- Work type and description
- Category and location
- Amount and date
- Status badge

## Troubleshooting

### MP Not Matched
The import script tries to match MPs by:
1. Exact name + constituency match
2. Name-only match (if unique)
3. Partial name match

If MPs aren't matched, check:
- Name spelling differences
- Prefixes (Shri/Smt/Dr) handling
- Constituency name variations

### Large File Processing
For large CSV files (20MB+), the script:
- Processes in batches of 500 records
- Shows progress every batch
- Handles memory efficiently

### Duplicate Works
Works are upserted by `work_id`, so re-running the import updates existing records.

## Data Source

Data sourced from [MPLADS Portal](https://mplads.gov.in)

## File Structure

```
scripts/
├── import-mplads.js      # Main import script
├── mplads-schema.sql     # Database schema
└── MPLADS-README.md      # This file

src/
├── api/
│   └── mplads.ts         # Supabase API functions
├── hooks/
│   └── useMPLADSData.ts  # React Query hooks
├── components/
│   └── mplads/
│       ├── MPLADSOverview.tsx
│       ├── WorkCard.tsx
│       └── index.ts
└── data/
    └── types.ts          # MPLADS TypeScript types

app/
└── mp/
    └── [slug]/
        └── works.tsx     # Works list screen
```
