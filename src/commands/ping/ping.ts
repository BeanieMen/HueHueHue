import { Interaction } from "discord.js";

export default async function ping(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;
  await interaction.reply("PONG!");
}
