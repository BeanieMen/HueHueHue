import { Client, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import Commands from "./commands";
config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on("ready", () => {
  if (!client.user) return;
  else {
    console.log(`Logged in as ${client.user.tag}!`);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = Commands.get(interaction.commandName);
  if (!command) {
    await interaction.reply("There was a internal server error");
    console.error(`Command for ${interaction.commandName} was not found`);
  }
  await command!(interaction);
});

await client.login(process.env.TOKEN);
