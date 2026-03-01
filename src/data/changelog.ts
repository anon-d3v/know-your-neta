export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  changes: string[];
}

export const changelog: ChangelogEntry[] = [
  {
    version: '1.1.0',
    date: 'February 27, 2026',
    title: 'Chat & Community',
    description: 'Live chatrooms where citizens can discuss Indian politics together.',
    changes: [
      'New Chat Feature',
      'Discuss about any politician from their profile',
      'Share MP Profiles or Comparisions to chat directly',
      'Swipe to reply on any message',
      'Set a display name for how others see you in chats',
    ]
  },
  {
    version: '1.0.5',
    date: 'February 18, 2026',
    title: 'MPLADS Fund Tracking',
    description: 'See how your MP spends their development funds.',
    changes: [
      'View MP development works — roads, schools, hospitals',
      'Check fund utilization for each MP',
      'Data refreshes automatically every 24 hours',
    ]
  },
  {
    version: '1.0.2',
    date: 'January 15, 2026',
    title: 'Initial Release',
    description: 'Know Your Neta is live!',
    changes: [
      'View detailed MP profiles with assets and criminal records',
      'Search by name, party, or constituency',
      'Compare MPs side by side',
      'Works offline after first sync',
    ]
  }
];
