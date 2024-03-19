import { Collection } from "discord.js";
import { OptionData, MockGuild, MockMember, MockRole } from "./mock-types";

export class MockRoleClass {
  guild: MockGuild;
  cache: Collection<string, MockRole>;

  constructor(guild: MockGuild) {
    this.guild = guild;
    if (guild) {
      if (guild.roles) {
        this.cache = guild.roles.cache;
      }
    } else this.cache = new Collection<string, MockRole>();
  }
  
  create(options: MockRole): MockRole {
    const randomId = generateRandom16DigitString();
    const role: MockRole = {
      id: randomId,
      setPosition: (position: number) => {
        if (position < 0) position = 0;
        const rolesToAdjust = this.cache.filter(
          (role) => role.position! >= position
        );

        rolesToAdjust.forEach((role) => (role.position! += 1));

        role.position = position;
      },
      delete: () => {
        this.cache.delete(role.id ?? "");
      },
      edit: (color: number) => {
        role.color = color
      },
      name: options.name,
      color: options.color ?? 0xffffff,
      position: options.position ?? 0,
    };
    this.cache.set(randomId, role);
    return role;
  }
}

export class MockMemberClass {
  roles: { add: (role: MockRole) => void; cache: Collection<string, MockRole> };
  displayName: string;
  constructor(displayName: string, roles?: Collection<string, MockRole>) {
    this.displayName = displayName;
    this.roles = {cache: roles ?? new Collection<string, MockRole>(), add: (role: MockRole) => this.roles.cache.set(role.name, role)}
  }
}

export class MockInteraction {
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
    member?: MockMember
  ) {
    this.replies = "";
    this.replied = false;

    this.options = {
      data,
      getString: (key) => this.options.data[key] as string | null,
    };

    this.member = member ?? new MockMemberClass("beanieemann")

    this.guild = guild ?? {
      id: "guild-id",
      roles: new MockRoleClass(this.guild),
    };

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

function generateRandom16DigitString() {
  const chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
