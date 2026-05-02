// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Expose a minimal API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Settings window functions
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  closeWindow: () => ipcRenderer.send('close-window'),

  // Video reminder functions
  setVideoDuration: (duration) => ipcRenderer.send('set-video-duration', duration)
});