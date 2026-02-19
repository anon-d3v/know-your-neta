# KYN (Know Your Neta) 🇮🇳

<div align="center">
  <img src="./assets/images/icon.png" alt="KYN Logo" width="120" />
  
  <h3>Track Indian MPs: Assets, Criminal Records, MPLADS Fund Utilization & More</h3>
  
  <p>
    <strong>Empowering Indian citizens with transparent, accessible information about their elected representatives</strong>
  </p>

  [![Version](https://img.shields.io/badge/version-1.0.6-blue.svg)](https://github.com/YOUR_USERNAME/kyn/releases)
  [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
  [![Platform](https://img.shields.io/badge/platform-Android-success.svg)](https://www.android.com/)
</div>

---

## 📱 Screenshots

> **Note**: Screenshots will showcase the main features of the app once added to the `screenshots/` folder.

<!-- 
Add screenshots here:
- 01-home.png - Main screen with MP cards
- 02-mp-detail.png - Individual MP profile
- 03-mplads-works.png - MPLADS works listing
- 04-parties.png - Party listing
- 05-stats.png - Statistics dashboard
- 06-about.png - About page with updates button
- 07-updates.png - Changelog view
-->

---

## ✨ Features

### 👤 **MP Profiles**
- Complete biographical information for all 543 Lok Sabha MPs
- Contact details including phone, email, and office addresses
- Social media handles (Twitter, Facebook)
- Education and professional background
- Constituency details and election results

### 💰 **Financial Transparency**
- **Total assets and liabilities** declared in election affidavits
- Detailed asset breakdown:
  - Movable assets (cash, bank deposits, bonds, vehicles)
  - Immovable assets (land, buildings, commercial properties)
  - Liabilities (loans and dues)
- **Year-over-year comparison** for re-elected MPs
- Visual indicators for asset growth/decline

### ⚖️ **Criminal Records**
- Number of pending criminal cases
- Detailed case information including:
  - IPC sections and charges
  - Court names and case numbers
  - Nature of offenses (serious vs. non-serious)
- Complete transparency as per affidavits

### 🏗️ **MPLADS Fund Tracking** (NEW in v1.0.6)
The **Members of Parliament Local Area Development Scheme (MPLADS)** allows each MP to recommend development works worth ₹5 crores annually in their constituency.

**Features:**
- 📊 View **fund utilization percentage** for each MP
- 🏗️ Browse development works by status:
  - ✅ **Completed** - Finished projects
  - 🔨 **Sanctioned** - Ongoing construction
  - 📝 **Recommended** - Proposed by MP
- 💵 See **work-wise fund allocation** with detailed descriptions
- 🏛️ Filter by **work type** (roads, schools, hospitals, etc.)
- 📍 Filter by **district** within constituency
- 📈 Track development impact in your area

### 📊 **Statistics Dashboard**
Interactive charts and insights:
- **Party-wise MP distribution** with seat counts
- **State-wise representation** across India
- **Age demographics** of current MPs
- **Criminal case statistics** - MPs with pending cases
- **Asset range distribution** - wealth brackets
- **Election status breakdown** - new vs. re-elected MPs

### 🔍 **Advanced Search & Filters**
- **Search** by MP name, party name, or constituency
- **Filter** by:
  - State/UT
  - Political party
  - Criminal cases (yes/no)
  - Asset range
  - Election status
- **Sort** by name, assets, criminal cases, or MPLADS utilization

### 📱 **Offline-First Architecture**
- All data cached locally using AsyncStorage
- **Works without internet** after initial sync
- Automatic data refresh every 24 hours when online
- Instant loading and smooth navigation

### 🎨 **Modern UI/UX**
- **Dark theme** optimized for readability
- Smooth animations and transitions
- Material Design-inspired components
- Responsive layouts for all screen sizes

---

## 🚀 Technology Stack

| Category | Technology |
|----------|------------|
| **Framework** | React Native 0.81 + Expo SDK 54 |
| **Routing** | Expo Router (file-based routing) |
| **UI Styling** | NativeWind (Tailwind CSS for React Native) |
| **Backend** | Supabase (PostgreSQL database) |
| **State Management** | Zustand + React Query (TanStack Query) |
| **Data Persistence** | AsyncStorage with React Query persistence |
| **Charts** | react-native-gifted-charts |
| **Networking** | @react-native-community/netinfo |
| **Language** | TypeScript |

---

## 📦 Installation

### For End Users

**Download the latest APK:**
1. Go to [Releases](https://github.com/YOUR_USERNAME/kyn/releases)
2. Download `kyn-v1.0.6.apk`
3. Install on your Android device
4. Open the app and wait for initial data sync (~30-60 seconds)

**Requirements:**
- Android 7.0 (API 24) or higher
- ~50 MB storage space
- Internet connection for initial sync

---

### For Developers

#### Prerequisites
- Node.js 18+ and npm
- Android Studio (for Android emulator)
- Git

#### Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/kyn.git
cd kyn/kyn-app

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env

# Edit .env and add your Supabase credentials:
# EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
# EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Running the App

```bash
# Start Expo development server
npx expo start

# Options:
# - Press 'a' for Android emulator
# - Press 'i' for iOS simulator (macOS only)
# - Scan QR code with Expo Go app on physical device
```

#### Building for Production

```bash
# Build Android APK
npm run build:android

# The APK will be generated at: android/app/build/outputs/apk/release/
```

---

## 🗂️ Project Structure

```
kyn-app/
├── app/                          # Expo Router pages (file-based routing)
│   ├── _layout.tsx               # Root layout with providers
│   ├── +not-found.tsx            # 404 page
│   ├── updates.tsx               # Changelog page (standalone)
│   ├── (tabs)/                   # Bottom tab navigation
│   │   ├── _layout.tsx           # Tab navigator configuration
│   │   ├── index.tsx             # Home - MP listing
│   │   ├── parties.tsx           # Political parties
│   │   ├── stats.tsx             # Statistics dashboard
│   │   └── about.tsx             # About page
│   └── mp/
│       ├── [slug].tsx            # MP detail page (dynamic route)
│       └── [slug]/
│           └── works.tsx         # MPLADS works page
│
├── src/
│   ├── api/                      # Supabase API functions
│   │   ├── index.ts              # API exports
│   │   ├── mps.ts                # MP data fetching
│   │   ├── mplads.ts             # MPLADS data fetching
│   │   ├── parties.ts            # Party data fetching
│   │   └── stats.ts              # Statistics queries
│   │
│   ├── components/               # React components
│   │   ├── charts/               # Chart components
│   │   ├── compare/              # MP comparison features
│   │   ├── mp/                   # MP-related components
│   │   ├── mplads/               # MPLADS components
│   │   ├── party/                # Party components
│   │   └── ui/                   # Reusable UI components
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useMPData.ts          # MP data with React Query
│   │   ├── useMPLADSData.ts      # MPLADS data hooks
│   │   ├── usePartyData.ts       # Party data hooks
│   │   ├── useInitialSync.ts     # Initial data sync logic
│   │   └── useUpdateCheck.ts     # Version update checker
│   │
│   ├── lib/                      # Core libraries
│   │   ├── supabase.ts           # Supabase client config
│   │   ├── queryClient.ts        # React Query config
│   │   └── queryKeys.ts          # Query key factory
│   │
│   ├── store/                    # Zustand stores
│   │   ├── compareStore.ts       # MP comparison state
│   │   └── filterStore.ts        # Filter/sort state
│   │
│   ├── data/                     # Static data and types
│   │   ├── types.ts              # TypeScript interfaces
│   │   ├── changelog.ts          # App changelog
│   │   ├── ipc-sections.ts       # IPC section descriptions
│   │   └── party-data.ts         # Party metadata
│   │
│   ├── constants/                # App constants
│   │   ├── parties.ts            # Party color mappings
│   │   └── states.ts             # Indian states/UTs list
│   │
│   ├── theme/                    # Design system
│   │   ├── colors.ts             # Color palette
│   │   └── index.ts              # Theme exports
│   │
│   ├── utils/                    # Utility functions
│   │   ├── format.ts             # Formatting helpers
│   │   └── index.ts              # Utility exports
│   │
│   └── providers/                # React context providers
│       └── QueryProvider.tsx     # React Query provider wrapper
│
├── assets/                       # Static assets
│   └── images/                   # App icons and images
│
├── scripts/                      # Build and utility scripts
│   └── build-android.js          # Android build script
│
├── android/                      # Native Android project (gitignored)
├── .github/                      # GitHub Actions workflows
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
└── tailwind.config.js            # Tailwind configuration
```

---

## 📊 Data Sources

All data in KYN is sourced from official government and verified NGO sources:

| Data Type | Source | Update Frequency |
|-----------|--------|------------------|
| **MP Profiles** | [MyNeta.info](https://myneta.info) (curated by ADR) | After each election |
| **Assets & Liabilities** | [Election Commission of India](https://affidavit.eci.gov.in) | Per election cycle |
| **Criminal Records** | Election Commission affidavits | Per election cycle |
| **MPLADS Data** | [Ministry of Statistics (MOSPI)](https://mplads.gov.in) | Quarterly updates |
| **Constituency Info** | [Election Commission of India](https://eci.gov.in) | As updated by ECI |

**Data Freshness:**
- MP profiles: Based on Lok Sabha Elections 2024
- MPLADS data: Updated quarterly (last update: February 2026)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Reporting Issues
- Found a bug? [Open an issue](https://github.com/YOUR_USERNAME/kyn/issues)
- Have a feature request? [Start a discussion](https://github.com/YOUR_USERNAME/kyn/discussions)

### Contributing Code

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/kyn.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow existing code style (ESLint configured)
   - Add comments for complex logic
   - Test on Android emulator

4. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```
   
   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

5. **Push and create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Development Guidelines
- Use TypeScript for type safety
- Follow React Native best practices
- Keep components small and focused
- Use custom hooks for reusable logic
- Write meaningful commit messages

---

## 🛣️ Roadmap

**Upcoming Features:**
- [ ] **iOS support** - Release on App Store
- [ ] **Constituency-wise search** - Find your local MP easily
- [ ] **Push notifications** - Get alerts on new MPLADS works
- [ ] **MP performance score** - Based on attendance, questions asked, bills passed
- [ ] **Lok Sabha attendance tracker** - Track MP presence in parliament
- [ ] **Questions in Parliament** - View questions raised by MPs
- [ ] **Bills & Legislation** - Track bills sponsored/supported
- [ ] **Regional language support** - Hindi, Tamil, Telugu, Bengali, etc.
- [ ] **Rajya Sabha integration** - Add Rajya Sabha MP data
- [ ] **MLA tracking** - Expand to state assembly members

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Association for Democratic Reforms (ADR)]( https://adrindia.org)** - For curating election affidavit data
- **[MyNeta.info](https://myneta.info)** - For providing structured MP profile data
- **[Election Commission of India](https://eci.gov.in)** - For maintaining election records
- **[Ministry of Statistics (MOSPI)](https://mospi.gov.in)** - For MPLADS transparency data
- **Indian citizens** - For demanding transparency and accountability

---

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/kyn/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/kyn/discussions)
- **Email**: your.email@example.com
- **Twitter**: [@YourHandle](https://twitter.com/YourHandle)

---

## ⚠️ Disclaimer

This application presents data in good faith to inform voters. All information is based on:
- Self-sworn affidavits submitted by candidates to the Election Commission of India
- Official MPLADS data published by the Government of India

**Important Notes:**
1. Being charged with criminal cases does **not imply guilt**. All individuals are presumed innocent until proven guilty by a court of law.
2. Asset declarations are self-reported by candidates and may not reflect current market values.
3. MPLADS data shows works recommended/sanctioned by MPs, but implementation depends on various factors including district administration.
4. This is an **independent project** and is not affiliated with any government body or political organization.

---

<div align="center">
  <p>Made with ❤️ for transparency in Indian democracy</p>
  <p>
    <a href="#-features">Features</a> •
    <a href="#-technology-stack">Tech Stack</a> •
    <a href="#-installation">Installation</a> •
    <a href="#-contributing">Contributing</a>
  </p>
</div>
