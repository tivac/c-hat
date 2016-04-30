const electron = require('electron');
const app = electron.app;

let mainWindow;

function createWindow () {
    mainWindow = new electron.BrowserWindow({ width : 800, height : 600 });
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    mainWindow.on("closed", function () {
        mainWindow = null
    });
}

app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
    // Except on OSX
    if(process.platform === 'darwin') {
        return;
    }
    
    app.quit();
});

app.on("activate", function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if(mainWindow === null) {
        createWindow();
    }
});
