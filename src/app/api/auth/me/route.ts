import { NextRequest, NextResponse } from 'next/server';
import { getUserRecord, saveUserRecord } from '@/lib/serverStore';
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
    if (!persistedUser) {
      persistedUser = saveUserRecord({
        id: sessionUser.id,
        username: sessionUser.username,
        avatarUrl: sessionUser.avatarUrl || '/wihyfe-icon.png',
        tier: 'Free',
        role: 'Member',
        balance: 0,
        serversCount: 0,
        activeBotsCount: 0,
        guilds: [],
        joinedDate: new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }),
      });
    }

    // Merge session with authoritative persisted data
    const fullUser = {
      id: persistedUser.id,
      username: persistedUser.username,
      discriminator: persistedUser.discriminator || '',
      avatarUrl: persistedUser.avatarUrl || sessionUser.avatarUrl || '/wihyfe-icon.png',
      email: persistedUser.email || '',
      balance: typeof persistedUser.balance === 'number' ? persistedUser.balance : 0,
      tier: persistedUser.tier || 'Free',
      role: persistedUser.role || 'Member',
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
    };

    return NextResponse.json({ user: fullUser }, { status: 200, headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error('Failed to parse wisp_session cookie or fetch user:', err);
    return NextResponse.json({ user: null }, { status: 200, headers: NO_CACHE_HEADERS });
  }
}
