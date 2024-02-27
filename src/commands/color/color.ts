import { Interaction } from "discord.js";
import { set } from "./subcommands/color set.js";
import { clear } from "./subcommands/color clear.js";

export async function color(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;
  const subCommand  = interaction.options.getSubcommand()
  switch (subCommand) {
    case 'set':
      await set(interaction);
      break;
    case 'clear':
      await clear(interaction);
      break;
  }

}
