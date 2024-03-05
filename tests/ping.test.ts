import { Interaction } from "discord.js";
import { ping } from "../src/commands/ping/ping";
import { MockInteraction } from "./interaction";

jest.mock("discord.js");

describe("ping function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should reply "PONG!" for a chat input command', async () => {
    const interaction = new MockInteraction({}, true);

    await ping(interaction as unknown as Interaction);

    expect(interaction.isChatInputCommand()).toBe(true);
    expect(interaction.replies).toBe("PONG!");
    expect(interaction.replied).toBe(true);
    
  });
  it('should reply with nothing', async () => {
    const interaction = new MockInteraction({});

    await ping(interaction as unknown as Interaction);

    expect(interaction.isChatInputCommand()).toBe(false);
    expect(interaction.replies).toBe("");
    expect(interaction.replied).toBe(false);
    
  });
});
