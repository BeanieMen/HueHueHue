import { client, mock } from "./client";
import { test, expect } from "vitest";

test("tests if ping replies with pong", async () => {
  const colorInt = mock.commandInteractionCreate("color");
	colorInt.options.getSubcommand =  () => "set"
	colorInt.options.getString = () => "#111111"
	client.emit("interactionCreate", colorInt);
  expect(colorInt.replied).toBeTruthy()
});