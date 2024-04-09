import { Client, GatewayIntentBits, Collection } from "discord.js";
import dotenv from "dotenv";
import Commands from "./commands";
import { config, colorRole } from "./constants";
import { setTimeout } from "timers/promises";
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildInvites,
  ],
});
const invites = new Collection<string, Collection<string, number | null>>();

client.on("ready", async () => {
  // initlizing db
  await config.setConfig(config.data);
  await setTimeout(1000);

  const configCache = config.data
  for (const guild of client.guilds.cache.values()) {
    for (let i = 0; i < configCache.colorRoleIds.length; i++) {
      const role = await guild.roles.fetch(configCache.colorRoleIds[i]);
      if (!role) continue;
      if (role.name === colorRole) continue;
      console.log("fixing potential untracked state changes")
      await role.edit({name: colorRole})
    }
  }
  if (!client.user) return;
  console.log(`Logged in as ${client.user.tag}!`);

  client.guilds.cache.forEach(async (guild) => {
    const firstInvites = await guild.invites.fetch();
    invites.set(
      guild.id,
      new Collection(firstInvites.map((invite) => [invite.code, invite.uses]))
    );
  });
});

// update invite cache
client.on("inviteDelete", (invite) => {
  console.log("Deleting a invite");
  if (!invite.guild) return;
  invites.get(invite.guild.id)?.delete(invite.code);
});

client.on("inviteCreate", (invite) => {
  console.log("Creating a invite");
  if (!invite.guild) return;

  invites.get(invite.guild.id)?.set(invite.code, invite.uses);
});

client.on("guildMemberAdd", async (member) => {
  console.log("New member");
  const newInvites = await member.guild.invites.fetch();
  const oldInvites = invites.get(member.guild.id);
  if (!oldInvites) return;

  const invite = newInvites.find((i) => i.uses! > oldInvites.get(i.code)!);
  if (!invite) return;
  console.log(
    `${member.user.tag} joined using invite code ${invite.code}. Invite was used ${invite.uses} times since its creation.`
  );
  await invite.delete();
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = Commands.get(interaction.commandName);
  if (!command) {
    await interaction.reply("There was a internal server error");
    console.error(`Command for ${interaction.commandName} was not found`);
  }
  await command!(interaction);
});

await client.login(process.env.TOKEN);
