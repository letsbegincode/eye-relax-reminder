/**
 * @fileoverview Preload script — exposes a minimal, safe API from the main
 * process to the renderer via contextBridge.
 *
 * @license MIT
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // ── Settings ────────────────────────────────────────────────────────────
  /** Retrieve the current settings object */
  getSettings: () => ipcRenderer.invoke('get-settings'),

  /** Persist updated settings */
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),

  // ── Window Management ──────────────────────────────────────────────────
  /** Close the calling window */
  closeWindow: () => ipcRenderer.send('close-window'),

  // ── Video Selection ────────────────────────────────────────────────────
  /** Open a native file-picker for video files; returns path or null */
  selectVideoFile: () => ipcRenderer.invoke('select-video-file'),

  // ── Reminder ───────────────────────────────────────────────────────────
  /** Trigger a reminder immediately (used by the "Test" button) */
  triggerReminder: () => ipcRenderer.send('trigger-reminder'),

  // ── App Info ───────────────────────────────────────────────────────────
  /** Get the current app version string */
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
});