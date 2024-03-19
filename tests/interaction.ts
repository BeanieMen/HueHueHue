import { Collection } from "discord.js";
import { OptionData, MockGuild, MockMember, MockRole } from "./mock-types";



export class MockInteraction {
  options: {
    data: OptionData;
    getString: (key: string) => string | null;
  };

  guild: MockGuild
  member: MockMember
  replies: string;
  replied: boolean;
  isCommand: boolean;

  constructor(data: OptionData, isCommand = false, member?: string, guild?: MockGuild | undefined) {
    this.replies = "";
    this.replied = false;

    this.options = {
      data,
      getString: (key) => this.options.data[key] as string | null,
    };

    this.member = {
      displayName: member ?? "beanieeman",
      roles: {
        add: (role: MockRole) => this.member.roles.cache.set(role.name, role),
        cache: new Collection<string, MockRole>(),
      },
    };


    this.guild = guild ?? {
      id: "guild-id",
      roles: {
        cache: new Collection<string, MockRole>(),
        create: (options) => {
          const randomId = generateRandom16DigitString();
          const role: MockRole = {
            setPosition: (position: number) => {
              if (position < 0) position = 0;
              const rolesToAdjust = this.guild.roles.cache.filter(
                (role) => role.position! >= position
              );

              rolesToAdjust.forEach((role) => (role.position! += 1));

              role.position = position;
            },
            name: options.name,
            color: options.color ?? 0xffffff,
            position: options.position ?? 0,
          };
          this.guild.roles.cache.set(randomId, role);
          return role;
        },
      },
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
