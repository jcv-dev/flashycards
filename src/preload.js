
const { contextBridge, ipcRenderer, dialog } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    saveChanges: (filePath, data) => ipcRenderer.invoke('file:saveChanges', { filePath, data }),
    prompt: async (options) => await ipcRenderer.invoke('electron-prompt:prompt', options),
    dialog: {
        showOpenDialog: async (options) => {
            try {
                const result = await dialog.showMessageBox(options);
                return result;
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
        // Puedes agregar más métodos de dialog aquí según sea necesario
    }
});

