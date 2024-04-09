import { Interaction } from "discord.js";
import { colorRole, config } from "../../../constants";

export async function clear(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;
  const guild = interaction.guild;

  const colorRoles = guild?.roles.cache.filter(
    (role) => role.name === colorRole,
  );
  colorRoles?.forEach(async (role) => {
    await role.delete();
  });
  console.log("Cleared all color roles")
  await interaction.reply("Successfully cleared all color roles");
  await config.setConfig({colorRoleIds: []})
}
