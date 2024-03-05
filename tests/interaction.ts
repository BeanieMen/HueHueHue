interface OptionData {
  [key: string]: string | number | boolean;
}

export class MockInteraction {
  options: { data: OptionData; getString: (sel: string) => string | null, getBoolean: (sel: string) => boolean | null, getInteger: (sel: string) => number | null  };
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
      getBoolean:  (sel: string): boolean | null => {
        if (sel === undefined) {
          return null;
        }
        if( typeof this.options.data[sel] === "boolean"){
          return this.options.data[sel] as boolean
        } else return null
      },
      getInteger:  (sel: string): number | null => {
        if (sel === undefined) {
          return null;
        }
        if( typeof this.options.data[sel] === "number"){
          return this.options.data[sel] as number
        } else return null
      },
      getString: (sel: string): string | null => {
        if (sel === undefined) {
          return null;
        }
        if( typeof this.options.data[sel] === "string"){
          return this.options.data[sel] as string
        } else return null
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
