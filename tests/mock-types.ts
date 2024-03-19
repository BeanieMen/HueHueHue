import { Collection } from "discord.js";

export interface OptionData {
  [key: string]: string;
}
export interface MockRole {
  setPosition: (position: number) => void;
  name: string;
  color?: number;
  position?: number;
}
export interface MockMember {
  displayName?: string;
  roles: {
    add: (role: MockRole) => void;
    cache: Collection<string, MockRole>;
  };
}

export interface MockGuild {
  id: string;
  roles: {
    cache: Collection<string, MockRole>;
    create: (options: MockRole) => MockRole;
  };
}
