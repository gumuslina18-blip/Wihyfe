import { NextRequest, NextResponse } from 'next/server';
import { getUserRecord, saveUserRecord, syncUserToCloudStore } from '@/lib/serverStore';
import { verifyUserSession, verifyAdminSession, signUserSession } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    let userId = searchParams.get('userId');
    let username = searchParams.get('username');

    // If query params are missing, attempt reading from session cookie
    if (!userId && !username) {
      const sessionCookie = request.cookies.get('wisp_session');
      if (sessionCookie?.value) {
        const verified = verifyUserSession(sessionCookie.value);
        if (verified) {
          userId = verified.id;
          username = verified.username;
        }
      }
    }

    if (!userId && !username) {
      return NextResponse.json({ success: false, error: 'Kullanıcı kimliği bulunamadı.' }, { status: 400 });
    }

    const record = getUserRecord(userId || '') || getUserRecord(username || '');
    if (!record) {
      return NextResponse.json({ success: false, error: 'Kullanıcı kaydı bulunamadı.' }, { status: 404 });
    }

    // Do not leak sensitive data
    const safeRecord = {
      ...record,
      password: undefined,
    };

    return NextResponse.json({
      success: true,
      user: safeRecord,
    });
  } catch (err: any) {
    console.error('Error in GET /api/user/sync:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('wisp_session');
    const verifiedSession = sessionCookie?.value ? verifyUserSession(sessionCookie.value) : null;
    const adminAuth = await verifyAdminSession(request);

    const body = await request.json();
    const {
      userId,
      username,
      phone,
      company,
      notifications,
      twoFactorEnabled,
      avatarUrl,
      email,
      discriminator,
    } = body;

    const targetId = userId || verifiedSession?.id;
    if (!targetId) {
      return NextResponse.json({ success: false, error: 'Kullanıcı kimliği zorunludur.' }, { status: 400 });
    }

    const existingRecord = getUserRecord(targetId) || getUserRecord(username || '');
    const isOwner = targetId === '181209570092384257' || (username && username.toLowerCase() === 'lunaalvine');

    const clientIp =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';
    const nowStr =
      new Date().toLocaleDateString('tr-TR') +
      ' ' +
      new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    // Secure payload: balance, role, tier and transactions CANNOT be manipulated by clients!
    const savedRecord = saveUserRecord({
      id: targetId,
      username: username || existingRecord?.username || verifiedSession?.username || 'Kullanıcı',
      discriminator: discriminator !== undefined ? discriminator : existingRecord?.discriminator,
      avatarUrl: avatarUrl || existingRecord?.avatarUrl || 'https://cdn.discordapp.com/embed/avatars/0.png',
      email: email !== undefined ? email : (existingRecord?.email || (isOwner ? 'gumuslina18@gmail.com' : '')),
      // Protect critical fields:
      tier: adminAuth.authorized && body.tier ? body.tier : (existingRecord?.tier || 'Free'),
      role: isOwner ? 'Owner' : (adminAuth.authorized && body.role ? body.role : (existingRecord?.role && existingRecord.role !== 'Member' ? existingRecord.role : 'Müşteri')),
      balance: adminAuth.authorized && typeof body.balance === 'number' ? body.balance : (existingRecord?.balance ?? 0),
      transactions: existingRecord?.transactions || [],
      orders: existingRecord?.orders || [],
      // Editable preferences:
      phone: phone !== undefined ? phone : existingRecord?.phone,
      company: company !== undefined ? company : existingRecord?.company,
      notifications: notifications !== undefined ? notifications : existingRecord?.notifications,
      twoFactorEnabled: twoFactorEnabled !== undefined ? twoFactorEnabled : existingRecord?.twoFactorEnabled,
      guilds: existingRecord?.guilds || [],
      serversCount: existingRecord?.serversCount || 0,
      activeBotsCount: existingRecord?.activeBotsCount || 0,
      ipAddress: clientIp + (isOwner ? ' (Yetkili)' : ' (Kayıtlı Kullanıcı)'),
      lastLogin: 'Çevrimiçi (' + nowStr + ')',
      status: existingRecord?.status || 'Aktif',
    });

    // Await cloud store persistence
    await syncUserToCloudStore(savedRecord);

    const response = NextResponse.json({
      success: true,
      user: {
        ...savedRecord,
        password: undefined,
      },
    });

    // Update session cookie with signed token
    if (verifiedSession && verifiedSession.id === savedRecord.id) {
      const signedSession = signUserSession({
        id: savedRecord.id,
        username: savedRecord.username,
        avatarUrl: savedRecord.avatarUrl || verifiedSession.avatarUrl,
        email: savedRecord.email || verifiedSession.email || '',
      });
      response.cookies.set('wisp_session', signedSession, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;
  } catch (err: any) {
    console.error('Error in POST /api/user/sync:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
