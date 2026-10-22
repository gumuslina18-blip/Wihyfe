export interface BotGeneralConfig {
  prefix: string;
  activityType: 'PLAYING' | 'LISTENING' | 'WATCHING' | 'COMPETING';
  activityText: string;
  language: 'tr' | 'en';
}

export interface BotModerationConfig {
  autoRoleEnabled: boolean;
  autoRoleId: string;
  antiSpam: boolean;
  antiCurse: boolean;
  antiLink: boolean;
  modLogChannelId: string;
  muteRoleId: string;
}

export interface BotTicketConfig {
  enabled: boolean;
  supportRoleId: string;
  ticketCategoryId: string;
  ticketLogChannelId: string;
  ticketWelcomeMessage: string;
}

export interface BotWelcomeConfig {
  enabled: boolean;
  welcomeChannelId: string;
  welcomeMessage: string;
  farewellChannelId: string;
  farewellMessage: string;
  sendAsEmbed: boolean;
}

export interface BotCustomEmbedConfig {
  embedColor: string;
  footerText: string;
}

export interface BotConfig {
  general: BotGeneralConfig;
  moderation: BotModerationConfig;
  ticket: BotTicketConfig;
  welcome: BotWelcomeConfig;
  embed: BotCustomEmbedConfig;
}

export interface CustomerBot {
  id: string;
  name: string;
  packageId: string;
  packageName: string;
  serverId: string;
  serverName: string;
  serverIcon?: string | null;
  status: 'online' | 'restarting' | 'offline';
  pingMs: number;
  uptime: string;
  avatarUrl: string;
  inviteUrl: string;
  config: BotConfig;
}

export interface CustomerLicense {
  id: string;
  packageName: string;
  serverId: string;
  serverName: string;
  periodLabel: string;
  price: string;
  startDate: string;
  expireDate: string;
  daysRemaining: number;
  status: 'active' | 'expiring_soon' | 'expired';
}

export const INITIAL_CUSTOMER_BOTS: CustomerBot[] = [];
export const INITIAL_CUSTOMER_LICENSES: CustomerLicense[] = [];

