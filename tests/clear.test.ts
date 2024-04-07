import { Interaction } from "discord.js";
import { clear } from "../src/commands/color/subcommands/clear.js";
import { test, expect } from "vitest";
import { MockInteraction } from "./mock.js";
import { colorRole, markerStart, markerEnd } from "../src/constants.js";

test("checks if roles get cleared", async () => {
  const interaction = new MockInteraction({}, true);
  interaction.guild.roles.create({ name: markerStart });
  interaction.guild.roles.create({ name: colorRole });
  interaction.guild.roles.create({ name: colorRole });
  interaction.guild.roles.create({ name: markerEnd });

  await clear(interaction as unknown as Interaction);
  expect(interaction.guild.roles.cache.size).toBe(2);
});

test("checks if non color roles get cleared", async () => {
  const interaction = new MockInteraction({}, true);
  interaction.guild.roles.create({ name: markerStart });
  interaction.guild.roles.create({ name: colorRole });
  interaction.guild.roles.create({ name: colorRole });
  interaction.guild.roles.create({ name: markerEnd });
  interaction.guild.roles.create({ name: "Owo bot" });
  await clear(interaction as unknown as Interaction);
  expect(interaction.guild.roles.cache.size).toBe(3);
});

test("checks if non color roles get cleared", async () => {
  const interaction = new MockInteraction({}, false);
  await clear(interaction as unknown as Interaction);
  expect(interaction).toBe(interaction);
});
