import { Interaction } from "discord.js";
import { statusCheck } from "../../../helpers";

export async function status(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;
  const guild = interaction.guild;
  if (!guild) return;
  const result = await statusCheck(interaction.guild.roles);
  await interaction.reply(result);
}
