import { NextRequest, NextResponse } from 'next/server';
import { serverStore, saveStore, reloadStore, DepositRequest } from '@/lib/serverStore';
import { verifyAdminSession } from '@/lib/adminAuth';
import { AdminOrder } from '@/config/admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await verifyAdminSession(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error || 'Yetkisiz erişim.' }, { status: 401 });
  }

  try {
    reloadStore();
    return NextResponse.json({
      success: true,
      depositRequests: serverStore.depositRequests || [],
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userName, userEmail, amount, paymentMethod } = body;

    if (!amount || amount < 50) {
      return NextResponse.json({ success: false, error: 'Minimum yükleme tutarı 50 TL\'dir.' }, { status: 400 });
    }

    const numAmount = Number(amount);
    const depId = `DEP-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const dateStamp = now.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    const newReq: DepositRequest = {
      id: depId,
      userId: userId || 'usr_lunaalvine',
      userName: userName || 'Luna',
      userEmail: userEmail || '',
      amount: numAmount,
      status: 'pending',
      paymentMethod: paymentMethod || 'PayTR 3D Secure',
      createdAt: dateStamp,
    };

    if (!Array.isArray(serverStore.depositRequests)) {
      serverStore.depositRequests = [];
    }
    serverStore.depositRequests.unshift(newReq);

    // Also register into serverStore.orders so it is visible in Orders view as well
    const newOrder: AdminOrder = {
      id: depId,
      customerDiscord: userName || 'Luna',
      customerDiscordId: userId || 'usr_lunaalvine',
      customerEmail: userEmail || '',
      serverId: 'Cüzdan Bakiye Yükleme',
      serverName: 'Wihyfe Cüzdan',
      packageName: `Bakiye Yükleme (${paymentMethod || 'PayTR 3D Secure'})`,
      periodLabel: 'Tek Seferlik',
      periodKey: 'monthly',
      price: `${numAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`,
      numericPrice: numAmount,
      status: 'pending_paytr',
      createdAt: dateStamp,
    };

    if (!Array.isArray(serverStore.orders)) {
      serverStore.orders = [];
    }
    serverStore.orders.unshift(newOrder);

    // Audit log
    serverStore.logs.unshift({
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: dateStamp,
      staffName: 'Sistem (PayTR)',
      action: `Bakiye Yükleme Talebi (${depId})`,
      details: `${userName || 'Müşteri'} - ₺${numAmount.toLocaleString('tr-TR')} (${paymentMethod || 'PayTR'})`,
      type: 'order',
    });

    saveStore();

    return NextResponse.json({ success: true, depositRequest: newReq });
  } catch (err: any) {
    console.error('Error creating deposit request:', err);
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
    const { id, action, staffName } = body; // action: 'approve' | 'reject' | 'delete'

    if (!id || !action) {
      return NextResponse.json({ success: false, error: 'Eksik parametre' }, { status: 400 });
    }

    if (!Array.isArray(serverStore.depositRequests)) {
      serverStore.depositRequests = [];
    }

    const index = serverStore.depositRequests.findIndex((r) => r.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Talep bulunamadı' }, { status: 404 });
    }

    const now = new Date();
    const dateStamp = now.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    if (action === 'delete') {
      serverStore.depositRequests.splice(index, 1);
      // Remove corresponding order
      serverStore.orders = (serverStore.orders || []).filter((o) => o.id !== id);
    } else if (action === 'approve') {
      const target = serverStore.depositRequests[index];
      const wasPending = target.status !== 'approved';
      target.status = 'approved';
      target.updatedAt = dateStamp;

      // Update order status
      const ord = (serverStore.orders || []).find((o) => o.id === id);
      if (ord) {
        ord.status = 'active';
        (ord as any).deliveryStatus = 'Tamamlandı';
        (ord as any).deliveryTime = dateStamp;
      }

      // Credit real customer balance in serverStore.users
      if (wasPending) {
        const { creditUserBalance } = await import('@/lib/serverStore');
        creditUserBalance(
          target.userId || target.userName,
          target.amount,
          `PayTR 3D Secure Bakiye Talebi (${id})`,
          target.paymentMethod
        );
      }

      // Log audit
      serverStore.logs.unshift({
        id: `LOG-${Date.now().toString().slice(-4)}`,
        timestamp: dateStamp,
        staffName: staffName || 'Yetkili',
        action: `Bakiye Talebi Onaylandı (${id})`,
        details: `${target.userName} hesabına ₺${target.amount.toLocaleString('tr-TR')} bakiye eklendi.`,
        type: 'auth',
      });
    } else if (action === 'reject') {
      const target = serverStore.depositRequests[index];
      target.status = 'rejected';
      target.updatedAt = dateStamp;

      const ord = (serverStore.orders || []).find((o) => o.id === id);
      if (ord) {
        ord.status = 'cancelled';
        (ord as any).deliveryStatus = 'İptal Edildi';
      }

      serverStore.logs.unshift({
        id: `LOG-${Date.now().toString().slice(-4)}`,
        timestamp: dateStamp,
        staffName: staffName || 'Yetkili',
        action: `Bakiye Talebi Reddedildi (${id})`,
        details: `${target.userName} - ₺${target.amount.toLocaleString('tr-TR')} talebi iptal edildi.`,
        type: 'auth',
      });
    }

    saveStore();

    return NextResponse.json({
      success: true,
      depositRequests: serverStore.depositRequests,
    });
  } catch (err: any) {
    console.error('Error modifying deposit request:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
