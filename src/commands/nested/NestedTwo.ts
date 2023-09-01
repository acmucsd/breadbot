import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import Command from '../../Command';
import { BotClient } from '../../types';

/**
 * Pings the user.
 *
 * Test Command left from the boilerplate.
 */
export default class NestedTwo extends Command {
  constructor(client: BotClient) {
    const definition = new SlashCommandBuilder()
      .setName('nestedtwo')
      .setDescription('Pings the bot.');

    super(client, {
      name: 'nestedtwo',
      enabled: true,
      description: 'Pings the bot.',
      category: 'Information',
      usage: client.settings.prefix.concat('nestedtwo'),
      requiredPermissions: ['SendMessages'],
    }, definition);
  }

  public async run(interaction: CommandInteraction): Promise<void> {
    await super.respond(interaction, 'Nested Pong 2!');
  }
}
