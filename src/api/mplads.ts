import { supabase } from '../lib/supabase';
import type {
  MPLADSAllocation,
  MPWork,
  WorkExpenditure,
  MPLADSSummary,
  WorkStatus,
} from '../data/types';

// Database row types (snake_case from Supabase)
interface MPLADSAllocationRow {
  id: string;
  mp_id: string;
  mp_name: string;
  constituency: string;
  state: string;
  allocated_amount: number;
  created_at: string;
}

interface MPWorkRow {
  id: string;
  work_id: string;
  mp_id: string;
  category: string;
  work_type: string;
  description: string;
  state: string;
  district: string;
  recommended_amount: number;
  sanctioned_amount: number | null;
  final_amount: number | null;
  status: string;
  recommendation_date: string | null;
  completion_date: string | null;
  rating: number | null;
  has_image: boolean;
  created_at: string;
}

interface WorkExpenditureRow {
  id: string;
  work_id: string;
  vendor_name: string;
  amount: number;
  expenditure_date: string;
  payment_status: string;
  created_at: string;
}

// Helper to format amounts
function formatAmount(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(2)} K`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

// Transform functions
function transformAllocation(row: MPLADSAllocationRow): MPLADSAllocation {
  return {
    mpId: row.mp_id,
    mpName: row.mp_name,
    constituency: row.constituency,
    state: row.state,
    allocatedAmount: row.allocated_amount,
    allocatedAmountFormatted: formatAmount(row.allocated_amount),
  };
}

function transformWork(row: MPWorkRow): MPWork {
  return {
    id: row.id,
    workId: row.work_id,
    mpId: row.mp_id,
    category: row.category as MPWork['category'],
    workType: row.work_type,
    description: row.description,
    state: row.state,
    district: row.district,
    recommendedAmount: row.recommended_amount,
    sanctionedAmount: row.sanctioned_amount,
    finalAmount: row.final_amount,
    status: row.status as WorkStatus,
    recommendationDate: row.recommendation_date,
    completionDate: row.completion_date,
    rating: row.rating,
    hasImage: row.has_image,
  };
}

function transformExpenditure(row: WorkExpenditureRow): WorkExpenditure {
  return {
    id: row.id,
    workId: row.work_id,
    vendorName: row.vendor_name,
    amount: row.amount,
    expenditureDate: row.expenditure_date,
    paymentStatus: row.payment_status as WorkExpenditure['paymentStatus'],
  };
}

// API Functions

export async function fetchMPLADSAllocation(mpId: string): Promise<MPLADSAllocation | null> {
  const { data, error } = await supabase
    .from('mplads_allocations')
    .select('*')
    .eq('mp_id', mpId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error('Error fetching MPLADS allocation:', error);
    return null;
  }

  return data ? transformAllocation(data as MPLADSAllocationRow) : null;
}

export async function fetchAllMPLADSAllocations(): Promise<MPLADSAllocation[]> {
  const { data, error } = await supabase
    .from('mplads_allocations')
    .select('*')
    .order('allocated_amount', { ascending: false });

  if (error) {
    console.error('Error fetching all MPLADS allocations:', error);
    return [];
  }

  return (data || []).map((row) => transformAllocation(row as MPLADSAllocationRow));
}

export async function fetchMPWorks(
  mpId: string,
  status?: WorkStatus
): Promise<MPWork[]> {
  let query = supabase
    .from('mplads_works')
    .select('*')
    .eq('mp_id', mpId)
    .order('recommendation_date', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching MP works:', error);
    return [];
  }

  return (data || []).map((row) => transformWork(row as MPWorkRow));
}

export async function fetchWorkDetail(workId: string): Promise<MPWork | null> {
  const { data, error } = await supabase
    .from('mplads_works')
    .select('*')
    .eq('work_id', workId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error fetching work detail:', error);
    return null;
  }

  return data ? transformWork(data as MPWorkRow) : null;
}

export async function fetchWorkExpenditures(workId: string): Promise<WorkExpenditure[]> {
  const { data, error } = await supabase
    .from('mplads_expenditures')
    .select('*')
    .eq('work_id', workId)
    .order('expenditure_date', { ascending: false });

  if (error) {
    console.error('Error fetching work expenditures:', error);
    return [];
  }

  return (data || []).map((row) => transformExpenditure(row as WorkExpenditureRow));
}

export async function fetchMPLADSSummary(mpId: string): Promise<MPLADSSummary | null> {
  // Fetch allocation
  const allocation = await fetchMPLADSAllocation(mpId);
  if (!allocation) return null;

  // Fetch works counts by status
  const { data: worksCounts, error: countsError } = await supabase
    .from('mplads_works')
    .select('status, recommended_amount, sanctioned_amount, final_amount')
    .eq('mp_id', mpId);

  if (countsError) {
    console.error('Error fetching works counts:', countsError);
  }

  const works = worksCounts || [];

  let recommended = 0;
  let sanctioned = 0;
  let completed = 0;
  let totalRecommendedAmt = 0;
  let totalSanctionedAmt = 0;
  let totalCompletedAmt = 0;

  works.forEach((w: { status: string; recommended_amount: number; sanctioned_amount: number | null; final_amount: number | null }) => {
    totalRecommendedAmt += w.recommended_amount || 0;

    if (w.status === 'Recommended') {
      recommended++;
    } else if (w.status === 'Sanctioned') {
      sanctioned++;
      totalSanctionedAmt += w.sanctioned_amount || w.recommended_amount || 0;
    } else if (w.status === 'Completed') {
      completed++;
      totalCompletedAmt += w.final_amount || w.sanctioned_amount || w.recommended_amount || 0;
    }
  });

  // Calculate total expenditure (completed works)
  const totalExpenditure = totalCompletedAmt;
  const utilizationPercentage = allocation.allocatedAmount > 0
    ? Math.round((totalExpenditure / allocation.allocatedAmount) * 100)
    : 0;

  return {
    allocation,
    totalRecommended: totalRecommendedAmt,
    totalSanctioned: totalSanctionedAmt,
    totalCompleted: totalCompletedAmt,
    totalExpenditure,
    utilizationPercentage,
    worksCount: {
      recommended,
      sanctioned,
      completed,
    },
  };
}

export async function fetchMPLADSGlobalStats() {
  const { data: allocations, error: allocError } = await supabase
    .from('mplads_allocations')
    .select('allocated_amount');

  const { data: works, error: worksError } = await supabase
    .from('mplads_works')
    .select('status, final_amount');

  if (allocError || worksError) {
    console.error('Error fetching global MPLADS stats');
    return null;
  }

  const totalAllocated = (allocations || []).reduce(
    (sum: number, a: { allocated_amount: number }) => sum + a.allocated_amount,
    0
  );

  let totalUtilized = 0;
  let completedWorks = 0;

  (works || []).forEach((w: { status: string; final_amount: number | null }) => {
    if (w.status === 'Completed') {
      completedWorks++;
      totalUtilized += w.final_amount || 0;
    }
  });

  return {
    totalAllocated,
    totalUtilized,
    totalWorks: (works || []).length,
    completedWorks,
    utilizationPercentage: totalAllocated > 0
      ? Math.round((totalUtilized / totalAllocated) * 100)
      : 0,
  };
}

// Search works by description or type
export async function searchWorks(query: string, limit = 50): Promise<MPWork[]> {
  const { data, error } = await supabase
    .from('mplads_works')
    .select('*')
    .or(`description.ilike.%${query}%,work_type.ilike.%${query}%`)
    .order('recommendation_date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error searching works:', error);
    return [];
  }

  return (data || []).map((row) => transformWork(row as MPWorkRow));
}
