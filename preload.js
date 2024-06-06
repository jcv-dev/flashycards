const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    saveChanges: (filePath, data) => ipcRenderer.invoke('file:saveChanges', { filePath, data })
});
