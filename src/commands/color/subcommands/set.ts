import { GuildMember, Interaction } from "discord.js";
import { colorRole } from "../../../constants";
import { integrityFix } from "../../../helpers";
import { config } from "../../../constants";

export async function set(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;
  const guild = interaction.guild;
  if (!guild) return;

  const colorCode = interaction.options.getString("color");
  if (!colorCode || !/^#[0-9A-Fa-f]{6}$/.test(colorCode)) {
    await interaction.reply("Not a valid hex code.");
    return;
  }

  const user = interaction.member as GuildMember;
  const roleColor = Number(`0x${colorCode.substring(1)}`);
  let role = user.roles.cache.find((role) => role.name === colorRole);

  if (!role) {
    try {
      await interaction.reply(colorCode);
      role = await interaction.guild.roles.create({
        name: colorRole,
        color: roleColor,
        reason: `Creating a color role for ${user.displayName}`,
      });
      await config.setConfig({
        colorRoleIds: [...config.data.colorRoleIds, role.id],
      });
    } catch (error) {
      console.error("Error creating role:", error);
      await interaction.channel!.send("There was an error creating the role.");
    }
  } else if (role.color !== roleColor) {
    try {
      await interaction.reply(colorCode);
      await role.edit({
        color: roleColor,
      });
      console.log(`Edited role color for ${user.displayName}`);
      return;
    } catch {
      console.log("Missing perms to edit users role color");
      await interaction.channel!.send(
        "Missing permissions to edit users role color"
      );
    }
  } else {
    await interaction.reply("Color already added to user");
    return;
  }

  if (user && role) {
    try {
      await user.roles.add(role);
      console.log(`Role "${role.name}" has been added to ${user.displayName}`);
    } catch (error) {
      console.error("Error adding role to member:", error);
      await interaction.channel!.send(
        "There was an error adding the role to the member."
      );
      return;
    }
  }
  try {
  const  {end} = await integrityFix(interaction.guild.roles);
  await role!.setPosition(end.position)
  } catch {
    console.log("Missing permissions");
    await interaction.channel!.send(
      "Missing permissions to set position of role"
    );
    return;
  }
}
