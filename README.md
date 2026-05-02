# 👁️ Eye Relax Reminder

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-brightgreen)](#installation)
[![Electron](https://img.shields.io/badge/Electron-36-9feaf9?logo=electron&logoColor=white)](https://www.electronjs.org/)

> A cute, cross-platform desktop app that reminds you to rest your eyes with an animated cat or a custom transparent video overlay. Based on the **20-20-20 rule** — every **20 minutes**, look at something **20 feet away** for **20 seconds**.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🐱 **Animated Cat** | A hand-drawn, canvas-rendered sleeping cat floats on your screen |
| 🎬 **Custom Video** | Use any WebM video with alpha transparency as your reminder |
| 🪟 **Transparent Overlay** | The reminder appears *over* your desktop — no background, just the cat |
| ⏱️ **Configurable** | Set interval (5–120 min) and duration (3–30 sec) |
| 📌 **System Tray** | Runs silently in your tray — right-click for settings |
| 🖥️ **Cross-Platform** | Works on Windows, macOS, and Linux |
| 🔒 **Single Instance** | Prevents accidental duplicate instances |
| ▶ **Test Button** | Preview your reminder instantly from Settings |

---

## 🚀 Quick Start

```bash
git clone https://github.com/letsbegincode/eye-relax-remainder.git
cd eye-relax-reminder
npm install
npm start
```

The app launches silently in your system tray. Right-click the tray icon to access **Settings** or **Show Reminder Now**.

---

## 📥 Installation

### 1. Download the Portable App (Easiest)
You do not need to install anything! Just download the pre-packaged portable version:

1. Go to the [Releases page](https://github.com/letsbegincode/eye-relax-remainder/releases).
2. Download the `Eye-Relax-Reminder-vX.X.X-Windows.zip` file.
3. **Extract the ZIP file** to a permanent location on your PC (e.g., your Documents folder).
4. Inside the extracted folder, double-click **`Eye Relax Reminder.exe`** to run it.

> ⚠️ **IMPORTANT:** Do **not** drag the `.exe` file out of the folder to your Desktop! It needs the surrounding `.dll` and `.dat` files to work. If you want it on your Desktop, right-click the `.exe` and select **"Create Shortcut"**, then move the shortcut to your Desktop.

### 2. From Source (Developers)

**Prerequisites:** [Node.js](https://nodejs.org/) 18+ and npm

```bash
git clone https://github.com/letsbegincode/eye-relax-remainder.git
cd eye-relax-reminder
npm install
npm start
```

#### Build your own Portable App
```bash
npm run package-win
```
Output will be generated in `dist/eye-relax-reminder-win32-x64/`.

---

## ⚙️ Settings

Right-click the tray icon → **Settings** to customise:

| Setting | Range | Default | Description |
|---------|-------|---------|-------------|
| Reminder Interval | 5–120 min | 20 min | How often the reminder appears |
| Reminder Duration | 3–30 sec | 10 sec | How long it stays on screen |
| Display Mode | Animation / Video | Animation | Canvas cat or custom video |
| Video File | Browse… | cat.webm | Your WebM video file |
| Enable Reminders | On / Off | On | Toggle all reminders |

Settings are saved to `settings.json` (auto-created on first save).

---

## 🎬 Using Custom Videos

For the transparent overlay effect, your video must be a **WebM with VP9 alpha channel**:

1. Create your animation with a transparent background in After Effects, Blender, or similar
2. Export as **WebM** with **VP9 codec** and **alpha channel enabled**
3. Place the file in the `videos/` folder (or use **Browse…** in Settings)

> **Tip:** MP4 does not support transparency. Only WebM (VP8A/VP9 with alpha) will render with a see-through background.

### FFmpeg conversion example

```bash
ffmpeg -i input.mov -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 2M output.webm
```

---

## 📁 Project Structure

```
eye-relax-reminder/
├── index.js                  # Main Electron process
├── preload.js                # Secure IPC bridge
├── package.json              # App metadata & build config
├── settings.default.json     # Default settings template
├── LICENSE                   # MIT License
├── CONTRIBUTING.md           # Contribution guidelines
├── public/
│   ├── settings.html         # Settings window UI
│   ├── video-reminder.html   # Reminder overlay (animation + video)
│   ├── icon.png              # App & tray icon
│   └── relaxation-sound.mp3  # Optional audio
└── videos/
    └── cat.webm              # Default reminder video
```

---

## 🛠️ Development

```bash
# Run with logging
npm run dev

# Package (portable)
npm run package-win    # Windows
npm run package-mac    # macOS
npm run package-linux  # Linux

# Build installer
npm run dist:win
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
| Reminder not showing | Check if reminders are enabled in Settings |
| Video has black background | Use a WebM with alpha channel, not MP4 |
| Window won't close | Click anywhere or press ESC |
| Second instance won't open | The app enforces single-instance — check your tray |

---

## 👁️ The 20-20-20 Rule

Every **20 minutes**, look at something **20 feet** (~6 meters) away for **20 seconds**. This simple habit significantly reduces digital eye strain, dry eyes, and headaches.

---

## 📄 License

[MIT](LICENSE) © Abhinav

---

<p align="center">
  <sub>Built with ❤️ and Electron • Star ⭐ if this helps your eyes!</sub>
</p>
