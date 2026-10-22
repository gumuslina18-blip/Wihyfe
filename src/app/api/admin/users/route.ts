import { NextRequest, NextResponse } from 'next/server';
import { getAllUsersForAdmin, getUserRecord, saveUserRecord, saveStore, serverStore } from '@/lib/serverStore';
import { verifyAdminSession } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await verifyAdminSession(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error || 'Yetkisiz erişim.' }, { status: 401 });
  }

  try {
    const users = getAllUsersForAdmin();
    return NextResponse.json({
      success: true,
      users,
    });
  } catch (err: any) {
    console.error('Error in GET /api/admin/users:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await verifyAdminSession(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error || 'Yetkisiz erişim.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId, role, subscription, status, panelAccess, password } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Kullanıcı kimliği zorunludur.' }, { status: 400 });
    }

    const user = getUserRecord(userId);
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

    return NextResponse.json({
      success: true,
      user,
      users: getAllUsersForAdmin(),
    });
  } catch (err: any) {
    console.error('Error in PATCH /api/admin/users:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
