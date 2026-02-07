-- ============================================================================
-- MPLADS (MP Local Area Development Scheme) Database Schema
-- ============================================================================
-- Run this SQL in your Supabase SQL Editor before running the import script.
-- ============================================================================

-- Drop existing tables if they exist (be careful in production!)
-- DROP TABLE IF EXISTS mplads_expenditures;
-- DROP TABLE IF EXISTS mplads_works;
-- DROP TABLE IF EXISTS mplads_allocations;

-- ============================================================================
-- Table: mplads_allocations
-- Stores the allocated MPLADS fund amount per MP
-- ============================================================================
CREATE TABLE IF NOT EXISTS mplads_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mp_id TEXT NOT NULL REFERENCES mps(id) ON DELETE CASCADE,
    mp_name TEXT NOT NULL,
    constituency TEXT NOT NULL,
    state TEXT NOT NULL,
    allocated_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),

    -- Ensure one allocation per MP
    CONSTRAINT unique_mp_allocation UNIQUE (mp_id)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_mplads_allocations_mp_id ON mplads_allocations(mp_id);
CREATE INDEX IF NOT EXISTS idx_mplads_allocations_state ON mplads_allocations(state);

-- ============================================================================
-- Table: mplads_works
-- Stores all MPLADS works (recommended, sanctioned, completed)
-- ============================================================================
CREATE TABLE IF NOT EXISTS mplads_works (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_id TEXT NOT NULL,
    mp_id TEXT NOT NULL REFERENCES mps(id) ON DELETE CASCADE,
    category TEXT NOT NULL DEFAULT 'Normal/Others',
    work_type TEXT NOT NULL,
    description TEXT,
    state TEXT,
    district TEXT,
    recommended_amount DECIMAL(15, 2) DEFAULT 0,
    sanctioned_amount DECIMAL(15, 2),
    final_amount DECIMAL(15, 2),
    status TEXT NOT NULL CHECK (status IN ('Recommended', 'Sanctioned', 'Completed')),
    recommendation_date DATE,
    completion_date DATE,
    rating DECIMAL(3, 1),
    has_image BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),

    -- Ensure unique work_id
    CONSTRAINT unique_work_id UNIQUE (work_id)
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_mplads_works_mp_id ON mplads_works(mp_id);
CREATE INDEX IF NOT EXISTS idx_mplads_works_status ON mplads_works(status);
CREATE INDEX IF NOT EXISTS idx_mplads_works_state ON mplads_works(state);
CREATE INDEX IF NOT EXISTS idx_mplads_works_mp_status ON mplads_works(mp_id, status);
CREATE INDEX IF NOT EXISTS idx_mplads_works_recommendation_date ON mplads_works(recommendation_date DESC);

-- ============================================================================
-- Table: mplads_expenditures
-- Stores expenditure/payment records for works
-- ============================================================================
CREATE TABLE IF NOT EXISTS mplads_expenditures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_id TEXT NOT NULL,
    vendor_name TEXT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    expenditure_date DATE,
    payment_status TEXT DEFAULT 'Payment Success' CHECK (payment_status IN ('Payment Success', 'Payment In-Progress')),
    created_at TIMESTAMPTZ DEFAULT now(),

    -- Foreign key to works table (soft reference since work_id might not exist yet)
    CONSTRAINT fk_work_id FOREIGN KEY (work_id)
        REFERENCES mplads_works(work_id)
        ON DELETE CASCADE
        DEFERRABLE INITIALLY DEFERRED
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mplads_expenditures_work_id ON mplads_expenditures(work_id);
CREATE INDEX IF NOT EXISTS idx_mplads_expenditures_date ON mplads_expenditures(expenditure_date DESC);

-- ============================================================================
-- Enable Row Level Security (RLS)
-- ============================================================================
ALTER TABLE mplads_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE mplads_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE mplads_expenditures ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on mplads_allocations"
    ON mplads_allocations FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public read access on mplads_works"
    ON mplads_works FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public read access on mplads_expenditures"
    ON mplads_expenditures FOR SELECT
    TO public
    USING (true);

-- ============================================================================
-- Helpful Views
-- ============================================================================

-- View: MP MPLADS Summary
CREATE OR REPLACE VIEW mp_mplads_summary AS
SELECT
    a.mp_id,
    a.mp_name,
    a.constituency,
    a.state,
    a.allocated_amount,
    COALESCE(w.total_works, 0) as total_works,
    COALESCE(w.recommended_count, 0) as recommended_count,
    COALESCE(w.sanctioned_count, 0) as sanctioned_count,
    COALESCE(w.completed_count, 0) as completed_count,
    COALESCE(w.total_recommended_amount, 0) as total_recommended_amount,
    COALESCE(w.total_completed_amount, 0) as total_completed_amount,
    CASE
        WHEN a.allocated_amount > 0
        THEN ROUND((COALESCE(w.total_completed_amount, 0) / a.allocated_amount) * 100, 2)
        ELSE 0
    END as utilization_percentage
FROM mplads_allocations a
LEFT JOIN (
    SELECT
        mp_id,
        COUNT(*) as total_works,
        COUNT(*) FILTER (WHERE status = 'Recommended') as recommended_count,
        COUNT(*) FILTER (WHERE status = 'Sanctioned') as sanctioned_count,
        COUNT(*) FILTER (WHERE status = 'Completed') as completed_count,
        SUM(recommended_amount) as total_recommended_amount,
        SUM(COALESCE(final_amount, sanctioned_amount, recommended_amount))
            FILTER (WHERE status = 'Completed') as total_completed_amount
    FROM mplads_works
    GROUP BY mp_id
) w ON a.mp_id = w.mp_id;

-- View: State-wise MPLADS Stats
CREATE OR REPLACE VIEW state_mplads_stats AS
SELECT
    state,
    COUNT(DISTINCT mp_id) as mp_count,
    SUM(allocated_amount) as total_allocated,
    AVG(allocated_amount) as avg_allocated
FROM mplads_allocations
GROUP BY state
ORDER BY total_allocated DESC;

-- ============================================================================
-- Update timestamp trigger
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
DROP TRIGGER IF EXISTS update_mplads_allocations_updated_at ON mplads_allocations;
CREATE TRIGGER update_mplads_allocations_updated_at
    BEFORE UPDATE ON mplads_allocations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_mplads_works_updated_at ON mplads_works;
CREATE TRIGGER update_mplads_works_updated_at
    BEFORE UPDATE ON mplads_works
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- Grant permissions (for service role)
-- ============================================================================
GRANT ALL ON mplads_allocations TO service_role;
GRANT ALL ON mplads_works TO service_role;
GRANT ALL ON mplads_expenditures TO service_role;
GRANT SELECT ON mp_mplads_summary TO anon, authenticated;
GRANT SELECT ON state_mplads_stats TO anon, authenticated;

-- ============================================================================
-- Done!
-- ============================================================================
-- After running this schema, run the import script:
-- node scripts/import-mplads.js
