// indian number system: 1 crore = 1,00,00,000 (10 million), 1 lakh = 1,00,000 (100k)
const CRORE = 10000000;
const LAKH = 100000;

export function formatIndianCurrency(amt: number | null | undefined): string {
  if (amt == null) return '₹ 0';
  if (amt >= CRORE) return `${(amt / CRORE).toFixed(1)} Cr`;
  if (amt >= LAKH) return `${(amt / LAKH).toFixed(1)} L`;
  if (amt >= 1000) return `${(amt / 1000).toFixed(1)} K`;
  return amt.toLocaleString('en-IN');
}

export function formatFullIndianCurrency(amt: number | null | undefined): string {
  if (amt == null) return 'Rs. 0';
  return `Rs. ${amt.toLocaleString('en-IN')}`;
}

// shorter format for cards where space is tight
export function formatCroreShort(amt: number | null | undefined): string {
  if (amt == null) return '0';
  if (amt >= CRORE) return `${Math.round(amt / CRORE)} Cr+`;
  if (amt >= LAKH) return `${Math.round(amt / LAKH)} L+`;
  return formatIndianCurrency(amt);
}

export function formatRupeeCrore(amt: number | null | undefined): string {
  if (amt == null) return '₹ 0';
  if (amt >= CRORE) return `₹ ${Math.round(amt / CRORE)} Crore+`;
  if (amt >= LAKH) return `₹ ${Math.round(amt / LAKH)} Lakh+`;
  return `₹ ${amt.toLocaleString('en-IN')}`;
}

export const formatPercentage = (val: number | null | undefined) =>
  val == null ? '+0%' : `${val >= 0 ? '+' : ''}${val}%`;

export function getInitials(name: string): string {
  if (!name) return '??';
  const words = name.split(' ').filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  // first letter of first two words
  return (words[0][0] + words[1][0]).toUpperCase();
}

export const truncateText = (text: string, max: number) =>
  text.length <= max ? text : text.slice(0, max - 3) + '...';

// title case for constituency names
export function normalizeConstituency(s: string): string {
  return s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

export function generateMPShareText(mp: {
  basic: {
    fullName: string;
    constituency: string;
    stateUT: string;
    politicalParty: string;
    age: number;
  };
  financial: {
    totalAssets: number;
    movableAssets: number;
    immovableAssets: number;
  };
  criminal: {
    hasCases: boolean;
    totalCases: number;
    seriousIPCSections: number;
    otherIPCSections: number;
  };
  reElection: {
    assetGrowth: {
      assets2019: number;
      assets2024: number;
      growthPercentage: number;
    };
  } | null;
}): string {
  const { basic, financial, criminal, reElection } = mp;

  let text = `━━━━━━━━━━━━━━━━━━━━━━
   KNOW YOUR NETA
━━━━━━━━━━━━━━━━━━━━━━

👤 ${basic.fullName}
📍 ${basic.constituency}, ${basic.stateUT}
🏛️ ${basic.politicalParty}
🎂 Age: ${basic.age} years

💰 FINANCIAL DECLARATION
━━━━━━━━━━━━━━━━━━━━━━
Total Assets: ${formatRupeeCrore(financial.totalAssets)}
• Movable: ${formatRupeeCrore(financial.movableAssets)}
• Immovable: ${formatRupeeCrore(financial.immovableAssets)}
`;

  if (reElection) {
    text += `
📈 ASSET GROWTH (2019-2024)
━━━━━━━━━━━━━━━━━━━━━━
2019: ${formatRupeeCrore(reElection.assetGrowth.assets2019)}
2024: ${formatRupeeCrore(reElection.assetGrowth.assets2024)}
Growth: +${reElection.assetGrowth.growthPercentage}%
`;
  }

  text += `
⚖️ CRIMINAL RECORD
━━━━━━━━━━━━━━━━━━━━━━
`;

  if (criminal.hasCases) {
    text += `Total Cases: ${criminal.totalCases}
• Serious IPC: ${criminal.seriousIPCSections}
• Other IPC: ${criminal.otherIPCSections}
`;
  } else {
    text += `✅ Clean Record - No criminal cases
`;
  }

  text += `
━━━━━━━━━━━━━━━━━━━━━━
Source: Election Affidavits (ECI)
Via: KYN - Know Your Neta App
━━━━━━━━━━━━━━━━━━━━━━`;

  return text;
}
