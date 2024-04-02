import { Collection, Snowflake } from "discord.js";

export interface OptionData {
  [key: string]: string;
}
export interface IRole {
  guild: IGuild;
  setPosition: (position: number) => void;
  name: string;
  color: number;
  position: number;
  id: Snowflake;
  delete: () => void;
  edit: (color: number) => void;
}
export interface IMember {
  displayName?: string;
  roles: {
    add: (role: IRole) => void;
    cache: Collection<Snowflake, IRole>;
  };
}

export interface IGuild {
  id: Snowflake;
  roles: IRoleManager;
}

export interface IRoleManager {
  guild: IGuild;
  cache: Collection<Snowflake, IRole>;
  create(opts: {
    name: string;
    color?: number;
    reason?: string;
    position?: number;
  }): Promise<IRole>;
  setPosition: (role: IRole, position:number) => void
}

export interface IInteracion {
  options: { data: OptionData; getString: (key: string) => string | null };
  guild: IGuild;
  member: IMember;
  replies: string;
  replied: boolean;
  isCommand: boolean;
  reply:(msg: string) => void
  isChatInputCommand: () => boolean
}
