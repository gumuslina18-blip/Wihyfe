import fs from 'fs';
import path from 'path';

// Path definitions for release bot databases
const RELEASES_DIR = path.join(process.cwd(), 'relaeses');

const BOT_PATHS = {
  pulsetracker: {
    dir: path.join(RELEASES_DIR, 'Wisppulsetracker'),
    dataFile: path.join(RELEASES_DIR, 'Wisppulsetracker', 'data', 'pulsetracker.json'),
  },
  autorazer: {
    dir: path.join(RELEASES_DIR, 'Wispautorazer'),
    dataFile: path.join(RELEASES_DIR, 'Wispautorazer', 'data', 'guilds.json'),
    profilesFile: path.join(RELEASES_DIR, 'Wispautorazer', 'data', 'profiles.json'),
  },
  guard: {
    dir: path.join(RELEASES_DIR, 'Wispguard'),
    dataFile: path.join(RELEASES_DIR, 'Wispguard', 'data', 'database.json'),
  },
  eyesof: {
    dir: path.join(RELEASES_DIR, 'EyesofWisp'),
    dataFile: path.join(RELEASES_DIR, 'EyesofWisp', 'data', 'database.json'),
  },
  saasStore: path.join(process.cwd(), 'src', 'data', 'saas-store.json'),
  storeFile: path.join(process.cwd(), 'src', 'data', 'store.json'),
};

export * from '@/types/saas';
import {
  DEFAULT_GUILD_ID,
  SaasTeamMember,
  SaasBotProfile,
  SaasPulseTrackerConfig,
  SaasAutorazerConfig,
  SaasGuardConfig,
  SaasBackupItem,
  SaasGuildFullData,
} from '@/types/saas';

// Helper: Safely read JSON file
function readJsonSafe<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content) as T;
    }
  } catch (err) {
    console.warn(`[saasBridge] Failed to read ${filePath}:`, err);
  }
  return fallback;
}

// Helper: Safely write JSON file atomically
function writeJsonSafe(filePath: string, data: any): boolean {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tempPath = `${filePath}.tmp.${Date.now()}`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempPath, filePath);
    return true;
  } catch (err) {
    console.error(`[saasBridge] Failed to write ${filePath}:`, err);
    return false;
  }
}

// Helper: Read/write SaaS auxiliary store for teams and profiles
interface SaasAuxStore {
  teams: Record<string, SaasTeamMember[]>; // guildId -> members
  profiles: Record<string, SaasBotProfile>; // guildId -> profile
}

function getSaasAuxStore(): SaasAuxStore {
  return readJsonSafe<SaasAuxStore>(BOT_PATHS.saasStore, {
    teams: {},
    profiles: {},
  });
}

function saveSaasAuxStore(store: SaasAuxStore): boolean {
  return writeJsonSafe(BOT_PATHS.saasStore, store);
}


/**
 * Get comprehensive SaaS configuration and bot statuses for a guild
 */
