-- ================================================
-- KYN App Database Schema for Supabase
-- ================================================

-- Run this SQL in the Supabase SQL Editor to create the database schema

-- ================================================
-- Table: mps (Main MP profiles)
-- ================================================
CREATE TABLE IF NOT EXISTS mps (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,

  -- Basic Info
  full_name TEXT NOT NULL,
  constituency TEXT NOT NULL,
  state_ut TEXT NOT NULL,
  political_party TEXT NOT NULL,
  age INTEGER NOT NULL,
  pan_card_status TEXT,

  -- Education
  education_qualification TEXT,
  education_details TEXT,

  -- Financial
  financial_year INTEGER DEFAULT 2024,
  movable_assets BIGINT DEFAULT 0,
  immovable_assets BIGINT DEFAULT 0,
  total_assets BIGINT DEFAULT 0,

  -- Criminal
  has_criminal_cases BOOLEAN DEFAULT FALSE,
  total_criminal_cases INTEGER DEFAULT 0,
  serious_ipc_sections INTEGER DEFAULT 0,
  other_ipc_sections INTEGER DEFAULT 0,

  -- Re-election tracking
  is_re_elected BOOLEAN DEFAULT FALSE,
  assets_2019 BIGINT,
  asset_growth_percentage NUMERIC(10,2),

  -- Image reference
  photo_url TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_mps_state ON mps(state_ut);
CREATE INDEX IF NOT EXISTS idx_mps_party ON mps(political_party);
CREATE INDEX IF NOT EXISTS idx_mps_criminal ON mps(has_criminal_cases);
CREATE INDEX IF NOT EXISTS idx_mps_re_elected ON mps(is_re_elected);
CREATE INDEX IF NOT EXISTS idx_mps_total_assets ON mps(total_assets);
CREATE INDEX IF NOT EXISTS idx_mps_full_name ON mps(full_name);

-- ================================================
-- Table: mp_charges (Criminal charges)
-- ================================================
CREATE TABLE IF NOT EXISTS mp_charges (
  id SERIAL PRIMARY KEY,
  mp_id TEXT REFERENCES mps(id) ON DELETE CASCADE,
  count INTEGER NOT NULL,
  description TEXT NOT NULL,
  ipc_section TEXT,

  UNIQUE(mp_id, description)
);

CREATE INDEX IF NOT EXISTS idx_charges_mp ON mp_charges(mp_id);

-- ================================================
-- Table: parties (Political parties)
-- ================================================
CREATE TABLE IF NOT EXISTS parties (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  abbreviation TEXT NOT NULL,
  color TEXT NOT NULL,
  founded TEXT,
  headquarters TEXT,
  history TEXT,
  president TEXT,
  wikipedia_url TEXT,
  symbol_url TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- Table: app_stats (Pre-computed statistics)
-- ================================================
CREATE TABLE IF NOT EXISTS app_stats (
  id TEXT PRIMARY KEY DEFAULT 'main',
  total_mps INTEGER,
  total_assets BIGINT,
  mps_with_cases INTEGER,
  mps_without_cases INTEGER,
  re_elected_count INTEGER,
  first_time_count INTEGER,
  party_distribution JSONB,
  state_distribution JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- Enable Row Level Security (RLS)
-- ================================================
ALTER TABLE mps ENABLE ROW LEVEL SECURITY;
ALTER TABLE mp_charges ENABLE ROW LEVEL SECURITY;
ALTER TABLE parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_stats ENABLE ROW LEVEL SECURITY;

-- Allow public read access (no auth required)
CREATE POLICY "Public read access" ON mps FOR SELECT USING (true);
CREATE POLICY "Public read access" ON mp_charges FOR SELECT USING (true);
CREATE POLICY "Public read access" ON parties FOR SELECT USING (true);
CREATE POLICY "Public read access" ON app_stats FOR SELECT USING (true);

-- ================================================
-- Functions
-- ================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_mps_updated_at
  BEFORE UPDATE ON mps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- Storage Buckets (run these in the dashboard)
-- ================================================
-- 1. Create bucket: mp-photos (public)
-- 2. Create bucket: party-symbols (public)

-- Set bucket policies to allow public access:
-- - mp-photos: Enable public access for SELECT
-- - party-symbols: Enable public access for SELECT
