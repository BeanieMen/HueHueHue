import Commands from "../src/commands";
import {
  mockClientUser,
  mockChatInputCommandInteraction,
  mockGuild,
  mockGuildMember,
  mockTextChannel,
  mockUser,
} from "@beanieman/discordjs-mock";
import {
  ChatInputCommandInteraction,
  Client,
  Guild,
  TextBasedChannel,
  TextChannel,
  User,
} from "discord.js";
import { config } from "dotenv";
config()

class Mock {
  private client!: Client;
  private guild!: Guild;
  private channel!: TextChannel;
  private user!: User;

  getClient(withBots: boolean = false): Client {
    if (withBots) {
      const botUser = mockUser(this.client, { bot: true });
      mockGuildMember({
        client: this.client,
        user: botUser,
        guild: this.guild,
      });
    }
    return this.client;
  }

  getUser(): User {
    return this.user;
  }

  getGuild(): Guild {
    return this.guild;
  }

  getChannel(): TextBasedChannel {
    return this.channel;
  }

  commandInteractionCreate(commandName: string): ChatInputCommandInteraction {
    const interaction = mockChatInputCommandInteraction({
      client: this.client,
      name: commandName,
      id: "0",
      channel: this.channel,
    });
    interaction.commandName = commandName;
    return interaction;
  }

  constructor() {
    this.mockClient();
    this.mockGuild();
    this.mockUser();
    this.mockChannel();
  }

  private mockClient(): void {
    this.client = new Client({ intents: [] });
    mockClientUser(this.client);
    this.client.login = ((token: string) => {
      client.token = token
      return Promise.resolve(token) 
    });
  }

  private mockGuild(): void {
    this.guild = mockGuild(this.client);
  }

  private mockChannel(): void {
    this.channel = mockTextChannel(this.client, this.guild);
  }

  private mockUser(): void {
    this.user = mockUser(this.client);
  }
}

export const mock = new Mock();
export const client = mock.getClient(true);
await client.login(process.env.TOKEN)



client.on("interactionCreate", async (interaction) => {
  await interaction.guild?.roles.create()
  if (!interaction.isChatInputCommand()) return;
  const command = Commands.get(interaction.commandName);
  if (!command) {
    await interaction.reply("There was a internal server error");
    console.error(`Command for ${interaction.commandName} was not found`);
  }
  await command!(interaction);
});

