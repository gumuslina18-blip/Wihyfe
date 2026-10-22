import { NextRequest, NextResponse } from 'next/server';
import { serverStore, saveStore } from '@/lib/serverStore';
import { AdminOrder } from '@/config/admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { reloadStore } = await import('@/lib/serverStore');
  reloadStore();

  const searchParams = request.nextUrl.searchParams;
  const discordId = searchParams.get('discordId');
  const discordTag = searchParams.get('discordTag');
  const orderId = searchParams.get('orderId');

  let orders = serverStore.orders || [];
  if (orderId) {
    orders = orders.filter((o) => o.id === orderId);
  } else if (discordId) {
    orders = orders.filter((o) => o.customerDiscordId === discordId);
  } else if (discordTag) {
    orders = orders.filter((o) => o.customerDiscord?.toLowerCase() === discordTag.toLowerCase());
  }

  // Ensure deliveryStatus is always normalized for the customer:
  // 'Beklemede' | 'İşlemde' | 'Tamamlandı' | 'İptal Edildi'
  const formatted = orders.map((o: any) => {
    let deliv = o.deliveryStatus || o.status;
    const clean = String(deliv || '').trim().toLowerCase();
    if (clean === 'işlemde' || clean === 'islemde' || clean === 'in_progress') deliv = 'İşlemde';
    else if (clean === 'tamamlandı' || clean === 'tamamlandi' || clean === 'active' || clean === 'onaylandı') deliv = 'Tamamlandı';
    else if (clean === 'iptal edildi' || clean === 'iptal' || clean === 'cancelled') deliv = 'İptal Edildi';
    else deliv = 'Beklemede';

    return {
      ...o,
      deliveryStatus: deliv,
    };
  });

  return NextResponse.json({ orders: formatted });
}

export async function PATCH(request: NextRequest) {
  try {
    const { verifyAdminSession } = await import('@/lib/adminAuth');
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error || 'Yetkisiz erişim.' }, { status: 401 });
    }

    const { reloadStore, saveStore } = await import('@/lib/serverStore');
    reloadStore();
    const body = await request.json();
    const { orderId, deliveryStatus, notes, staffName } = body;

    if (!orderId || !deliveryStatus) {
      return NextResponse.json({ success: false, error: 'Sipariş ID ve teslimat durumu zorunludur.' }, { status: 400 });
    }

    if (!Array.isArray(serverStore.orders)) {
      serverStore.orders = [];
    }

    const order = serverStore.orders.find((o) => o.id === orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Sipariş bulunamadı.' }, { status: 404 });
    }

    let normalized: 'Beklemede' | 'İşlemde' | 'Tamamlandı' | 'İptal Edildi' = 'Beklemede';
    const clean = String(deliveryStatus).trim().toLowerCase();
    if (clean === 'işlemde' || clean === 'islemde' || clean === 'in_progress') normalized = 'İşlemde';
    else if (clean === 'tamamlandı' || clean === 'tamamlandi' || clean === 'active') normalized = 'Tamamlandı';
    else if (clean === 'iptal edildi' || clean === 'iptal' || clean === 'cancelled') normalized = 'İptal Edildi';
    else normalized = 'Beklemede';

    (order as any).deliveryStatus = normalized;
    if (normalized === 'Tamamlandı') {
      order.status = 'active';
    } else if (normalized === 'İptal Edildi') {
      order.status = 'cancelled';
    } else {
      order.status = 'pending_paytr';
    }

    if (notes !== undefined) {
      (order as any).notes = notes;
    }

    // If this is a deposit order, sync with depositRequests and credit/reject balance
    const isDeposit = orderId.startsWith('DEP-') || (order.packageName && order.packageName.toLowerCase().includes('bakiye'));
    if (isDeposit) {
      if (!Array.isArray(serverStore.depositRequests)) {
        serverStore.depositRequests = [];
      }
      const depReq = serverStore.depositRequests.find((d) => d.id === orderId);
      if (normalized === 'Tamamlandı') {
        const amount = depReq?.amount || order.numericPrice || 0;
        const targetUser = depReq?.userId || order.customerDiscordId || order.customerDiscord;
        if (depReq && depReq.status !== 'approved') {
          depReq.status = 'approved';
          depReq.updatedAt = new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        }
        if (amount > 0 && targetUser) {
          const { creditUserBalance } = await import('@/lib/serverStore');
          creditUserBalance(targetUser, amount, `Sipariş Üzerinden Onaylanan Bakiye (${orderId})`, 'PayTR 3D Secure');
        }
      } else if (normalized === 'İptal Edildi') {
        if (depReq) {
          depReq.status = 'rejected';
          depReq.updatedAt = new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        }
      }
    }

    // Also update in users records
    if (serverStore.users) {
      Object.values(serverStore.users).forEach((u: any) => {
        if (Array.isArray(u.orders)) {
          u.orders.forEach((uo: any) => {
            if (uo.orderId === orderId || uo.id === orderId) {
              uo.deliveryStatus = normalized;
              uo.status = normalized;
            }
          });
        }
      });
    }

    // Audit log
    serverStore.logs.unshift({
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      staffName: staffName || 'Yetkili Ekip',
      action: `Teslimat Durumu Güncellendi (${orderId})`,
      details: `Teslimat Durumu: "${normalized}" olarak güncellendi.`,
      type: 'order',
    });

    saveStore();

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    console.error('Order patch error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId,
      customerDiscord,
      customerDiscordId,
      customerEmail,
      serverId,
      serverName,
      packageName,
      periodLabel,
      periodKey,
      price,
      numericPrice,
      paytrUrl,
    } = body;

    if (!orderId || !packageName) {
      return NextResponse.json({ error: 'Eksik sipariş bilgisi.' }, { status: 400 });
    }

    const newOrder: AdminOrder = {
      id: orderId,
      customerDiscord: customerDiscord || 'Bilinmeyen Müşteri',
      customerDiscordId: customerDiscordId,
      customerEmail: customerEmail || '',
      serverId: serverId || '',
      serverName: serverName || 'Discord Sunucusu',
      packageName: packageName,
      periodLabel: periodLabel || 'Aylık',
      periodKey: periodKey || 'monthly',
      price: price || '0 TL',
      numericPrice: Number(numericPrice) || 0,
      paytrUrl: paytrUrl || '',
      status: 'pending_paytr',
      createdAt: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };

    serverStore.orders.unshift(newOrder);

    // Audit log
    serverStore.logs.unshift({
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      staffName: 'Sistem',
      action: `Yeni PayTR Siparişi (${newOrder.id})`,
      details: `${newOrder.packageName} (${newOrder.customerDiscord}) - ${newOrder.price}`,
      type: 'order',
    });

    saveStore();

    return NextResponse.json({ success: true, order: newOrder });
  } catch (err) {
    console.error('Order creation error:', err);
    return NextResponse.json({ error: 'Sipariş oluşturulamadı.' }, { status: 500 });
  }
}
