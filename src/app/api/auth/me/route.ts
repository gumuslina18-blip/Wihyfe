import { NextRequest, NextResponse } from 'next/server';
import { getUserRecord, saveUserRecord, syncUserToCloudStore } from '@/lib/serverStore';
import { verifyUserSession } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get('wisp_session');

  if (!sessionCookie || !sessionCookie.value) {
    return NextResponse.json({ user: null }, { status: 200, headers: NO_CACHE_HEADERS });
  }

  try {
    const sessionUser = verifyUserSession(sessionCookie.value);

    if (!sessionUser || !sessionUser.id) {
      return NextResponse.json({ user: null }, { status: 200, headers: NO_CACHE_HEADERS });
    }

    // Lookup persistent user record from server store
    let persistedUser = getUserRecord(sessionUser.id) || getUserRecord(sessionUser.username);
    const isOwner = sessionUser.id === '181209570092384257' || sessionUser.username?.toLowerCase() === 'lunaalvine';
    const clientIp =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';
    const nowStr =
      new Date().toLocaleDateString('tr-TR') +
      ' ' +
      new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    if (!persistedUser) {
      persistedUser = saveUserRecord({
        id: sessionUser.id,
        username: sessionUser.username,
        email: sessionUser.email || (isOwner ? 'gumuslina18@gmail.com' : ''),
        avatarUrl: sessionUser.avatarUrl || '/wihyfe-icon.png',
        tier: 'Free',
        role: isOwner ? 'Owner' : 'Müşteri',
        balance: 0,
        serversCount: 0,
        activeBotsCount: 0,
        guilds: [],
        joinedDate: nowStr.split(' ')[0],
        lastLogin: 'Çevrimiçi (' + nowStr + ')',
        ipAddress: clientIp + (isOwner ? ' (Yetkili)' : ' (Kayıtlı Kullanıcı)'),
        status: 'Aktif',
      });
    } else {
      persistedUser.lastLogin = 'Çevrimiçi (' + nowStr + ')';
      if (clientIp && (!persistedUser.ipAddress || !persistedUser.ipAddress.includes(clientIp))) {
        persistedUser.ipAddress = clientIp + (isOwner ? ' (Yetkili)' : ' (Kayıtlı Kullanıcı)');
      }
      if (isOwner && persistedUser.role !== 'Owner') {
        persistedUser.role = 'Owner';
      } else if (persistedUser.role === 'Member') {
        persistedUser.role = 'Müşteri';
      }
      saveUserRecord(persistedUser);
      syncUserToCloudStore(persistedUser).catch(() => {});
    }

    const effectiveEmail = persistedUser.email || sessionUser.email || (isOwner ? 'gumuslina18@gmail.com' : '');

    // Merge session with authoritative persisted data
    const fullUser = {
      id: persistedUser.id,
      username: persistedUser.username,
      discriminator: persistedUser.discriminator || '',
      avatarUrl: persistedUser.avatarUrl || sessionUser.avatarUrl || '/wihyfe-icon.png',
      email: effectiveEmail,
      balance: typeof persistedUser.balance === 'number' ? persistedUser.balance : 0,
      tier: persistedUser.tier || 'Free',
      role: persistedUser.role || (isOwner ? 'Owner' : 'Müşteri'),
      transactions: Array.isArray(persistedUser.transactions) ? persistedUser.transactions : [],
      orders: Array.isArray(persistedUser.orders) ? persistedUser.orders : [],
      guilds: Array.isArray(persistedUser.guilds) ? persistedUser.guilds : [],
      serversCount: persistedUser.serversCount || 0,
      activeBotsCount: persistedUser.activeBotsCount || 0,
      phone: persistedUser.phone,
      company: persistedUser.company,
      notifications: persistedUser.notifications,
      twoFactorEnabled: persistedUser.twoFactorEnabled,
      joinedDate: persistedUser.joinedDate,
      lastLogin: persistedUser.lastLogin,
      ipAddress: persistedUser.ipAddress,
      status: persistedUser.status || 'Aktif',
    };

    return NextResponse.json({ user: fullUser }, { status: 200, headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error('Failed to parse wisp_session cookie or fetch user:', err);
    return NextResponse.json({ user: null }, { status: 200, headers: NO_CACHE_HEADERS });
  }
}
