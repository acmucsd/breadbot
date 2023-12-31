import { GatewayIntentBits } from 'discord.js';
import { BotSettings } from '../types';

export default {
  acmurl: {
    username: '',
    password: '',
  },
  presence: {
    status: 'online',
  },
  clientOptions: {
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildIntegrations,
      GatewayIntentBits.GuildWebhooks,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.DirectMessageReactions,
    ],
  },
  clientID: '',
  token: '',
  prefix: '!',
  paths: {
    commands: 'src/commands',
    events: 'src/events',
  },
  discordGuildID: '',
} as BotSettings;
