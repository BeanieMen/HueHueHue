interface OptionData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export class MockInteraction {
  options: { data: OptionData; getString: (sel: string) => string | null };
  guild: { id: string; roles: { cache: object; find: (callback: (role: object) => boolean) => object | null } };
  replies: string;
  replied: boolean;
  isCommand: boolean;

  constructor(data: OptionData, isCommand?: boolean) {
    this.isCommand = isCommand ?? false;
    this.replies = "";
    this.replied = false;
    this.options = {
      data: data,
      getString: (sel: string): string | null => {
        if (sel === undefined || typeof sel !== "string") {
          return null;
        }
        return this.options.data[sel];
      },
    };
    this.guild = {
      id: "guild-id",
      roles: {
        cache: {},
        find: (callback: (role: object) => boolean) => {
          if (typeof callback !== "function") {
            throw new Error(
              "Invalid callback provided. Please provide a function."
            );
          }

          for (const role of Object.values(this.guild.roles.cache)) {
            if (callback(role as object)) {
              return role;
            }
          }
          return null;
        },
      },
    };
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
