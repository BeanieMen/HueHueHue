import { Snowflake, SnowflakeUtil, Collection } from "discord.js";
import {
  IGuild,
  IInteracion,
  IMember,
  IRole,
  IRoleManager,
  OptionData,
} from "./mock-types";
import { setPosition, discordSort } from "./utils";
export class MockInteraction implements IInteracion {
  options: {
    data: OptionData;
    getString: (key: string) => string | null;
  };

  guild: MockGuild;
  member: MockMember;
  replies: string;
  replied: boolean;
  isCommand: boolean;

  constructor(
    data: OptionData,
    isCommand = false,
    guild?: MockGuild | undefined,
    member?: MockMember,
  ) {
    this.replies = "";
    this.replied = false;
    this.options = {
      data,
      getString: (key) => this.options.data[key] as string | null,
    };
    this.member = member ?? new MockMember("beanieemann");
    this.guild = guild ?? new MockGuild();
    this.isCommand = isCommand;
  }

  reply(msg: string) {
    if (this.replied) throw new Error(`Message already replied to`);
    this.replies = msg;
    this.replied = true;
  }

  isChatInputCommand() {
    return this.isCommand;
  }
}

export class MockGuild implements IGuild {
  id: Snowflake;
  roles: IRoleManager;

  constructor() {
    this.id = SnowflakeUtil.generate().toString();
    this.roles = new MockRoleManager(this);
  }
}

export class MockMember implements IMember {
  displayName?: string;
  roles: { add: (role: IRole) => void; cache: Collection<string, IRole> };

  constructor(displayName: string, roles?: Collection<string, MockRole>) {
    this.displayName = displayName ?? "default";
    this.roles = {
      cache: roles ?? new Collection<string, MockRole>(),
      add: (role: MockRole) => this.roles.cache.set(role.id, role),
    };
  }
}

export class MockRole implements IRole {
  name: string;
  color: number;
  position: number;
  id: Snowflake;
  guild: IGuild;

  constructor(opts: {
    name: string;
    color?: number;
    position?: number;
    id?: Snowflake;
    guild: MockGuild;
  }) {
    this.name = opts.name;
    this.color = opts.color ?? 0xffffff;
    this.position = opts.position ?? 0;
    this.id = opts.id ?? SnowflakeUtil.generate().toString();
    this.guild = opts.guild;
  }
  setPosition(position: number) {
    this.guild.roles.setPosition(this, position);
  }

  delete() {
    this.guild.roles.cache.delete(this.id);
  }

  edit(color: {color: number}) {
    this.color = color.color;
  }
}

export class MockRoleManager implements IRoleManager {
  guild: IGuild;
  cache: Collection<string, IRole>;

  constructor(guild: MockGuild) {
    this.guild = guild;
    this.cache = new Collection<string, MockRole>();
  }

  create(opts: {
    name: string;
    color?: number;
    reason?: string;
    position?: number;
  }): Promise<MockRole> {
    const role: MockRole = new MockRole({
      name: opts.name,
      color: opts.color,
      position: opts.position,
      guild: this.guild,
    });
    this.cache.set(role.id, role);
    return Promise.resolve(role);
  }

  async setPosition(role: MockRole, position: number) {
    const updatedRoles = setPosition(
      role,
      position,
      false,
      discordSort(this.guild.roles.cache),
    );
    updatedRoles.forEach((v) => {
      const role = this.guild.roles.cache.get(v.id);
      role!.position = v.position;
    });
  }
}
