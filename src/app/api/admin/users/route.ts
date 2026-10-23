import { NextRequest, NextResponse } from 'next/server';
import {
  getAllUsersForAdmin,
  getUserRecord,
  saveUserRecord,
  saveStore,
  serverStore,
  syncUserToCloudStore,
} from '@/lib/serverStore';
import { verifyAdminSession } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const users = await getAllUsersForAdmin();
    return NextResponse.json(
      {
        success: true,
        users,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (err: any) {
    console.error('Error in GET /api/admin/users:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, role, subscription, status, panelAccess, password } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Kullanıcı kimliği zorunludur.' }, { status: 400 });
    }

    let user = getUserRecord(userId);
    if (!user) {
      const all = await getAllUsersForAdmin();
      const found = all.find((u) => u.id === userId || u.username.toLowerCase() === userId.toLowerCase());
      if (found) {
        user = saveUserRecord({
          id: found.id,
          username: found.username,
          discriminator: found.discriminator,
          avatarUrl: found.avatarUrl,
          email: found.email,
          role: found.role,
          tier: found.subscription,
          balance: found.balance,
          status: found.status,
          ipAddress: found.ipAddress,
          lastLogin: found.lastLogin,
          panelAccess: found.panelAccess,
        });
      }
    }

    if (!user) {
      return NextResponse.json({ success: false, error: 'Kullanıcı bulunamadı.' }, { status: 404 });
    }

    if (role !== undefined) user.role = role;
    if (subscription !== undefined) user.tier = subscription;
    if (status !== undefined) (user as any).status = status;
    if (panelAccess !== undefined) (user as any).panelAccess = panelAccess;
    if (password !== undefined) (user as any).password = password;

    const now = new Date();
    user.updatedAt =
      now.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
      ' ' +
      now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    if (!serverStore.users) serverStore.users = {};
    serverStore.users[user.id] = user;
    saveStore();

    // Persist to cloud store
    await syncUserToCloudStore(user);

    return NextResponse.json({
      success: true,
      user,
      users: await getAllUsersForAdmin(),
    });
  } catch (err: any) {
    console.error('Error in PATCH /api/admin/users:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