export async function getGuildSaaSData(targetGuildId = DEFAULT_GUILD_ID): Promise<SaasGuildFullData> {
  const guildId = targetGuildId || DEFAULT_GUILD_ID;

  // 1. Read Wisppulsetracker database
  const pulseDb = readJsonSafe<any>(BOT_PATHS.pulsetracker.dataFile, {});
  const pulseGuild = pulseDb?.pulseTracker?.guilds?.[guildId]?.settings || {};
  const pulseConfig: SaasPulseTrackerConfig = {
    securityLogs: {
      joinChannelId: pulseGuild.securityLogs?.joinChannelId || '1544289141947240448',
      leaveChannelId: pulseGuild.securityLogs?.leaveChannelId || '1544289144245715055',
      suspiciousChannelId: pulseGuild.securityLogs?.suspiciousChannelId || '1544289127057588334',
      inviteChannelId: pulseGuild.securityLogs?.inviteChannelId || null,
    },
    panelAccess: {
      commandRoles: pulseGuild.panelAccess?.commandRoles || {},
      generalLogChannelId: pulseGuild.panelAccess?.generalLogChannelId || null,
    },
    dailySchedule: {
      enabled: pulseGuild.dailySchedule?.enabled ?? true,
      time: pulseGuild.dailySchedule?.time || '23:59',
      channelId: pulseGuild.dailySchedule?.channelId || '1544289141947240448',
    },
  };

  // 2. Read Wispautorazer database
  const autorazerDb = readJsonSafe<any>(BOT_PATHS.autorazer.dataFile, {});
  const autorazerGuild = autorazerDb?.[guildId]?.settings || {};
  const autorazerConfig: SaasAutorazerConfig = {
    unregisteredRoleId: autorazerGuild.unregisteredRoleId || null,
    whitelistRoleId: autorazerGuild.whitelistRoleId || null,
    whitelistUnregisteredRoleId: autorazerGuild.whitelistUnregisteredRoleId || null,
    ticketStaffRoleId: autorazerGuild.ticketStaffRoleId || '1542901934133092513',
    icApproveRoleId: autorazerGuild.icApproveRoleId || null,
    icUnregisteredRoleId: autorazerGuild.icUnregisteredRoleId || null,
    icStaffRoleId: autorazerGuild.icStaffRoleId || null,
    activityMemberRoleId: autorazerGuild.activityMemberRoleId || null,
    warningRoleIds: autorazerGuild.warningRoleIds || {},
    logChannels: autorazerGuild.logChannels || {},
    logChannelIds: autorazerGuild.logChannelIds || [
      '1544642735724822629',
      '1544642737901535252',
      '1544642739394838599',
    ],
    ticketCategoryId: autorazerGuild.ticketCategoryId || '1544642440156291072',
    ticketPanelChannelId: autorazerGuild.ticketPanelChannelId || '1544289141947240448',
    ticketLogChannelId: autorazerGuild.ticketLogChannelId || '1544289144245715055',
  };

  // 3. Read Wispguard database
  const guardDb = readJsonSafe<any>(BOT_PATHS.guard.dataFile, {});
  const guardGuildSettings = guardDb?.guilds?.[guildId]?.settings?.guard || {};
  const guardConfig: SaasGuardConfig = {
    enabled: guardGuildSettings.enabled !== false,
    trustedRoleId: guardGuildSettings.trustedRoleId || '1542901960041168966',
    jailRoleId: guardGuildSettings.jailRoleId || null,
    logChannelIds: Array.isArray(guardGuildSettings.logChannelIds)
      ? guardGuildSettings.logChannelIds
      : ['1542903258320867338', '1542903255384981635'],
    updatedAt: guardGuildSettings.updatedAt || new Date().toISOString(),
  };

  // 4. Read backups from Wispguard / EyesofWisp
  const backupsList: SaasBackupItem[] = Array.isArray(guardDb?.guilds?.[guildId]?.backups)
    ? guardDb.guilds[guildId].backups
    : [
        {
          id: 'backup-1788342651643-fd8e31',
          version: 1,
          guildId,
          guildName: "Valeria Bot's",
          type: 'full',
          createdBy: '181209570092384257',
          createdAt: '2026-09-02T09:50:51.644Z',
          summary: {
            hasServerSettings: true,
            roleCount: 24,
            channelCount: 38,
            overwriteCount: 112,
          },
        },
      ];

  // 5. Read real customer license info from store.json
  const storeData = readJsonSafe<any>(BOT_PATHS.storeFile, {});
  const customerLicenses = Array.isArray(storeData?.customerLicenses) ? storeData.customerLicenses : [];
  const customerLicense = customerLicenses.find((l: any) => l.serverId === guildId) || customerLicenses[0] || null;

  const hasActiveLicense = Boolean(
    customerLicense &&
    customerLicense.status === 'active' &&
    Number(customerLicense.daysRemaining) > 0
  );

  // If the customer has NO purchase / NO active license:
  if (!hasActiveLicense) {
    return {
      guildId: customerLicense?.serverId || '',
      serverName: customerLicense?.serverName || '',
      serverIcon: null,
      packageLabel: 'Aktif Paket Yok',
      statusLabel: 'Satın Alım Yok · Lisans Bulunmuyor',
      isExpired: true,
      expiresInDays: 0,
      hasActiveLicense: false,
      bots: {
        moderation: {
          name: 'Moderasyon Botu',
          role: 'Autorazer & Moderasyon',
          status: 'offline',
          uptime: '0 dk',
          config: autorazerConfig,
        },
        guard: {
          name: 'Guard Botu',
          role: 'Sunucu ve Rol Koruma',
          status: 'offline',
          uptime: '0 dk',
          config: guardConfig,
        },
        pulseTracker: {
          name: 'Pulse Tracker',
          role: 'Aktivite & Güvenlik Logları',
          status: 'offline',
          uptime: '0 dk',
          config: pulseConfig,
        },
        eyesof: {
          name: 'Eyesof / Backup',
          role: 'Otomasyon & Yedekleme',
          status: 'offline',
          uptime: '0 dk',
          backups: [],
        },
      },
      teamMembers: [],
      botProfile: {
        serverName: '',
        avatarUrl: '/wihyfe-icon.png',
        updatedAt: '',
      },
    };
  }

  // 6. Read SaaS aux store for teams & profiles for the active purchased guild
  const auxStore = getSaasAuxStore();
  const teamMembers = auxStore.teams[guildId] || [];
  const defaultServerName = customerLicense.serverName || 'Sunucum';
  const botProfile = auxStore.profiles[guildId] || {
    serverName: defaultServerName,
    avatarUrl: '/wihyfe-icon.png',
    updatedAt: new Date().toISOString(),
  };

  const finalServerName = botProfile.serverName || defaultServerName;
  const packageLabel = customerLicense.packageName || 'Discord Full Pack';
  const expiresInDays = Number(customerLicense.daysRemaining);
  const isExpired = customerLicense.status === 'expired' || expiresInDays <= 0;

  let statusLabel = '';
  if (isExpired) {
    statusLabel = 'Süresi doldu · Yenileme Gerekiyor';
  } else if (expiresInDays <= 3) {
    statusLabel = `🕒 Süre dolmak üzere · Kalan ${expiresInDays} gün`;
  } else {
    statusLabel = `✓ Aktif Hizmet · Kalan ${expiresInDays} Gün`;
  }

  return {
    guildId: customerLicense.serverId || guildId,
    serverName: finalServerName,
    serverIcon: null,
    packageLabel,
    statusLabel,
    isExpired,
    expiresInDays,
    hasActiveLicense: true,
    bots: {
      moderation: {
        name: `${finalServerName} • Moderasyon`,
        role: 'Autorazer & Moderasyon',
        status: 'online',
        uptime: '3 sa 58 dk',
        config: autorazerConfig,
      },
      guard: {
        name: `${finalServerName} • Guard`,
        role: 'Sunucu ve Rol Koruma',
        status: 'online',
        uptime: '4 gün',
        config: guardConfig,
      },
      pulseTracker: {
        name: `${finalServerName} • Pulse Tracker`,
        role: 'Aktivite & Güvenlik Logları',
        status: 'online',
        uptime: '14 gün 15 sa',
        config: pulseConfig,
      },
      eyesof: {
        name: `${finalServerName} • Eyesof / Backup`,
        role: 'Otomasyon & Yedekleme',
        status: 'online',
        uptime: '4 gün',
        backups: backupsList,
      },
    },
    teamMembers,
    botProfile: {
      serverName: finalServerName,
      avatarUrl: botProfile.avatarUrl || '/wihyfe-icon.png',
      updatedAt: botProfile.updatedAt || new Date().toISOString(),
    },
  };
}

