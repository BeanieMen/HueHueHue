import { MockInteraction } from "./interaction.js";
import { set } from "../src/commands/color/subcommands/set.js";
import { test, expect } from "vitest";
import { Interaction } from "discord.js";

test("sets the role name and color for a valid hex code", async () => {
  const interaction = new MockInteraction({ color: "#ff0000" }, true);
  await set(interaction as unknown as Interaction);

  const createdRole = interaction.guild.roles.cache.find(
    (role) => role.name === "fav color"
  );

  if (createdRole) {
    expect(createdRole).toBeDefined();
    expect(createdRole.color).toBe(0xff0000);
  } else {
    fail("Role was not created!");
  }

  expect(interaction.replies).toBe("#ff0000");
});

test("handles non-chat input command", async () => {
  const interaction = new MockInteraction({}, false);
  await set(interaction as unknown as Interaction);
  expect(interaction.replies).toBe("");
});

test("handles invalid color code", async () => {
  const interaction = new MockInteraction({ color: "invalid" }, true);
  await set(interaction as unknown as Interaction);
  expect(interaction.replies).toBe("Not a valid hex code.");
});

test("checks assignment of role to user", async () => {
  const interaction = new MockInteraction({ color: "#696969" }, true);
  await set(interaction as unknown as Interaction);
  const role = interaction.member.roles.cache.find(
    (role) => role.name === "fav color"
  );
  expect(interaction.replies).toBe("#696969");
  expect(role?.name).toBe("fav color")
  expect(role?.color).toEqual(0x696969)
});

test("checks the position of the roles", async () => {
  let interaction = new MockInteraction({ color: "#696969" }, true);
  await set(interaction as unknown as Interaction);
  interaction = new MockInteraction({ color: "#121212" }, true, "ben", interaction.guild);
  await set(interaction as unknown as Interaction);
  
  const beaniesColor = interaction.guild.roles.cache.find(
    (role) => role.color === 0x696969
  );
  const bensColor = interaction.guild.roles.cache.find(
    (role) => role.color === 0x121212
  )
  const start = interaction.guild.roles.cache.find(
    (role) => role.name === "<color>"
  );
  const end = interaction.guild.roles.cache.find(
    (role) => role.name === "</color>"
  );

  expect(start?.position).toEqual(3);
  expect(beaniesColor?.position).toEqual(2);
  expect(bensColor?.position).toEqual(1)
  expect(end?.position).toEqual(0);
});

test ("tests when two users want same color", async () => {
  let interaction = new MockInteraction({ color: "#696969" }, true);
  await set(interaction as unknown as Interaction);
  interaction = new MockInteraction({ color: "##696969" }, true, "ben", interaction.guild);
  await set(interaction as unknown as Interaction);

  const roles = interaction.guild.roles.cache.filter((role) => role.name === "fav color")
  expect(roles.size).toEqual(1)
  
});