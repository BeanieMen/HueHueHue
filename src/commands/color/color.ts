import { Interaction } from "discord.js";
import { set } from "./subcommands/set.js";
import { clear } from "./subcommands/clear.js";

export default async function color(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;
  const subCommand = interaction.options.getSubcommand();
  switch (subCommand) {
    case "set":
      await set(interaction);
      break;
    case "clear":
      await clear(interaction);
      break;
  }
}
