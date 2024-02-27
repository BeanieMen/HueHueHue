import { GuildMember, Interaction } from "discord.js";

export async function set(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;
  const guild = interaction.guild
  if (!guild) return
  
  const colorCode = interaction.options.getString("color");
  if (!colorCode || !/^#[0-9A-Fa-f]{6}$/.test(colorCode)) {
    await interaction.reply("Not a valid hex code.");
    return;
  }

  let role = interaction.guild.roles.cache.find(role => role.name === colorCode);
  if (!role) {
    try {
      role = await interaction.guild.roles.create({
        name: colorCode.toUpperCase(),
        color: Number(`0x${colorCode.substring(1)}`),
        reason: "Creating a color role for a user."
      });
    } catch (error) {
      console.error("Error creating role:", error);
      await interaction.reply("There was an error creating the role.");
      return;
    }
  }

  const user = interaction.member as GuildMember;
  if (user && role) {
    try {
      await user.roles.add(role);
      console.log(`Role "${role.name}" has been added to ${user.user.tag}`);
    } catch (error) {
      console.error("Error adding role to member:", error);
      await interaction.reply("There was an error adding the role to the member.");
      return;
    }
  }

  await interaction.reply(colorCode);
}
