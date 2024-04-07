import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
export class HighDB<T> {
  db: Low<T>;
  constructor(location: string, defaultData: T) {
    const adapter = new JSONFile<T>(location);
    this.db = new Low<T>(adapter, defaultData);
  }

  async setConfig(data: T): Promise<void> {
    for (const key in data) {
      this.db.data[key] = data[key];
    }

    await this.db.write();
  }

  async getConfig(): Promise<T> {
    await this.db.read();
    return this.db.data;
  }
}

interface config {
  colorRoleName: string;
  colorRoleIds: string[];
  markerStart: string;
  markerEnd: string
}

const defaultConfig: config = {
  colorRoleName: "fav color",
  colorRoleIds: [],
  markerStart: "<color>",
  markerEnd: "</color>"
};

export const config = new HighDB<config>("config.json", defaultConfig);
await config.setConfig(await config.getConfig()); //just for initializing
const configCache = await config.getConfig()

export const colorRole = configCache.colorRoleName
export const markerStart = configCache.markerStart
export const markerEnd = configCache.markerEnd
export const colorRoleIds = configCache.colorRoleIds