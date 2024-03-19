import { Collection } from "discord.js";
interface OptionData {
  [key: string]: string;
}

export interface Role {
  name: string;
  color?: number;
}

export class MockInteraction {
  options: {
    data: OptionData;
    getString: (key: string) => string | null;
  };

  guild: {
    id: string;
    roles: { cache: Collection<string, Role>, create: (options: Role) => Role };
  };

  member: {
    displayName: string;
    roles: {
      add: (role: Role) => void,
      cache: Collection<string, Role>
    };
  };

  replies: string;
  replied: boolean;
  isCommand: boolean;

  constructor(data: OptionData, isCommand = false) {
    this.replies = "";
    this.replied = false;

    this.options = {
      data,
      getString: (key) => this.options.data[key] as string | null,
    };

    this.member = {
      displayName: "beanieeman",
      roles: {
        add: (role: Role) => (this.member.roles.cache.set(role.name, role)),
        cache: new Collection<string, Role>(),
      },
    };

    this.guild = {
      id: "guild-id",
      roles: {
        cache: new Collection<string, Role>(),
        create: (options) => {
          const role: Role = {
            name: options.name,
            color: options.color ?? 0xffffff,
          };
          this.guild.roles.cache.set(role.name, role);
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

// const interaction = new MockInteraction({}, true)
// interaction.member.roles.cache.find