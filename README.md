# KYN - Know Your Neta

A civic transparency app that gives Indian voters instant access to detailed information about all 543 Members of Parliament from the 2024 Lok Sabha Elections.

Built with React Native and Expo. Works completely offline.

## Why This Exists

Election affidavits contain crucial information about our representatives - their assets, criminal records, education, and more. But this data is scattered across government websites and PDFs, making it hard for everyday voters to access.

KYN aggregates this information from official sources (Election Commission of India, Association for Democratic Reforms, MyNeta) into a single, searchable, offline-first mobile app.

## Features

### Browse All MPs
- Search by name or constituency
- Filter by state, party, criminal record status, or election status
- Sort by assets, criminal cases, age, or name
- Quick stats visible on each card

### Detailed Profiles
Every MP profile includes:
- Basic info (age, constituency, party, education)
- Complete asset declaration (movable and immovable)
- Criminal cases with specific IPC sections
- Asset growth comparison for re-elected MPs
- Shareable profile cards

### Compare MPs
Select up to 3 MPs and compare them side-by-side across:
- Financial declarations
- Criminal records
- Age and constituency
- Asset growth trends

### Statistics Dashboard
National-level analytics including:
- Criminal records distribution
- Party-wise MP count
- State representation
- Asset range breakdown
- Age demographics

### Political Parties
Browse all political parties with their MP counts and filter options.

## Data

| Metric | Value |
|--------|-------|
| Total MPs | 543 |
| States & UTs | 36 |
| Political Parties | 40+ |
| Total Declared Assets | ₹25,000+ Crore |
| Criminal Cases | 1,322 |

All data sourced from official election affidavits submitted to the Election Commission of India.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React Native + Expo |
| Routing | Expo Router |
| Styling | NativeWind (Tailwind CSS) |
| State | Zustand |
| Charts | Custom React Native components |
| Build | EAS Build / Android Studio |

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Android Studio (for local builds)

### Installation

```bash
git clone https://github.com/anon-d3v/know-your-neta.git
cd know-your-neta
npm install
```

### Development

```bash
npx expo start
```

### Build APK

```bash
cd android
./gradlew assembleRelease
```

The APK will be at `android/app/build/outputs/apk/release/app-release.apk`

## Project Structure

```
├── app/                    # Screens (Expo Router)
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # MPs list
│   │   ├── stats.tsx      # Statistics
│   │   ├── parties.tsx    # Political parties
│   │   └── about.tsx      # About page
│   └── mp/[slug].tsx      # MP detail page
├── src/
│   ├── components/        # UI components
│   │   ├── charts/        # Data visualizations
│   │   ├── compare/       # Comparison feature
│   │   ├── mp/            # MP-related components
│   │   ├── party/         # Party components
│   │   └── ui/            # Shared UI elements
│   ├── data/              # MP and party data
│   ├── hooks/             # Custom hooks
│   ├── store/             # Zustand stores
│   ├── theme/             # Colors and styling
│   └── utils/             # Helper functions
└── assets/                # Images and icons
```

## Offline First

The app bundles all 543 MP profiles locally. No internet connection required after installation. Search, filter, and browse instantly.

## Screenshots

*Coming soon*

## Data Sources

- [Election Commission of India](https://eci.gov.in)
- [Association for Democratic Reforms](https://adrindia.org)
- [MyNeta](https://myneta.info)

## Disclaimer

Criminal case information represents charges filed, not convictions. Every individual is presumed innocent until proven guilty in a court of law.

Asset and liability figures are self-declared by candidates in their election affidavits.

## License

MIT

## Contributing

Contributions welcome. Please open an issue first to discuss what you'd like to change.

---

Made for informed voting.
