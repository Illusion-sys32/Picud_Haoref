const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveUserSettings: (settings) => ipcRenderer.send('save-user-settings', settings),
  loadUserSettings: () => ipcRenderer.invoke('load-user-settings'),
  readAlertsData: () => ipcRenderer.invoke('read-alerts-data'),
  getAlertNumber: () => ipcRenderer.invoke('get-alert-number'),
  loadIntresPoints: () => ipcRenderer.invoke('load-intres-points'),
  getInterestPoints: () => ipcRenderer.invoke('get-interest-points'),
  getUserLocation: () => ipcRenderer.invoke('get-user-location'),
  loadAutoLocation: () => ipcRenderer.invoke('load-auto-location'),
  removeInterestPoint: (placeName) => ipcRenderer.send('remove-intres-point', placeName),
  addInterestPoint: (intresPoints) => ipcRenderer.invoke('add-intres-point', intresPoints),
});
