import { Interaction } from "discord.js";
import { clear } from "../src/commands/color/subcommands/clear.js";
import { test, expect } from "vitest";
import { MockInteraction } from "./mock.js";

test("checks if roles get cleared", async () => {
  const interaction = new MockInteraction({}, true);
  interaction.guild.roles.create({ name: "<color>" });
  interaction.guild.roles.create({ name: "fav color" });
  interaction.guild.roles.create({ name: "fav color" });
  interaction.guild.roles.create({ name: "</color>" });

  await clear(interaction as unknown as Interaction);
  expect(interaction.guild.roles.cache.size).toBe(0);
});

test("checks if non color roles get cleared", async () => {
  const interaction = new MockInteraction({}, true);
  interaction.guild.roles.create({ name: "<color>" });
  interaction.guild.roles.create({ name: "fav color" });
  interaction.guild.roles.create({ name: "fav color" });
  interaction.guild.roles.create({ name: "</color>" });
  interaction.guild.roles.create({ name: "Owo bot" });

  await clear(interaction as unknown as Interaction);
  expect(interaction.guild.roles.cache.size).toBe(1);
});

test("checks if non color roles get cleared", async () => {
  const interaction = new MockInteraction({}, false);
  await clear(interaction as unknown as Interaction);
  expect(interaction).toBe(interaction)
});