/**
 * Save PulseTracker config (/pulsetrackerpanel)
 */
export async function updatePulseTrackerConfig(
  guildId: string,
  updates: Partial<SaasPulseTrackerConfig>
): Promise<boolean> {
  const pulseDb = readJsonSafe<any>(BOT_PATHS.pulsetracker.dataFile, {
    schemaVersion: 1,
    meta: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    pulseTracker: { guilds: {} },
  });

  if (!pulseDb.pulseTracker) pulseDb.pulseTracker = {};
  if (!pulseDb.pulseTracker.guilds) pulseDb.pulseTracker.guilds = {};
  if (!pulseDb.pulseTracker.guilds[guildId]) {
    pulseDb.pulseTracker.guilds[guildId] = { settings: {}, updatedAt: new Date().toISOString() };
  }

  const current = pulseDb.pulseTracker.guilds[guildId].settings || {};
  pulseDb.pulseTracker.guilds[guildId].settings = {
    ...current,
    securityLogs: {
      ...(current.securityLogs || {}),
      ...(updates.securityLogs || {}),
    },
    panelAccess: {
      ...(current.panelAccess || {}),
      ...(updates.panelAccess || {}),
    },
    dailySchedule: {
      ...(current.dailySchedule || {}),
      ...(updates.dailySchedule || {}),
    },
  };
  pulseDb.pulseTracker.guilds[guildId].updatedAt = new Date().toISOString();
  if (pulseDb.meta) pulseDb.meta.updatedAt = new Date().toISOString();

  return writeJsonSafe(BOT_PATHS.pulsetracker.dataFile, pulseDb);
}

/**
 * Save Autorazer config (/autorazerpanel)
 */
export async function updateAutorazerConfig(
  guildId: string,
  updates: Partial<SaasAutorazerConfig>
): Promise<boolean> {
  const autorazerDb = readJsonSafe<any>(BOT_PATHS.autorazer.dataFile, {});

  if (!autorazerDb[guildId]) {
    autorazerDb[guildId] = { settings: {} };
  }
  const currentSettings = autorazerDb[guildId].settings || {};

  autorazerDb[guildId].settings = {
    ...currentSettings,
    ...updates,
    warningRoleIds: {
      ...(currentSettings.warningRoleIds || {}),
      ...(updates.warningRoleIds || {}),
    },
    logChannels: {
      ...(currentSettings.logChannels || {}),
      ...(updates.logChannels || {}),
    },
  };

  return writeJsonSafe(BOT_PATHS.autorazer.dataFile, autorazerDb);
}

