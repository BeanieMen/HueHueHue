export const commands = [
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
