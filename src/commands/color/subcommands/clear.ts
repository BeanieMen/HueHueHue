import { Interaction } from "discord.js";

export async function clear(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;
  const guild = interaction.guild;

  const colorRoles = guild?.roles.cache.filter(
    (role) =>
      role.name === "fav color" ||
      role.name === "<color>" ||
      role.name === "</color>",
  );
  colorRoles?.forEach(async (role) => {
    await role.delete();
  });
  await interaction.reply("Successfully cleared all color roles");
}
