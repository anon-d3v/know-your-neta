/**
 * Formatting utilities for KYN app
 */

export function formatIndianCurrency(amount: number): string {
  if (amount >= 10000000) {
    const crore = amount / 10000000;
    return `${crore.toFixed(1)} Cr`;
  }
  if (amount >= 100000) {
    const lakh = amount / 100000;
    return `${lakh.toFixed(1)} L`;
  }
  if (amount >= 1000) {
    const thousand = amount / 1000;
    return `${thousand.toFixed(1)} K`;
  }
  return amount.toLocaleString('en-IN');
}

export function formatFullIndianCurrency(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-IN')}`;
}

export function formatCroreShort(amount: number): string {
  const crore = amount / 10000000;
  if (crore >= 1) {
    return `${Math.round(crore)} Cr+`;
  }
  const lakh = amount / 100000;
  if (lakh >= 1) {
    return `${Math.round(lakh)} L+`;
  }
  return formatIndianCurrency(amount);
}

export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value}%`;
}

export function getInitials(name: string): string {
  if (!name) return '??';
  const parts = name.split(' ').filter(p => p.length > 0);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return parts
    .slice(0, 2)
    .map(p => p[0])
    .join('')
    .toUpperCase();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function normalizeConstituency(constituency: string): string {
  return constituency
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
