const fs = require("fs");
const path = require("path");
const electron = require("electron");
const app = electron.app;
const file = path.join(app.getPath("userData"), "settings.json");

let argv = require("minimist")(process.argv.slice(2));

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
        
        icon  : "./icon.png",
        title : require("./package.json").title,
        
        autoHideMenuBar : true
    });
    
    // Remove the default menu, it isn't very useful
    window.setMenu(null);
    
    window.loadURL(`file://${__dirname}/app/index.html`);
    
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
        settings = JSON.parse(fs.readFileSync(file));
    } catch(e) {
        settings = JSON.parse(fs.readFileSync("./settings.json"));
    }
    
    // So it's easily accessible anywhere
    global.settings = settings;

    createWindow();
    
    // Create Tray icon
    tray = new electron.Tray("./icon.png");
    
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
