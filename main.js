// Modules to control application life and create native browser window
import { app, BrowserWindow, nativeImage } from "electron";

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    const image = nativeImage.createFromPath(join(__dirname, './web/assets/icon.png'));
    // image.setTemplateImage(true)
    console.log(image.isEmpty())
    mainWindow = new BrowserWindow({
        // width: 570,
        // height: 600,
        width: 1000,
        height: 650,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    // Disable Cmd+R and Ctrl+R
    mainWindow.webContents.on("before-input-event", (event, input) => {
        if (
            (input.key.toLowerCase() === "r" && input.control) ||
            (input.key.toLowerCase() === "r" && input.meta)
        ) {
            console.log("Blocked reload shortcut!");
            event.preventDefault();
        }
    });

    // and load the index.html of the app.
    mainWindow.loadURL("http://localhost:8000/index.html");
    mainWindow.setResizable(true);
    mainWindow.setIcon(image);
    app.dock?.setIcon(image);



    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on("closed", function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
