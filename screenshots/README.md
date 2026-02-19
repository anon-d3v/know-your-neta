# App Screenshots

This directory contains screenshots of the KYN app.

## Capturing Screenshots

To capture screenshots using ADB:

### 1. Start the Expo Dev Server
```bash
cd kyn-app
npx expo start
```

### 2. Open Android Emulator
Press `a` in the Expo terminal to launch the Android emulator.

### 3. Capture Screenshots
Once the app loads, use these ADB commands:

```bash
# Home/MPs List Screen
adb shell screencap -p /sdcard/home.png
adb pull /sdcard/home.png screenshots/01-home.png

# MP Detail Screen (navigate to any MP first)
adb shell screencap -p /sdcard/mp-detail.png
adb pull /sdcard/mp-detail.png screenshots/02-mp-detail.png

# Parties Screen
adb shell screencap -p /sdcard/parties.png
adb pull /sdcard/parties.png screenshots/03-parties.png

# Stats Screen
adb shell screencap -p /sdcard/stats.png
adb pull /sdcard/stats.png screenshots/04-stats.png

# Updates Screen
adb shell screencap -p /sdcard/updates.png
adb pull /sdcard/updates.png screenshots/05-updates.png

# About Screen
adb shell screencap -p /sdcard/about.png
adb pull /sdcard/about.png screenshots/06-about.png

# Clean up temp files
adb shell rm /sdcard/*.png
```

### Alternative: Manual Screenshots
1. Open the app in the emulator
2. Use your screenshot tool (Windows: Win + Shift + S)
3. Save screenshots with consistent naming in this directory

## Screenshot Naming Convention
- `01-home.png` - MPs list/home screen
- `02-mp-detail.png` - MP detail page
- `03-parties.png` - Parties list
- `04-stats.png` - Statistics dashboard
- `05-updates.png` - Updates/changelog screen
- `06-about.png` - About page
