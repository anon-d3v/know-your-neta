export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  changes: string[];
}

export const changelog: ChangelogEntry[] = [
  {
    version: '1.0.5',
    date: 'February 18, 2026',
    title: 'MPLADS Integration & Performance Boost',
    description: 'We have added MPLADS data so you can see how your MP uses development funds!',
    changes: [
      '✨ New: See your MP\'s MPLADS works (roads, schools, hospitals they built)',
      '💰 New: Check how MPs spend their ₹5 Cr annual development fund',
      '📊 New: View fund utilization percentage for each MP',
      '⚡ Faster: Improved app loading speed and smoother scrolling',
      '🔄 Better: Data automatically refreshes every 24 hours',
      '🐛 Fixed: Various bug fixes and performance improvements'
    ]
  },
  {
    version: '1.0.2',
    date: 'January 15, 2026',
    title: 'Initial Release',
    description: 'Know Your Neta is live! Track MP details, assets, and criminal records.',
    changes: [
      '👤 View detailed MP profiles',
      '💰 Check MP assets and liabilities',
      '⚖️ See criminal case details',
      '🔍 Search by name, party, or constituency',
      '📱 Fast, offline-first mobile experience'
    ]
  }
];
