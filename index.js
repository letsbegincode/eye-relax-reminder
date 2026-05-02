const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, screen } = require('electron');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

let mainWindow = null;
let settingsWindow = null;
let videoReminderWindow = null;
let tray = null;
let reminderInterval = null;
let currentSettings = {
  reminderIntervalMinutes: 20,
  videoDurationSeconds: 10,
  enabled: true,
  displayMode: 'animation',
  videoFile: '../videos/Firefly A realistic chubby brown furry cat enters from the left side of the frame. _The cat walks sl.mp4'
};

// Settings file path
const settingsPath = path.join(__dirname, 'settings.json');

// Load settings from file
function loadSettings() {
  try {
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, 'utf8');
      const loaded = JSON.parse(data);
      currentSettings = { ...currentSettings, ...loaded };
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

// Save settings to file
function saveSettings(settings) {
  try {
    currentSettings = { ...currentSettings, ...settings };
    fs.writeFileSync(settingsPath, JSON.stringify(currentSettings, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
}

function resolveVideoFileUrl(filePath) {
  if (!filePath) return filePath;
  if (filePath.startsWith('file:')) return filePath;
  if (path.isAbsolute(filePath)) {
    return pathToFileURL(filePath).href;
  }
  return pathToFileURL(path.join(__dirname, filePath)).href;
}

// Handle IPC events
ipcMain.handle('get-settings', () => {
  const settings = { ...currentSettings };
  if (settings.videoFile) {
    settings.videoFile = resolveVideoFileUrl(settings.videoFile);
  }
  return settings;
});

ipcMain.handle('save-settings', (event, settings) => {
  const success = saveSettings(settings);
  if (success) {
    // Restart or start the reminder interval with updated settings
    setupReminder();
  }
  return success;
});

ipcMain.on('close-window', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) {
    window.close();
  }
});

// Create settings window
function createSettingsWindow() {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 550,
    height: 650,
    resizable: false,
    alwaysOnTop: true,
    frame: true,
    transparent: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false
  });

  settingsWindow.loadFile('public/settings.html');

  settingsWindow.on('ready-to-show', () => {
    if (settingsWindow && !settingsWindow.isDestroyed()) {
      settingsWindow.show();
    }
  });

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}

// Create video reminder window (full screen, transparent)
function createVideoReminderWindow() {
  if (videoReminderWindow && !videoReminderWindow.isDestroyed()) {
    videoReminderWindow.focus();
    return;
  }

  // Get primary display
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.bounds;

  videoReminderWindow = new BrowserWindow({
    width: width,
    height: height,
    x: 0,
    y: 0,
    resizable: false,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false,
    fullscreen: true,
    skipTaskbar: true
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

  // Auto-close after configured duration
  setTimeout(() => {
    if (videoReminderWindow && !videoReminderWindow.isDestroyed()) {
      videoReminderWindow.close();
    }
  }, currentSettings.videoDurationSeconds * 1000);
}

// Setup tray
function setupTray() {
  try {
    const iconPath = path.join(__dirname, 'public', 'icon.png');
    const icon = nativeImage.createFromPath(iconPath);

    tray = new Tray(icon);

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show Reminder Now',
        click: () => createVideoReminderWindow()
      },
      {
        label: 'Settings',
        click: () => createSettingsWindow()
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => {
          if (reminderInterval) clearInterval(reminderInterval);
          app.quit();
        }
      }
    ]);

    tray.setToolTip('Eye Relax - Rest your eyes regularly');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => createVideoReminderWindow());

  } catch (error) {
    console.error('Tray initialization error:', error);
  }
}

// Setup reminder interval
function setupReminder() {
  if (reminderInterval) clearInterval(reminderInterval);

  // Only setup if enabled
  if (currentSettings.enabled) {
    const intervalMs = currentSettings.reminderIntervalMinutes * 60 * 1000;
    reminderInterval = setInterval(() => {
      createVideoReminderWindow();
    }, intervalMs);
  }
}

// Disable hardware acceleration for better transparency
app.disableHardwareAcceleration();

// App event handlers
app.whenReady().then(() => {
  // Load settings first
  loadSettings();

  // Setup tray
  setupTray();

  // Show initial reminder (optional - comment out if you don't want auto-start)
  // createVideoReminderWindow();

  // Setup reminder interval
  setupReminder();
});

// Prevent app from showing in dock (Mac)
if (process.platform === 'darwin') {
  app.dock.hide();
}

app.on('window-all-closed', () => {
  // Don't quit when windows are closed (we have a tray icon)
});

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});