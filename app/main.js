const fs = require("fs");
const path = require("path");

const electron = require("electron");
const app = electron.app;
const ipc = electron.ipcMain;

// Default to local appdata only, because it's more correct
// Has to be done asap or it won't take
// https://github.com/electron/electron/issues/1404
if(process.platform === "win32") {
    app.setPath("appData", process.env.LOCALAPPDATA);
    app.setPath("userData", path.join(process.env.LOCALAPPDATA, app.getName()));
}

const argv = require("minimist")(process.argv.slice(2));
const json = path.join(app.getPath("userData"), "settings.json");

let window;
let tray;
let settings;

function syncPosition() {
    settings = Object.assign(settings, window.getBounds());
}

function createWindow() {
    window = new electron.BrowserWindow({
        width  : settings.width,
        height : settings.height,
        
        x : settings.x,
        y : settings.y,
        
        icon  : path.join(__dirname, "./icon.png"),
        title : require("./package.json").productName,
        
        autoHideMenuBar : true
    });
    
    // Remove the default menu, it isn't very useful
    window.setMenu(null);
    
    window.loadURL(`file://${__dirname}/index.html`);
    
    window.on("resize", syncPosition);
    window.on("move", syncPosition);
    
    if(argv.devtools) {
        window.webContents.openDevTools();
    }
    
    window.on("closed", () => {
        window = null;
    });
}

app.on("ready", () => {
    try {
        settings = JSON.parse(fs.readFileSync(json));
    } catch(e) {
        settings = JSON.parse(fs.readFileSync(path.join(__dirname, "./settings.json")));
    }
    
    // So it's easily accessible anywhere
    global.settings = settings;

    createWindow();
    
    // Create Tray icon
    tray = new electron.Tray(path.join(__dirname, "./icon.png"));
    
    tray.on("double-click", () => window.show());
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // Except on OSX
    if(process.platform === "darwin") {
        return;
    }
    
    app.quit();
});

app.on("will-quit", () => {
    // Save out settings before quitting
    fs.writeFileSync(json, JSON.stringify(settings, null, 4));
});

app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if(window === null) {
        createWindow();
    }
});

// Settings hooks
ipc.on("tab-add", (e, tab) => {
    settings.tabs.push(tab);
    
    e.sender.send("tab-updated");
});

ipc.on("tab-del", (e, pos) => {
    settings.tabs.splice(pos, 1);
    
    e.sender.send("tab-updated");
});
