import { GuildMember, Interaction } from "discord.js";

export async function set(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;
  const guild = interaction.guild;
  if (!guild) return;

  const colorCode = interaction.options.getString("color");
  if (!colorCode || !/^#[0-9A-Fa-f]{6}$/.test(colorCode)) {
    await interaction.reply("Not a valid hex code.");
    return;
  }
  const roleColor = Number(`0x${colorCode.substring(1)}`);

  let start = interaction.guild.roles.cache.find(
    (role) => role.name === "<color>"
  );
  let end = interaction.guild.roles.cache.find(
    (role) => role.name === "</color>"
  );
  if (!start) {
    try {
      start = await interaction.guild.roles.create({
        name: "<color>",
        reason: `Creating markers`,
      });
    } catch (error) {
      console.error("Error creating markers:", error);
      return;
    }
  }
  if (!end) {
    try {
      end = await interaction.guild.roles.create({
        name: "</color>",
        reason: `Creating markers`,
      });
    } catch (error) {
      console.error("Error creating markers:", error);
      return;
    }
  }
  await end.setPosition(start.position - 1);

  let role = interaction.guild.roles.cache.find(
    (role) => role.name === "fav color"
  );
  const user = interaction.member as GuildMember;

  if (!role) {
    try {
      role = await interaction.guild.roles.create({
        name: "fav color",
        color: roleColor,
        reason: `Creating a color role for ${user.displayName}`,
      });
    } catch (error) {
      console.error("Error creating role:", error);
      await interaction.reply("There was an error creating the role.");
      return;
    }
  } else if (role.color !== roleColor) {
    role.edit({
      color: roleColor,
    });
    console.log(`Edited role color for ${user.displayName}`);
  }
  role.setPosition(start.position - 1);

  if (user && role) {
    try {
      await user.roles.add(role);
      console.log(`Role "${role.name}" has been added to ${user.user.tag}`);
    } catch (error) {
      console.error("Error adding role to member:", error);
      await interaction.reply(
        "There was an error adding the role to the member."
      );
      return;
    }
  }

  await interaction.reply(colorCode);
}
