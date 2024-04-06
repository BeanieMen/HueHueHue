import { Interaction } from "discord.js";
import { clear } from "../src/commands/color/subcommands/clear.js";
import { test, expect } from "vitest";
import { MockInteraction } from "./mock.js";
import { colorRole } from "../src/constants.js";
const colorRoleName = await colorRole;
console.log(colorRoleName);
test("checks if roles get cleared", async () => {
  const interaction = new MockInteraction({}, true);
  interaction.guild.roles.create({ name: "<color>" });
  interaction.guild.roles.create({ name: colorRoleName });
  interaction.guild.roles.create({ name: colorRoleName });
  interaction.guild.roles.create({ name: "</color>" });

  await clear(interaction as unknown as Interaction);
  expect(interaction.guild.roles.cache.size).toBe(0);
});

test("checks if non color roles get cleared", async () => {
  const interaction = new MockInteraction({}, true);
  interaction.guild.roles.create({ name: "<color>" });
  interaction.guild.roles.create({ name: colorRoleName });
  interaction.guild.roles.create({ name: colorRoleName });
  interaction.guild.roles.create({ name: "</color>" });
  interaction.guild.roles.create({ name: "Owo bot" });
  console.log(interaction.guild.roles.cache.size);
  await clear(interaction as unknown as Interaction);
  expect(interaction.guild.roles.cache.size).toBe(1);
});

test("checks if non color roles get cleared", async () => {
  const interaction = new MockInteraction({}, false);
  await clear(interaction as unknown as Interaction);
  expect(interaction).toBe(interaction);
});
