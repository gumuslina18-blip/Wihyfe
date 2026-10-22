import { NextRequest, NextResponse } from 'next/server';
import { getUserRecord, serverStore, saveStore, creditReferralCommission } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || searchParams.get('username');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Kullanıcı belirtilmedi.' }, { status: 400 });
    }

    const user = getUserRecord(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Kullanıcı bulunamadı.' }, { status: 404 });
    }

    const refCode = user.referral?.code || user.username.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (!user.referral) {
      user.referral = {
        code: refCode,
        referredUsersCount: 0,
        totalEarned: 0,
        history: [],
      };
      if (!serverStore.users) serverStore.users = {};
      serverStore.users[user.id] = user;
      saveStore();
    }

    return NextResponse.json({
      success: true,
      referral: {
        code: refCode,
        link: `https://wihyfe.com?ref=${refCode}`,
        referredUsersCount: user.referral.referredUsersCount || 0,
        totalEarned: user.referral.totalEarned || 0,
        commissionRate: 10, // %10
        history: user.referral.history || [],
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, userId, referrerCode, orderAmount } = body;

    // Handle commission crediting upon purchase (internal/admin only)
    if (action === 'commission') {
      const { verifyAdminSession } = await import('@/lib/adminAuth');
      const auth = await verifyAdminSession(req);
      if (!auth.authorized) {
        return NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 401 });
      }
      if (!userId || !orderAmount) {
        return NextResponse.json({ success: false, error: 'Eksik parametre' }, { status: 400 });
      }
      const res = creditReferralCommission(userId, Number(orderAmount));
      return NextResponse.json({ success: true, result: res });
    }

    if (!userId || !referrerCode) {
      return NextResponse.json({ success: false, error: 'Eksik parametre' }, { status: 400 });
    }

    const user = getUserRecord(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    // Find referrer
    const cleanRef = referrerCode.trim().toLowerCase();
    const referrer = getUserRecord(cleanRef);

    if (referrer && referrer.id !== user.id) {
      if (!user.referral) {
        user.referral = {
          code: user.username.toLowerCase().replace(/[^a-z0-9]/g, ''),
          referredBy: referrer.id,
          referredUsersCount: 0,
          totalEarned: 0,
          history: [],
        };
      } else if (!user.referral.referredBy) {
        user.referral.referredBy = referrer.id;
      }

      // Increment referrer's count if not already counted
      if (!referrer.referral) {
        referrer.referral = {
          code: referrer.username.toLowerCase(),
          referredUsersCount: 1,
          totalEarned: 0,
          history: [],
        };
      } else {
        referrer.referral.referredUsersCount = (referrer.referral.referredUsersCount || 0) + 1;
      }

      if (!serverStore.users) serverStore.users = {};
      serverStore.users[user.id] = user;
      serverStore.users[referrer.id] = referrer;
      saveStore();

      return NextResponse.json({ success: true, message: 'Referans başarıyla bağlandı.' });
    }

    return NextResponse.json({ success: false, error: 'Geçersiz referans kodu' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
