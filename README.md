# 👁️ Eye Relax Reminder

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-brightgreen)](#installation)
[![Electron](https://img.shields.io/badge/Electron-36-9feaf9?logo=electron&logoColor=white)](https://www.electronjs.org/)

> A cute, cross-platform desktop app that reminds you to rest your eyes with an animated cat or a custom transparent video overlay. Based on the **20-20-20 rule** — every **20 minutes**, look at something **20 feet away** for **20 seconds**.

---

## 📹 Demo

![Eye Relax Reminder Demo](public/demo-git.gif)

---


## ✨ Features

| Feature | Description |
|---------|-------------|
| 🐱 **Animated Cat** | A hand-drawn, canvas-rendered sleeping cat floats on your screen |
| 🎬 **Custom Video** | Bundled transparent animations or browse for any custom WebM |
| 🪟 **Transparent Overlay** | The reminder appears *over* your desktop with full alpha-channel support |
| ⏱️ **Configurable** | Set interval (5–120 min) and duration (3–30 sec) |
| 📌 **System Tray** | Runs silently in your tray — right-click for settings |
| 🖥️ **Cross-Platform** | Generates standalone ZIPs for Windows and DMGs for macOS |
| 🔒 **Single Instance** | Prevents accidental duplicate instances |

---

## 🚀 Quick Start (Local Testing)

```bash
git clone https://github.com/letsbegincode/eye-relax-reminder.git
cd eye-relax-reminder
npm install
npm start
```

The app launches silently in your system tray. Right-click the tray icon to access **Settings** or **Show Reminder Now**.

---

## ⚙️ Settings

Right-click the tray icon → **Settings** to customise:

| Setting | Range | Default | Description |
|---------|-------|---------|-------------|
| Reminder Interval | 5–120 min | 20 min | How often the reminder appears |
| Reminder Duration | 3–30 sec | 10 sec | How long it stays on screen |
| Display Mode | Animation / Video | Animation | Canvas cat or WebM video |
| Video File | Dropdown | Bundled | Select a bundled video or browse your PC |
| Enable Reminders | On / Off | On | Toggle all reminders |

> **Note:** User settings are safely persisted across updates in your OS's native app data folder (`%APPDATA%/eye-relax-reminder/settings.json` on Windows, `~/Library/Application Support/eye-relax-reminder/settings.json` on macOS).

---

## 🎬 Using Custom Videos

For the transparent overlay effect, your video must be a **WebM with VP9 alpha channel**. 

### Bundled Videos
Any `.webm` or `.mp4` file placed inside the `videos/` folder will **automatically appear in the Settings dropdown menu** when the app is built.


---

## 📁 Project Structure

```
eye-relax-reminder/
├── index.js                  # Main Electron process
├── preload.js                # Secure IPC bridge
├── package.json              # App metadata & electron-builder config
├── settings.default.json     # Default settings template
├── public/
│   ├── settings.html         # Settings window UI
│   ├── video-reminder.html   # Reminder overlay
│   └── icon.png              # App & tray icon
└── videos/
    └── ...                   # Drop bundled videos here
```

---

## 🛠️ Building Releases (electron-builder)

This project uses `electron-builder` to generate clean, production-ready distributions.

### Local Testing Before Release
To quickly test the exact packaged output without waiting for full ZIP/DMG compression:
```bash
npm run test:win    # Windows (Launches unpacked .exe instantly)
npm run test:mac    # macOS (Launches unpacked .app instantly)
```

### Build Final Installers
To build the final distributions for GitHub Releases (Outputs to `dist/`):
```bash
npm run clean:win   # Generates Windows ZIP (Portable)
npm run clean:mac   # Generates macOS DMG
```

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push and open a Pull Request

---

## 🩺 Troubleshooting

| Problem | Solution |
|---------|----------|
| App doesn't appear | Look for the eye icon in your system tray |
| Video has black background | Ensure hardware acceleration is not forced off by your OS. Only WebM files support alpha. |
| Window won't close | Click anywhere or press ESC |
| Symlink Error (Windows) | If `electron-builder` fails to download `winCodeSign`, extract it manually with 7-Zip using the `-snl` flag. |

---

## 👁️ The 20-20-20 Rule

Every **20 minutes**, look at something **20 feet** (~6 meters) away for **20 seconds**. This simple habit significantly reduces digital eye strain, dry eyes, and headaches.

---

## 📄 License

[MIT](LICENSE) © Abhinav

<p align="center">
  <sub>Built with ❤️ and Electron • Star ⭐ if this helps your eyes!</sub>
</p>
