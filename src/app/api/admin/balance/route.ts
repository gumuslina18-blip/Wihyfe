import { NextRequest, NextResponse } from 'next/server';
import { modifyUserBalanceInStore, getAllUsersForAdmin } from '@/lib/serverStore';
import { verifyAdminSession } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const auth = await verifyAdminSession(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error || 'Yetkisiz erişim.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId, amount, type, reason, staffName } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Hedef kullanıcı belirtilmedi.' }, { status: 400 });
    }

    const numAmount = Math.abs(Number(amount));
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json({ success: false, error: 'Lütfen geçerli bir tutar girin.' }, { status: 400 });
    }

    if (type !== 'add' && type !== 'deduct') {
      return NextResponse.json({ success: false, error: 'İşlem türü add veya deduct olmalıdır.' }, { status: 400 });
    }

    const result = modifyUserBalanceInStore({
      userId,
      amount: numAmount,
      type,
      reason: reason || 'Yetkili manuel bakiye düzenlemesi',
      staffName: staffName || auth.username || 'Yetkili',
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: result.user,
      newBalance: result.newBalance,
      previousBalance: result.previousBalance,
      log: result.log,
      users: getAllUsersForAdmin(),
    });
  } catch (err: any) {
    console.error('Error in POST /api/admin/balance:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
