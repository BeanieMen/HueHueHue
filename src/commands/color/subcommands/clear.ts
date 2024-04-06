import { Interaction } from "discord.js";
import { colorRole } from "../../../constants";
const colorRoleName = await colorRole;

export async function clear(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;
  const guild = interaction.guild;

  const colorRoles = guild?.roles.cache.filter(
    (role) =>
      role.name === colorRoleName ||
      role.name === "<color>" ||
      role.name === "</color>"
  );
  console.log(colorRoles);
  colorRoles?.forEach(async (role) => {
    await role.delete();
  });

  await interaction.reply("Successfully cleared all color roles");
}
