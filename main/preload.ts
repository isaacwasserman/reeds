import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

window.ipcRenderer = require("electron").ipcRenderer;

const handler = {
  send(channel: string, value: unknown) {
    ipcRenderer.send(channel, value);
  },
  on(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
};

contextBridge.exposeInMainWorld("ipc", handler);

contextBridge.exposeInMainWorld("electronAPI", {
  getDocumentData: () => ipcRenderer.invoke("getDocumentData"),
});

export type IpcHandler = typeof handler;
