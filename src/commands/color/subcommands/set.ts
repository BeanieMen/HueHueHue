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

  const roles = interaction.guild.roles.cache.filter(
    (role) => role.name === "fav color"
  );

  // marker
  let start = interaction.guild.roles.cache.find(
    (role) => role.name === "<color>"
  );
  let end = interaction.guild.roles.cache.find(
    (role) => role.name === "</color>"
  );

  if (!start) {
    const startPos = roles.first()?.position;
    start = await interaction.guild.roles.create({
      name: "<color>",
      color: 0x000000,
      reason: `Creating a color marker`,
    });
    if (startPos) {
      start?.setPosition(startPos + 1);
    }
  }

  if (!end) {
    const endPos = roles.last()?.position;
    end = await interaction.guild.roles.create({
      name: "</color>",
      color: 0x000000,
      reason: `Creating a color marker`,
    });
    if (endPos) {
      end?.setPosition(endPos - 1);
    } else {
      end?.setPosition(start?.position-1)
    }
  }

  const user = interaction.member as GuildMember;


  const roleColor = Number(`0x${colorCode.substring(1)}`);
  let role = user.roles.cache.find((role) => role.name === "fav color");

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
  

  if (user && role) {
    try {
      await user.roles.add(role);
      console.log(`Role "${role.name}" has been added to ${user.displayName}`);
    } catch (error) {
      console.error("Error adding role to member:", error);
      await interaction.reply(
        "There was an error adding the role to the member."
      );
      return;
    }
  }
  role.setPosition(end.position+1)

  await interaction.reply(colorCode);
}
