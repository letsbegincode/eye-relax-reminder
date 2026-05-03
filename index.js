/**
 * @fileoverview Eye Relax Reminder — Main Process
 *
 * A cross-platform desktop app that reminds you to rest your eyes at
 * configurable intervals. Displays either a cute canvas-drawn cat animation
 * or a custom WebM video (with alpha transparency) as a full-screen overlay.
 *
 * @author Abhinav
 * @license MIT
 */

const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, screen, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

// ─── App Constants ───────────────────────────────────────────────────────────

const APP_NAME = 'Eye Relax Reminder';
const APP_VERSION = require('./package.json').version;

// ─── State ───────────────────────────────────────────────────────────────────

/** @type {BrowserWindow|null} */
let settingsWindow = null;

/** @type {BrowserWindow|null} */
let videoReminderWindow = null;

/** @type {Electron.Tray|null} */
let tray = null;

/** @type {NodeJS.Timeout|null} */
let reminderInterval = null;

/** Default settings (overwritten by settings.json if it exists) */
const DEFAULT_SETTINGS = {
  reminderIntervalMinutes: 20,
  videoDurationSeconds: 10,
  enabled: true,
  displayMode: 'animation',
  videoFile: 'videos/cat.webm',
};

/** @type {typeof DEFAULT_SETTINGS} */
let currentSettings = { ...DEFAULT_SETTINGS };

// ─── Settings Persistence ────────────────────────────────────────────────────

const DEFAULT_SETTINGS_PATH = path.join(__dirname, 'settings.default.json');

function getSettingsPath() {
  return path.join(app.getPath('userData'), 'settings.json');
}

/**
 * Load user settings from disk. Falls back to defaults if the file
 * doesn't exist or is malformed.
 */
function loadSettings() {
  try {
    const settingsFile = getSettingsPath();

    // If user settings don't exist, try the shipped defaults
    if (!fs.existsSync(settingsFile)) {
      if (fs.existsSync(DEFAULT_SETTINGS_PATH)) {
        const data = fs.readFileSync(DEFAULT_SETTINGS_PATH, 'utf8');
        const loaded = JSON.parse(data);
        currentSettings = { ...DEFAULT_SETTINGS, ...loaded };
        console.log(`[${APP_NAME}] Settings loaded from built-in defaults`);
        return;
      } else {
        console.log(`[${APP_NAME}] No settings file found — using built-in defaults`);
        return;
      }
    }

    const data = fs.readFileSync(settingsFile, 'utf8');
    const loaded = JSON.parse(data);
    currentSettings = { ...DEFAULT_SETTINGS, ...loaded };
    console.log(`[${APP_NAME}] Settings loaded from ${settingsFile}`);
  } catch (error) {
    console.error(`[${APP_NAME}] Error loading settings:`, error.message);
  }
}

/**
 * Persist the current settings to disk.
 * @param {Partial<typeof DEFAULT_SETTINGS>} settings
 * @returns {boolean} Whether the save succeeded
 */
function saveSettings(settings) {
  try {
    currentSettings = { ...currentSettings, ...settings };
    fs.writeFileSync(getSettingsPath(), JSON.stringify(currentSettings, null, 2), 'utf8');
    console.log(`[${APP_NAME}] Settings saved`);
    return true;
  } catch (error) {
    console.error(`[${APP_NAME}] Error saving settings:`, error.message);
    return false;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Convert a relative or absolute file path to a `file://` URL the renderer
 * can use as a `<video>` source.
 * @param {string} filePath
 * @returns {string}
 */
function resolveVideoFileUrl(filePath) {
  if (!filePath) return filePath;
  if (filePath.startsWith('file:')) return filePath;
  if (path.isAbsolute(filePath)) {
    console.log(`[VIDEO URL] Absolute path resolved:`, pathToFileURL(filePath).href);
    return pathToFileURL(filePath).href;
  }
  
  // Try standard dev path first
  let targetPath = path.join(__dirname, filePath);
  if (fs.existsSync(targetPath)) {
    console.log(`[VIDEO URL] Dev path resolved:`, pathToFileURL(targetPath).href);
    return pathToFileURL(targetPath).href;
  }

  // If running in packaged app, videos are in extraResources (process.resourcesPath)
  if (app.isPackaged) {
    targetPath = path.join(process.resourcesPath, filePath);
    if (fs.existsSync(targetPath)) {
      console.log(`[VIDEO URL] Packaged path resolved:`, pathToFileURL(targetPath).href);
      return pathToFileURL(targetPath).href;
    }
  }

  console.log(`[VIDEO URL] Fallback to:`, pathToFileURL(path.join(__dirname, filePath)).href);
  // Fallback
  return pathToFileURL(path.join(__dirname, filePath)).href;
}

// ─── IPC Handlers ────────────────────────────────────────────────────────────

/** Return current settings to the renderer */
ipcMain.handle('get-settings', () => {
  const settings = { ...currentSettings };
  if (settings.videoFile) {
    settings.videoFile = resolveVideoFileUrl(settings.videoFile);
  }
  return settings;
});

/** Persist updated settings from the renderer */
ipcMain.handle('save-settings', (_event, settings) => {
  const success = saveSettings(settings);
  if (success) setupReminder();
  return success;
});

/** Return the app version string */
ipcMain.handle('get-app-version', () => APP_VERSION);

ipcMain.on('log-error', (event, msg) => {
  console.log(`[RENDERER ERROR] ${msg}`);
});

/** Return the list of bundled videos available in the videos/ folder */
ipcMain.handle('get-bundled-videos', () => {
  const videosDir = app.isPackaged ? path.join(process.resourcesPath, 'videos') : path.join(__dirname, 'videos');
  if (!fs.existsSync(videosDir)) return [];
  return fs.readdirSync(videosDir)
    .filter(f => f.endsWith('.webm') || f.endsWith('.mp4'))
    .map(f => `videos/${f}`);
});

/** Close whichever window sent this message */
ipcMain.on('close-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win && !win.isDestroyed()) win.close();
});

/** Trigger the reminder from the settings window ("Test" button) */
ipcMain.on('trigger-reminder', () => {
  createReminderWindow();
});

/** Open a native file dialog so the user can pick a video file */
ipcMain.handle('select-video-file', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Select Reminder Video',
    filters: [
      { name: 'Video Files', extensions: ['webm', 'mp4', 'mov', 'avi'] },
      { name: 'All Files', extensions: ['*'] },
    ],
    properties: ['openFile'],
  });

  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

