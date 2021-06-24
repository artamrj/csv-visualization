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
  ipcMain.handle("dialog:open", async (_: any, args: any) => {
    const result = dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: "CSV", extensions: ["csv"] }],
    });
    return result;
  });

  const indexHTML = path.join(__dirname + "/../html/index.html");
  mainWindow
    .loadFile(indexHTML)
    .then(() => {
      // IMPLEMENT FANCY STUFF HERE
    })
    .catch((e: any) => console.error(e));
  mainWindow.setMenuBarVisibility(false);
});
