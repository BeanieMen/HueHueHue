import { client, mock } from "./client";
import { test, expect } from "vitest";

test("tests if ping replies with pong", async () => {
  const pingInt = mock.commandInteractionCreate("ping");

  client.emit("interactionCreate", pingInt);
  expect(pingInt.replied).toBeTruthy()
});