// ─── Windows ─────────────────────────────────────────────────────────────────

/**
 * Create (or focus) the Settings window.
 */
function createSettingsWindow() {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 550,
    height: 720,
    resizable: false,
    alwaysOnTop: true,
    frame: true,
    transparent: false,
    title: `${APP_NAME} — Settings`,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    show: false,
  });

  settingsWindow.setMenu(null);
  settingsWindow.loadFile('public/settings.html');

  settingsWindow.on('ready-to-show', () => {
    if (settingsWindow && !settingsWindow.isDestroyed()) settingsWindow.show();
  });

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}

/**
 * Create (or focus) the full-screen transparent Reminder window.
 * Automatically closes after the configured duration.
 */
function createReminderWindow() {
  if (videoReminderWindow && !videoReminderWindow.isDestroyed()) {
    videoReminderWindow.focus();
    return;
  }

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.bounds;

  videoReminderWindow = new BrowserWindow({
    width,
    height,
    x: 0,
    y: 0,
    resizable: false,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    hasShadow: false,
    backgroundColor: '#00000000',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    show: false,
    fullscreen: true,
    skipTaskbar: true,
  });

  videoReminderWindow.setMenu(null);
  videoReminderWindow.loadFile('public/video-reminder.html');

  videoReminderWindow.on('ready-to-show', () => {
    if (videoReminderWindow && !videoReminderWindow.isDestroyed()) {
      videoReminderWindow.show();
    }
  });

  videoReminderWindow.on('closed', () => {
    videoReminderWindow = null;
  });

  // Safety net: auto-close after configured duration + 2 s buffer
  const autoCloseMs = (currentSettings.videoDurationSeconds + 2) * 1000;
  setTimeout(() => {
    if (videoReminderWindow && !videoReminderWindow.isDestroyed()) {
      videoReminderWindow.close();
    }
  }, autoCloseMs);
}

// ─── System Tray ─────────────────────────────────────────────────────────────

/**
 * Initialise the system-tray icon and context menu.
 */
function setupTray() {
  try {
    const iconPath = path.join(__dirname, 'public', 'icon.png');
    const icon = nativeImage.createFromPath(iconPath);

    tray = new Tray(icon.resize({ width: 16, height: 16 }));

    const contextMenu = Menu.buildFromTemplate([
      {
        label: '👁️  Show Reminder Now',
        click: () => createReminderWindow(),
      },
      {
        label: '⚙️  Settings',
        click: () => createSettingsWindow(),
      },
      { type: 'separator' },
      {
        label: `v${APP_VERSION}`,
        enabled: false,
      },
      { type: 'separator' },
      {
        label: '❌  Quit',
        click: () => {
          if (reminderInterval) clearInterval(reminderInterval);
          app.quit();
        },
      },
    ]);

    tray.setToolTip(`${APP_NAME} — Rest your eyes regularly`);
    tray.setContextMenu(contextMenu);
    tray.on('click', () => createReminderWindow());
  } catch (error) {
    console.error(`[${APP_NAME}] Tray initialisation error:`, error.message);
  }
}

// ─── Reminder Scheduler ─────────────────────────────────────────────────────

/**
 * (Re-)start the periodic reminder timer based on current settings.
 */
function setupReminder() {
  if (reminderInterval) clearInterval(reminderInterval);

  if (currentSettings.enabled) {
    const intervalMs = currentSettings.reminderIntervalMinutes * 60 * 1000;
    reminderInterval = setInterval(() => createReminderWindow(), intervalMs);
    console.log(`[${APP_NAME}] Reminders enabled — every ${currentSettings.reminderIntervalMinutes} min`);
  } else {
    console.log(`[${APP_NAME}] Reminders disabled`);
  }
}

// ─── App Lifecycle ───────────────────────────────────────────────────────────

// Disable hardware acceleration to ensure the transparent window works on Windows
app.disableHardwareAcceleration();

// Enforce single instance
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  console.log(`[${APP_NAME}] Another instance is already running — exiting`);
  app.quit();
} else {
  app.on('second-instance', () => {
    // If user tries to open a second instance, show settings instead
    createSettingsWindow();
  });
}

app.whenReady().then(() => {
  loadSettings();
  setupTray();
  setupReminder();
  console.log(`[${APP_NAME}] v${APP_VERSION} started`);
});

// Hide dock icon on macOS (tray-only app)
if (process.platform === 'darwin') {
  app.dock.hide();
}

// Don't quit when all windows close — we live in the tray
app.on('window-all-closed', () => {
  // intentionally empty
});

// ─── Global Error Handlers ───────────────────────────────────────────────────

process.on('unhandledRejection', (error) => {
  console.error(`[${APP_NAME}] Unhandled rejection:`, error);
});

process.on('uncaughtException', (error) => {
  console.error(`[${APP_NAME}] Uncaught exception:`, error);
});