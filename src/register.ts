import { REST, Routes } from "discord.js";
import { config } from "dotenv";
config();

const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
  {
    name: "color",
    description: "add or remove colors for a user",
    options: [
      {
        name: "clear",
        description: "Clear all the colors in the server",
        type: 1,
      },
      {
        name: "set",
        description: "Sets the color of the user's usernames",
        type: 1,
        options: [
          {
            name: "color",
            description: "The color code in hex, eg #FFFFFF",
            type: 3,
            required: true,
          },
        ],
      },
    ],
  },
];


const rest = new REST({ version: "10" }).setToken(process.env.TOKEN ?? "");

try {
  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands("703259121155309619"), { body: commands });

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.error(error);
}
