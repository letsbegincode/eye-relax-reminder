Here's a comprehensive **README.md** for your Eye Relax Reminder app that covers installation and usage for Windows, macOS, and Linux:

```markdown
# 👀 Eye Relax Reminder - v2

A beautiful cross-platform desktop app that reminds you to rest your eyes regularly with an animated cat character. Perfect for developers, designers, and anyone who spends long hours in front of screens.

## Features ✨
- 🐱 **Animated Resting Cat** - A cute orange cat animation appears on a transparent full-screen overlay
- ⚙️ **Customizable Intervals** - Set reminder frequency from 5 to 120 minutes
- ⏱️ **Adjustable Duration** - Control how long the cat stays visible (3-30 seconds)
- 🎯 **Non-Intrusive Design** - Transparent overlay with only the cat visible
- 💤 **Sleeping Animation** - Floating cat with blinking eyes and "Z" bubbles
- 🚀 **Lightweight & Efficient** - Minimal resource usage
- 📌 **System Tray Integration** - Easy access and control from taskbar
- 🎨 **Beautiful Gradient Background** - Purple gradient with the floating cat
- ⏲️ **Countdown Timer** - Shows remaining time in top-right corner

## Installation 📥

### Windows Users 🪟
#### Method 1: Download Pre-built Executable
1. Download the latest `.exe` from [Releases](https://github.com/letsbegincode/eye-relax-reminder/releases)
2. Run the installer and follow the prompts
3. The app will launch automatically and run in your system tray

#### Method 2: Build from Source
```bash
# Clone the repository
git clone https://github.com/letsbegincode/eye-relax-reminder.git
cd eye-relax-reminder

# Install dependencies
npm install

# Package for Windows
npm run package-win

# The executable will be in the 'dist' folder
```

### macOS Users 🍎
#### Method 1: Download DMG
1. Download the `.dmg` from [Releases](https://github.com/letsbegincode/eye-relax-reminder/releases)
2. Open the DMG and drag the app to your Applications folder
3. Right-click the app and select "Open" (to bypass Gatekeeper on first run)

#### Method 2: Build from Source
```bash
git clone https://github.com/letsbegincode/eye-relax-reminder.git
cd eye-relax-reminder
npm install

# Package for macOS
npm run package-mac

# The app bundle will be in 'dist'
```

### Linux Users 🐧
#### Method 1: Download AppImage
1. Download the `.AppImage` from [Releases](https://github.com/letsbegincode/eye-relax-reminder/releases)
2. Make it executable:
```bash
chmod +x EyeRelaxReminder-*.AppImage
```
3. Run it:
```bash
./EyeRelaxReminder-*.AppImage
```

#### Method 2: Build from Source
```bash
git clone https://github.com/letsbegincode/eye-relax-reminder.git
cd eye-relax-reminder
npm install

# Package for Linux
npm run package-linux

# The executable will be in 'dist'
```

## Usage 🛠️

### Running the App
1. Start the application with `npm start`
2. The app runs silently in your system tray
3. Right-click the tray icon for options

### Tray Menu Options
- **Show Reminder Now** - Trigger the cat animation immediately
- **Settings** - Open customization window
- **Quit** - Close the application

### How It Works
- The app monitors time and displays your animated cat at configured intervals
- The cat floats gently in the center of your screen on a transparent overlay
- Only the cat and background are visible - your work stays visible behind it
- The cat shows a sleeping animation with blinking eyes and "Z" bubbles
- A countdown timer in the top-right shows remaining seconds
- Click anywhere or press **ESC** to close the reminder early

## Settings ⚙️

Right-click the tray icon and select **Settings** to customize:

- **Reminder Interval** (5-120 minutes)
  - How often the cat appears to remind you to rest
  - Default: 20 minutes

- **Video Duration** (3-30 seconds)
  - How long the cat stays visible
  - Default: 10 seconds

- **Enable Reminders**
  - Toggle reminders on/off without closing the app

Settings are saved automatically to `settings.json`

## 20-20-20 Rule 👁️
The app is designed around the eye care principle:
- **Every 20 minutes**
- **Look at something 20 feet away**
- **For 20 seconds**

The cute resting cat reminds you to take these important breaks!

## Building for All Platforms 🏗️
```bash
# Install dependencies once
npm install

# Package for all platforms
npm run package-win    # Windows
npm run package-mac    # macOS
npm run package-linux  # Linux
```

## Troubleshooting 🛠
**Problem:** App doesn't appear in system tray  
**Solution:** Some Linux DEs require tray extensions

**Problem:** Reminder not showing  
**Solution:** Check if reminders are enabled in Settings

**Problem:** Window won't close  
**Solution:** Click anywhere on screen or press ESC

## Project Structure 📁
```
eye-relax-reminder/
├── index.js                    # Main Electron process
├── preload.js                  # IPC bridge
├── settings.json               # Saved user settings
├── package.json
└── public/
    ├── index.html              # Original reminder UI
    ├── settings.html           # Settings window
    ├── video-reminder.html     # Cat animation display
    └── icon.png
```

## License 📄
MIT © Abhinav

