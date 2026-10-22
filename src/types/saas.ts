export const DEFAULT_GUILD_ID = '';

export interface SaasTeamMember {
  id: string;
  email: string;
  permissions: {
    botRestart: boolean;
    configEdit: boolean;
    botSetup: boolean;
    inviteLinks: boolean;
    botProfiles: boolean;
    roleDelegation: boolean;
  };
  invitedAt: string;
  status: 'active' | 'pending';
}

export interface SaasBotProfile {
  serverName: string;
  avatarUrl: string;
  updatedAt: string;
}

export interface SaasPulseTrackerConfig {
  securityLogs: {
    joinChannelId: string | null;
    leaveChannelId: string | null;
    suspiciousChannelId: string | null;
    inviteChannelId?: string | null;
  };
  panelAccess: {
    commandRoles: Record<string, string[]>;
    generalLogChannelId: string | null;
  };
  dailySchedule: {
    enabled: boolean;
    time: string;
    channelId: string | null;
  };
}

export interface SaasAutorazerConfig {
  unregisteredRoleId: string | null;
  whitelistRoleId: string | null;
  whitelistUnregisteredRoleId: string | null;
  ticketStaffRoleId: string | null;
  icApproveRoleId: string | null;
  icUnregisteredRoleId: string | null;
  icStaffRoleId: string | null;
  activityMemberRoleId: string | null;
  warningRoleIds: Record<string, string>;
  logChannels: Record<string, string[]>;
  logChannelIds: string[];
  ticketCategoryId: string | null;
  ticketPanelChannelId: string | null;
  ticketLogChannelId: string | null;
}

export interface SaasGuardConfig {
  enabled: boolean;
  trustedRoleId: string | null;
  jailRoleId: string | null;
  logChannelIds: string[];
  updatedAt?: string;
}

export interface SaasBackupItem {
  id: string;
  version: number;
  guildId: string;
  guildName: string;
  type: 'full' | 'server' | 'roles' | 'channels' | 'permissions';
  createdBy: string;
  createdAt: string;
  summary?: {
    hasServerSettings?: boolean;
    roleCount?: number;
    channelCount?: number;
    overwriteCount?: number;
  };
}

export interface SaasGuildFullData {
  guildId: string;
  serverName: string;
  serverIcon: string | null;
  packageLabel: string;
  statusLabel: string;
  isExpired: boolean;
  expiresInDays: number;
  hasActiveLicense: boolean;
  bots: {
    moderation: {
      name: string;
      role: string;
      status: 'online' | 'offline' | 'warning';
      uptime: string;
      config: SaasAutorazerConfig;
    };
    guard: {
      name: string;
      role: string;
      status: 'online' | 'offline' | 'warning';
      uptime: string;
      config: SaasGuardConfig;
    };
    pulseTracker: {
      name: string;
      role: string;
      status: 'online' | 'offline' | 'warning';
      uptime: string;
      config: SaasPulseTrackerConfig;
    };
    eyesof: {
      name: string;
      role: string;
      status: 'online' | 'offline' | 'warning';
      uptime: string;
      backups: SaasBackupItem[];
    };
  };
  teamMembers: SaasTeamMember[];
  botProfile: SaasBotProfile;
}
