import { set } from "../src/commands/color/subcommands/set.js";
import { test, expect } from "vitest";
import { Interaction } from "discord.js";
import { MockInteraction, MockMember } from "./mock.js";
import { colorRole, markerEnd, markerStart } from "../src/constants.js";

test("sets the role name and color for a valid hex code", async () => {
  const interaction = new MockInteraction({ color: "#ff0000" }, true);
  await set(interaction as unknown as Interaction);
  const createdRole = interaction.guild.roles.cache.find(
    (role) => role.name === colorRole
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
    (role) => role.name === colorRole
  );
  expect(interaction.replies).toBe("#696969");
  expect(role?.name).toBe(colorRole);
  expect(role?.color).toEqual(0x696969);
});

test("checks the edition of roles", async () => {
  const member = new MockMember("beanie");
  let interaction = new MockInteraction(
    { color: "#696969" },
    true,
    undefined,
    member
  );

  await set(interaction as unknown as Interaction);
  console.log(interaction.guild.roles.cache)

  interaction = new MockInteraction(
    { color: "#121212" },
    true,
    interaction.guild,
    member
  );
  await set(interaction as unknown as Interaction);

  const beaniesColor = interaction.guild.roles.cache.find(
    (role) => role.color === 0x121212
  );
  const start = interaction.guild.roles.cache.find(
    (role) => role.name === markerStart
  );
  const end = interaction.guild.roles.cache.find(
    (role) => role.name === markerEnd
  );

  expect(start?.position).toEqual(2);
  expect(beaniesColor?.position).toEqual(1);
  expect(end?.position).toEqual(0);
});

test("tests when two users want same color", async () => {
  let interaction = new MockInteraction({ color: "#696969" }, true);
  await set(interaction as unknown as Interaction);
  interaction = new MockInteraction(
    { color: "#696969" },
    true,
    interaction.guild,
    new MockMember("ben")
  );
  await set(interaction as unknown as Interaction);

  const roles = interaction.guild.roles.cache.filter(
    (role) => role.name === colorRole
  );
  expect(roles.size).toEqual(2);
});

test("tests when users want some other color while already having one", async () => {
  const interaction = new MockInteraction({ color: "#696969" }, true);
  await set(interaction as unknown as Interaction);
  const roleId = interaction.member.roles.cache.find(
    (role) => role.name === colorRole
  )?.id;

  const interaction2 = new MockInteraction(
    { color: "#111111" },
    true,
    interaction.guild,
    interaction.member
  );
  await set(interaction2 as unknown as Interaction);

  const roles = interaction2.guild.roles.cache.filter(
    (role) => role.name === colorRole
  );
  if (roleId) {
    expect(interaction.guild.roles.cache.get(roleId)?.color).toEqual(0x111111);
  }
  expect(roles.size).toEqual(1);
});
