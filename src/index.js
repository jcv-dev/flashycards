const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const prompt = require('electron-prompt');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false, // Asegúrate de que esté desactivado
        }
    });

    mainWindow.loadFile('src/index.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.handle('dialog:openFile', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'JSON Files', extensions: ['json'] }]
    });
    if (canceled) {
        return null;
    } else {
        const data = fs.readFileSync(filePaths[0], 'utf-8');
        return { filePath: filePaths[0], data: JSON.parse(data) };
    }
});

ipcMain.handle('file:saveChanges', async (event, { filePath, data }) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
});


ipcMain.handle('electron-prompt:prompt', async (event, options) => {
  try {
    const result = await prompt(options);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
});
