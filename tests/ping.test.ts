import ping from "../src/commands/ping/ping.js";
import { Interaction } from "discord.js";
import { test, expect } from "vitest";
import { MockInteraction } from "./mock.js";

test('ping function should reply with "PONG!" for a chat input command', async () => {
  const interaction = new MockInteraction({}, true);
  await ping(interaction as unknown as Interaction);

  expect(interaction.replies).toBe("PONG!");
});

test("ping function should not reply for a non-chat input command", async () => {
  const interaction = new MockInteraction({}, false);
  await ping(interaction as unknown as Interaction);

  expect(interaction.replies).toBe("");
});