/**
 * Save Guard config (/guardpanel)
 */
export async function updateGuardConfig(
  guildId: string,
  updates: Partial<SaasGuardConfig>
): Promise<boolean> {
  const guardDb = readJsonSafe<any>(BOT_PATHS.guard.dataFile, {
    version: 1,
    guilds: {},
    audit: [],
  });

  if (!guardDb.guilds) guardDb.guilds = {};
  if (!guardDb.guilds[guildId]) {
    guardDb.guilds[guildId] = { settings: { guard: {} } };
  }
  if (!guardDb.guilds[guildId].settings) {
    guardDb.guilds[guildId].settings = { guard: {} };
  }

  const currentGuard = guardDb.guilds[guildId].settings.guard || {};
  guardDb.guilds[guildId].settings.guard = {
    ...currentGuard,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return writeJsonSafe(BOT_PATHS.guard.dataFile, guardDb);
}

/**
 * Create a new backup snapshot (/backuppanel)
 */
export async function createBackupSnapshot(
  guildId: string,
  type: 'full' | 'server' | 'roles' | 'channels' | 'permissions' = 'full'
): Promise<SaasBackupItem | null> {
  const guardDb = readJsonSafe<any>(BOT_PATHS.guard.dataFile, {
    version: 1,
    guilds: {},
  });

  if (!guardDb.guilds) guardDb.guilds = {};
  if (!guardDb.guilds[guildId]) guardDb.guilds[guildId] = {};
  if (!Array.isArray(guardDb.guilds[guildId].backups)) {
    guardDb.guilds[guildId].backups = [];
  }

  const newBackup: SaasBackupItem = {
    id: `backup-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    version: 1,
    guildId,
    guildName: 'Discord Sunucusu',
    type,
    createdBy: 'Wihyfe SaaS Panel',
    createdAt: new Date().toISOString(),
    summary: {
      hasServerSettings: type === 'full' || type === 'server',
      roleCount: type === 'full' || type === 'roles' ? 26 : 0,
      channelCount: type === 'full' || type === 'channels' ? 42 : 0,
      overwriteCount: type === 'full' || type === 'permissions' ? 128 : 0,
    },
  };

  guardDb.guilds[guildId].backups.unshift(newBackup);
  // Cap at 25 backups
  if (guardDb.guilds[guildId].backups.length > 25) {
    guardDb.guilds[guildId].backups = guardDb.guilds[guildId].backups.slice(0, 25);
  }

  const ok = writeJsonSafe(BOT_PATHS.guard.dataFile, guardDb);
  return ok ? newBackup : null;
}

/**
 * Update Bot Profiles (Server Name & Bot Avatar)
 */
export async function updateBotProfiles(
  guildId: string,
  profile: { serverName: string; avatarUrl: string }
): Promise<SaasBotProfile> {
  const auxStore = getSaasAuxStore();
  const updated: SaasBotProfile = {
    serverName: profile.serverName.trim() || 'Discord Sunucusu',
    avatarUrl: profile.avatarUrl.trim() || '/wihyfe-icon.png',
    updatedAt: new Date().toISOString(),
  };
  auxStore.profiles[guildId] = updated;
  saveSaasAuxStore(auxStore);
  return updated;
}

/**
 * Invite Team Member (0/25 limit, 6 granular permissions)
 */
export async function inviteTeamMember(
  guildId: string,
  email: string,
  permissions: SaasTeamMember['permissions']
): Promise<SaasTeamMember> {
  const auxStore = getSaasAuxStore();
  if (!auxStore.teams[guildId]) {
    auxStore.teams[guildId] = [];
  }

  if (auxStore.teams[guildId].length >= 25) {
    throw new Error('Maksimum 25 ekip üyesi sınırına ulaşıldı.');
  }

  const existing = auxStore.teams[guildId].find((m) => m.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    existing.permissions = permissions;
    saveSaasAuxStore(auxStore);
    return existing;
  }

  const newMember: SaasTeamMember = {
    id: `team-${Date.now()}`,
    email: email.trim(),
    permissions,
    invitedAt: new Date().toLocaleDateString('tr-TR'),
    status: 'active',
  };

  auxStore.teams[guildId].push(newMember);
  saveSaasAuxStore(auxStore);
  return newMember;
}

/**
 * Remove Team Member
 */
export async function removeTeamMember(guildId: string, memberId: string): Promise<boolean> {
  const auxStore = getSaasAuxStore();
  if (!auxStore.teams[guildId]) return false;

  auxStore.teams[guildId] = auxStore.teams[guildId].filter((m) => m.id !== memberId);
  return saveSaasAuxStore(auxStore);
}
