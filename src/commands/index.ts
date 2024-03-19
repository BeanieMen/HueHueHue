import { promises as fsPromises } from "fs";
import { join } from "path";
import { Collection, Interaction } from "discord.js";
const commandsPath = "./src/commands";
const commands = new Collection<string, (arg0: Interaction) => Promise<void>>();

async function loadCommands() {
  const commandFiles = await fsPromises.readdir(commandsPath);

  for (const commandName of commandFiles) {
    const commandPath = join(commandsPath, commandName);

    if ((await fsPromises.stat(commandPath)).isDirectory()) {
      const commandFile = `./${commandName}/${commandName}.js`;

      try {
        const command = await import(commandFile);
        commands.set(command.default.name, command.default);
      } catch (error) {
        console.error(`Error loading command ${commandFile}:`, error);
      }
    }
  }

  return commands;
}

export default await loadCommands();
