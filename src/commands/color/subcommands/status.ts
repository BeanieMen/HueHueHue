import { Interaction } from "discord.js";

export async function status(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;
  const guild = interaction.guild;
  if (!guild) return;

  const start = interaction.guild.roles.cache.find(
    (role) => role.name === "<color>"
  );
  const end = interaction.guild.roles.cache.find(
    (role) => role.name === "</color>"
  );

//   let role = interaction.guild.roles.cache.find(
//     (role) => role.name === "fav color"
//   );
  

  await interaction.reply(`start pos ${start?.position} end pos ${end?.position}`);
}
