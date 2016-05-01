const fs = require("fs");
const path = require("path");
const electron = require("electron");
const app = electron.app;
const file = path.join(app.getPath("userData"), "settings.json");

let window;
let settings;

function createWindow() {
    window = new electron.BrowserWindow(settings);
    window.loadURL(`file://${__dirname}/app/index.html`);
    
    window.on("resize", () => {
        settings = Object.assign(settings, window.getBounds());
    });

    // Open the DevTools.
    window.webContents.openDevTools();

    window.on("closed", () => {
        window = null;
    });
}

app.on("ready", () => {
    try {
        let json = fs.readFileSync(file);
        settings = JSON.parse(json);
    } catch(e) {
        settings = {
            width  : 800,
            height : 800
        };
    }
    
    createWindow();
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // Except on OSX
    if(process.platform === "darwin") {
        return;
    }
    
    app.quit();
});

// Save out settings before quitting
app.on("will-quit", () => {
    fs.writeFileSync(file, JSON.stringify(settings, null, 4));
});

app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if(window === null) {
        createWindow();
    }
});
