import { Interaction } from "discord.js";

export async function clear(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;
  const guild = interaction.guild
  if (!guild) return
  
  const colorRoles = guild.roles.cache.filter(role => /^#[0-9A-Fa-f]{6}$/.test(role.name));
  colorRoles.forEach(async (role) => {await role.delete()})
  await interaction.reply("Successfully cleared all color roles");
}
