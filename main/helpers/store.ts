import { app, ipcMain } from "electron";
import fs from "fs";
import path from "path";

interface DataStoreOptions {
  fileName: string;
  defaults: any;
}

class DataStore {
  private path: string;
  private data: any;

  constructor(opts: DataStoreOptions) {
    // String of the user's app data directory path.
    const userDataPath = app.getPath("userData");
    // Use `opts.fileName` to set the file name and `path.join` to bring it all together as a string
    this.path = path.join(userDataPath, `${opts.fileName}.json`);
    console.log(this.path);

    this.data = parseDataFile(this.path, opts.defaults);
  }

  // This will just return the property on the `data` object
  getAtPath(keyPath: string): any {
    const keys = keyPath.split("/");
    let data = this.data;
    for (const key of keys) {
      data = data[key];
    }
    return data;
  }

  getAll(): any {
    return this.data;
  }

  // ...and this will set it
  setAtPath(keyPath: string, val: any): void {
    const keys = keyPath.split("/");
    let cursor = this.data;
    for (const key of keys.slice(0, -1)) {
      if (!cursor[key]) cursor[key] = {};
      cursor = cursor[key];
    }
    cursor[keys[keys.length - 1]] = val;
    // Synchronously write the file
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

function parseDataFile(filePath: string, defaults: any): any {
  // Try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    // If there was some kind of error, return the passed in defaults instead.
    return defaults;
  }
}

export default DataStore;
