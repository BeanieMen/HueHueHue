import * as fs from "fs";

class HighDB<T extends object> {
  data: T;
  location: string;
  constructor(location: string, defaultData: T) {
    this.data = defaultData;

    this.location = process.env.VITEST ? "tests/test." + location : location;
    if (!process.env.VITEST) {
      const dataFromFile = JSON.parse(fs.readFileSync(location, "utf-8"));
      Object.assign(this.data, dataFromFile);
    }
  }

  async setConfig(data: Partial<T>): Promise<void> {
    Object.assign(this.data, data);
    await fs.promises.writeFile(
      this.location,
      JSON.stringify(this.data, null, 2)
    );
  }
}

interface config {
  colorRoleName: string;
  colorRoleIds: string[];
  markerStart: string;
  markerEnd: string;
}

const defaultConfig: config = {
  colorRoleName: "fav color",
  colorRoleIds: [],
  markerStart: "<color>",
  markerEnd: "</color>",
};

export const config = new HighDB<config>("config.json", defaultConfig);
export const colorRole = config.data.colorRoleName;
export const markerStart = config.data.markerStart;
export const markerEnd = config.data.markerEnd;
export const colorRoleIds = config.data.colorRoleIds;
