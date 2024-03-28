import path from "path";
import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import Store from "./helpers/store";
import documentStore from "./helpers/documentStore";

// Load json data from ../test_documents.json
const testDocuments = require("../test_documents.json");

const isProd = process.env.NODE_ENV === "production";

function getDocumentData(query) {
  const documents = documentStore.getAll();
  return documents;
}

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  // Check if documentStore is empty. If so, give it the test data.
  if (true) {
    documentStore.setAtPath("documents", testDocuments.documents);
  } else {
    console.log("Document Store: ", documentStore.getAll());
  }

  ipcMain.handle("getDocumentData", getDocumentData);

  const mainWindow = createWindow("main", {
    width: 1500,
    height: 1000,
    webPreferences: {
      preload: path.join(path.resolve(path.dirname("")), "app", "preload.js"),
      allowRunningInsecureContent: true,
      nodeIntegration: true,
      scrollBounce: true,
      sandbox: false,
    },
    titleBarStyle: "hiddenInset",
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});
