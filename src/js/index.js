"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
app.whenReady().then(() => {
    const mainWindow = new BrowserWindow({
        minHeight: 650,
        minWidth: 1000,
        center: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    });
    //dialog
    ipcMain.handle("dialog:open", (_, args) => __awaiter(void 0, void 0, void 0, function* () {
        const result = dialog.showOpenDialog({
            properties: ['openFile', 'multiSelections'],
            filters: [{ name: "CSV", extensions: ["csv"] }],
        });
        return result;
    }));
    const indexHTML = path.join(__dirname + "/../html/index.html");
    mainWindow
        .loadFile(indexHTML)
        .then(() => {
        // IMPLEMENT FANCY STUFF HERE
    })
        .catch((e) => console.error(e));
    mainWindow.setMenuBarVisibility(false);
});
