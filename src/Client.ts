import { Collection, Client as DiscordClient, GatewayIntentBits } from 'discord.js';
import { Service } from 'typedi';
import Logger from './utils/Logger';
import { BotSettings, BotClient, BotInitializationError } from './types';
import Command from './Command';
import ActionManager from './managers/ActionManager';
import configuration from './config/config';

/**
 * The class representing the Discord bot.
 *
 * Our Client class not only holds the client itself, but also implements additional
 * parameters to keep track of bot settings and registered Events and Commands.
 *
 * The procedure when initializing the Client (bot) goes something like this:
 * - Pass in any required ClientOptions for Discord.js, if any.
 * - Take default configuration from "config.ts" and pass through to our Client,
 *   adding environment variables found. If any required environment variables don't exist,
 *   we error out.
 * - Initialize our ActionManager, our method of dynamically importing Events and Commands
 * - Log into Discord API when done initializing everything.
 *
 * ActionManager does the heavy lifting, so read that as well.
 */
@Service()
export default class Client extends DiscordClient implements BotClient {
  /**
   * The settings for the Client.
   *
   * These are a mix of environment variables and default Discord.js client options.
   */
  public settings: BotSettings;

  /**
   * The default constructor for Client.
   *
   * Begins the configuration process. Initialization is done in {@link initialize initialize()}.
   * @param actionManager An ActionManager class to run. Injected by TypeDI.
   */
  constructor(private actionManager: ActionManager) {
    super(
      configuration.clientOptions || {
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildIntegrations,
          GatewayIntentBits.GuildWebhooks,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.DirectMessages,
          GatewayIntentBits.GuildMessageReactions,
          GatewayIntentBits.DirectMessageReactions,
        ],
      }
    );
    this.settings = configuration;
    // We absolutely need some envvars, so if they're not in our .env file, nuke the initialization.
    // We can throw Errors here to nuke the bot, since we don't have any catches higher up.
    if (!process.env.BOT_TOKEN) {
      throw new BotInitializationError('bot token');
    }
    if (!process.env.BOT_PREFIX) {
      throw new BotInitializationError('bot prefix');
    }
    if (!process.env.CLIENT_ID) {
      throw new BotInitializationError('app client ID');
    }
    if (!process.env.DISCORD_GUILD_ID) {
      throw new BotInitializationError('Discord Guild ID');
    }
    if (!process.env.ACMURL_USERNAME) {
      throw new BotInitializationError('ACMURL Username');
    }
    if (!process.env.ACMURL_PASSWORD) {
      throw new BotInitializationError('ACMURL Password');
    }

    this.settings.clientID = process.env.CLIENT_ID;
    this.settings.token = process.env.BOT_TOKEN;
    this.settings.prefix = process.env.BOT_PREFIX;
    this.settings.discordGuildID = process.env.DISCORD_GUILD_ID;
    this.settings.acmurl.username = process.env.ACMURL_USERNAME;
    this.settings.acmurl.password = process.env.ACMURL_PASSWORD;
    this.initialize().then();
  }

  /**
   * Initialize the Client and connect to the Discord API.
   *
   * Registers all Events and Commands and then logs in to the API for being ready.
   * Highly recommend to read ActionManager's code to understand what this does.
   * @private
   */
  private async initialize(): Promise<void> {
    try {
      this.actionManager.initializeCommands(this);
      ActionManager.initializeEvents(this);
      await this.login(configuration.token);
    } catch (e) {
      Logger.error(`Could not initialize bot: ${e}`);
    }
  }

  /**
   * Get a map of [commandName, Command] pairs.
   *
   * Useful to find a registered Command quickly.
   */
  public get commands(): Collection<string, Command> {
    return this.actionManager.commands;
  }
}
