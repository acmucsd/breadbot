/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CommandInteraction } from 'discord.js';
import { BotEvent, BotClient } from '../types';

/**
 * The InteractionCreate Event is called whenever someone creates an interaction with a bot,
 * typically whenever a Slash Command is called.
 *
 * Occasionally, this can also be called whenever MessageComponents are created (buttons, etc.)
 * however current functionality of the bot only receives Slash Command creations.
 *
 * This event effectively replaces the usage of Message as an event that handles Commands.
 */
export default class InteractionCreate implements BotEvent {
  private client: BotClient;

  constructor(client: BotClient) {
    this.client = client;
  }

  public async run(args: any): Promise<void> {
    // We want to get out if this is not a Slash Command.
    if (!args.isCommand()) {
      return;
    }

    // Get the Command Interaction. This is the only kind of interaction
    // we'll process for now.
    const interaction = args as CommandInteraction;

    // Once that's done, we want to extract the Command we're running...
    const command = this.client.commands.get(interaction.commandName);

    if (!command) {
      return;
    }

    if (!interaction.member) {
      console.log(`Slash Command ${command} received, but interaction author is null!`);
      return;
    }

    const user = this.client.users.cache.get(interaction.member.user.id);

    if (!user) {
      console.log(`Slash Command ${command} received, but interaction member cannot be found!`);
      return;
    }

    await user.fetch();

    // Log usage of command.
    console.log(`Slash Command '${interaction.commandName}' received from ${user.username} (ID: ${user.id}).`);

    if (!command.canRun(interaction)) {
      return;
    }

    // ...then pass the interaction to the Command to run.
    command.run(interaction);
  }
}