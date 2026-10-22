import { NextRequest, NextResponse } from 'next/server';
import { serverStore, reloadStore, saveStore, EndOfDayReport } from '@/lib/serverStore';
import { verifyAdminSession } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

function parseTurkishDateTime(dtStr?: string): number {
  if (!dtStr) return 0;
  try {
    // Expected format: "18.10.2026 13:44" or "18.10.2026"
    const parts = dtStr.trim().split(' ');
    const dateParts = parts[0].split('.');
    if (dateParts.length === 3) {
      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1;
      const year = parseInt(dateParts[2], 10);
      let hour = 0;
      let minute = 0;
      if (parts[1]) {
        const timeParts = parts[1].split(':');
        hour = parseInt(timeParts[0], 10) || 0;
        minute = parseInt(timeParts[1], 10) || 0;
      }
      return new Date(year, month, day, hour, minute).getTime();
    }
    const parsed = Date.parse(dtStr);
    return isNaN(parsed) ? 0 : parsed;
  } catch {
    return 0;
  }
}

export async function GET(request: NextRequest) {
  const auth = await verifyAdminSession(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error || 'Yetkisiz erişim.' }, { status: 401 });
  }

  try {
    reloadStore();
    const now = new Date();
    const todayDateStr = now.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const lastClosedAt = serverStore.lastEndOfDayTimestamp || '';
    const cutoffTime = lastClosedAt ? parseTurkishDateTime(lastClosedAt) : 0;

    // Filter orders in current window
    const allOrders = serverStore.orders || [];
    const windowOrders = allOrders.filter((o) => {
      const t = parseTurkishDateTime(o.createdAt);
      if (cutoffTime > 0) return t >= cutoffTime;
      return o.createdAt && o.createdAt.startsWith(todayDateStr);
    });

    let totalRevenue = 0;
    let completedOrdersCount = 0;
    let pendingOrdersCount = 0;
    let cancelledOrdersCount = 0;
    let largestOrderAmount = 0;
    const productFrequency: Record<string, number> = {};
    const customerSpending: Record<string, number> = {};

    windowOrders.forEach((o) => {
      const isComplete = o.status === 'active' || (o as any).deliveryStatus === 'Tamamlandı';
      const isCancel = o.status === 'cancelled' || (o as any).deliveryStatus === 'İptal Edildi';
      const amount = Number(o.numericPrice) || 0;

      if (isComplete) {
        completedOrdersCount++;
        totalRevenue += amount;
      } else if (isCancel) {
        cancelledOrdersCount++;
      } else {
        pendingOrdersCount++;
      }

      if (amount > largestOrderAmount) largestOrderAmount = amount;

      const pName = o.packageName || 'WispBot Paketi';
      productFrequency[pName] = (productFrequency[pName] || 0) + 1;

      const cName = o.customerDiscord || o.customerDiscordId || 'Müşteri';
      customerSpending[cName] = (customerSpending[cName] || 0) + (isComplete ? amount : 0);
    });

    // Top product & customer
    let topProduct = 'Yok';
    let maxPCount = 0;
    Object.entries(productFrequency).forEach(([p, count]) => {
      if (count > maxPCount) {
        maxPCount = count;
        topProduct = p;
      }
    });

    let topCustomer = 'Yok';
    let maxCSpent = 0;
    Object.entries(customerSpending).forEach(([c, spent]) => {
      if (spent > maxCSpent) {
        maxCSpent = spent;
        topCustomer = c;
      }
    });

    // Deposits in window
    const allDeposits = serverStore.depositRequests || [];
    const windowDeposits = allDeposits.filter((d) => {
      const t = parseTurkishDateTime(d.createdAt);
      if (cutoffTime > 0) return t >= cutoffTime;
      return d.createdAt && d.createdAt.startsWith(todayDateStr);
    });
    let depositsTotal = 0;
    windowDeposits.forEach((d) => {
      if (d.status === 'approved') {
        depositsTotal += d.amount;
      }
    });

    // Tickets in window
    const allTickets = serverStore.tickets || [];
    const windowTickets = allTickets.filter((tk) => {
      const t = parseTurkishDateTime(tk.createdAt);
      if (cutoffTime > 0) return t >= cutoffTime;
      return tk.createdAt && tk.createdAt.startsWith(todayDateStr);
    });
    const ticketsOpened = windowTickets.length;
    const ticketsResolved = windowTickets.filter((tk) => tk.status === 'closed').length;

    // Users registered in window
    const allUsers = serverStore.users ? Object.values(serverStore.users) : [];
    const windowUsers = allUsers.filter((u) => {
      const t = parseTurkishDateTime(u.createdAt || u.joinedDate);
      if (cutoffTime > 0) return t >= cutoffTime;
      return (u.createdAt && u.createdAt.startsWith(todayDateStr)) || (u.joinedDate && u.joinedDate.startsWith(todayDateStr));
    });

    // Recent activity logs in window
    const allLogs = serverStore.logs || [];
    const windowLogs = allLogs.filter((l) => {
      const t = parseTurkishDateTime(l.timestamp);
      if (cutoffTime > 0) return t >= cutoffTime;
      return l.timestamp && l.timestamp.startsWith(todayDateStr);
    }).slice(0, 15);

    const liveMetrics = {
      date: todayDateStr,
      periodStart: lastClosedAt || `${todayDateStr} 00:00`,
      currentTime: todayDateStr + ' ' + now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      totalRevenue,
      totalRevenueFormatted: `${totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`,
      ordersCount: windowOrders.length,
      completedOrdersCount,
      pendingOrdersCount,
      cancelledOrdersCount,
      depositsTotal,
      depositsTotalFormatted: `${depositsTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`,
      depositsCount: windowDeposits.length,
      ticketsOpened,
      ticketsResolved,
      newUsersCount: windowUsers.length,
      newPinsCount: (serverStore.pins || []).length,
      highlights: {
        topProduct,
        topCustomer,
        largestOrderAmount,
      },
      orderIds: windowOrders.map((o) => o.id),
      windowOrders,
      windowLogs,
    };

    return NextResponse.json({
      success: true,
      live: liveMetrics,
      reports: serverStore.endOfDayReports || [],
      lastClosedAt: serverStore.lastEndOfDayTimestamp || null,
    });
  } catch (err: any) {
    console.error('End of day GET error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdminSession(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error || 'Yetkisiz erişim.' }, { status: 401 });
  }

  try {
    reloadStore();
    const body = await request.json();
    const { staffName, notes } = body;

    const now = new Date();
    const dateStamp = now.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const fullTime = dateStamp + ' ' + now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const lastClosedAt = serverStore.lastEndOfDayTimestamp || `${dateStamp} 00:00`;
    const cutoffTime = serverStore.lastEndOfDayTimestamp ? parseTurkishDateTime(serverStore.lastEndOfDayTimestamp) : 0;

    // Filter orders in current window
    const allOrders = serverStore.orders || [];
    const windowOrders = allOrders.filter((o) => {
      const t = parseTurkishDateTime(o.createdAt);
      if (cutoffTime > 0) return t >= cutoffTime;
      return o.createdAt && o.createdAt.startsWith(dateStamp);
    });

    let totalRevenue = 0;
    let completedOrdersCount = 0;
    let pendingOrdersCount = 0;
    let cancelledOrdersCount = 0;
    let largestOrderAmount = 0;
    const productFrequency: Record<string, number> = {};
    const customerSpending: Record<string, number> = {};

    windowOrders.forEach((o) => {
      const isComplete = o.status === 'active' || (o as any).deliveryStatus === 'Tamamlandı';
      const isCancel = o.status === 'cancelled' || (o as any).deliveryStatus === 'İptal Edildi';
      const amount = Number(o.numericPrice) || 0;

      if (isComplete) {
        completedOrdersCount++;
        totalRevenue += amount;
      } else if (isCancel) {
        cancelledOrdersCount++;
      } else {
        pendingOrdersCount++;
      }

      if (amount > largestOrderAmount) largestOrderAmount = amount;

      const pName = o.packageName || 'WispBot Paketi';
      productFrequency[pName] = (productFrequency[pName] || 0) + 1;

      const cName = o.customerDiscord || o.customerDiscordId || 'Müşteri';
      customerSpending[cName] = (customerSpending[cName] || 0) + (isComplete ? amount : 0);
    });

    let topProduct = 'Yok';
    let maxPCount = 0;
    Object.entries(productFrequency).forEach(([p, count]) => {
      if (count > maxPCount) {
        maxPCount = count;
        topProduct = p;
      }
    });

    let topCustomer = 'Yok';
    let maxCSpent = 0;
    Object.entries(customerSpending).forEach(([c, spent]) => {
      if (spent > maxCSpent) {
        maxCSpent = spent;
        topCustomer = c;
      }
    });

    // Deposits in window
    const allDeposits = serverStore.depositRequests || [];
    const windowDeposits = allDeposits.filter((d) => {
      const t = parseTurkishDateTime(d.createdAt);
      if (cutoffTime > 0) return t >= cutoffTime;
      return d.createdAt && d.createdAt.startsWith(dateStamp);
    });
    let depositsTotal = 0;
    windowDeposits.forEach((d) => {
      if (d.status === 'approved') depositsTotal += d.amount;
    });

    // Tickets in window
    const allTickets = serverStore.tickets || [];
    const windowTickets = allTickets.filter((tk) => {
      const t = parseTurkishDateTime(tk.createdAt);
      if (cutoffTime > 0) return t >= cutoffTime;
      return tk.createdAt && tk.createdAt.startsWith(dateStamp);
    });

    // Users in window
    const allUsers = serverStore.users ? Object.values(serverStore.users) : [];
    const windowUsers = allUsers.filter((u) => {
      const t = parseTurkishDateTime(u.createdAt || u.joinedDate);
      if (cutoffTime > 0) return t >= cutoffTime;
      return (u.createdAt && u.createdAt.startsWith(dateStamp)) || (u.joinedDate && u.joinedDate.startsWith(dateStamp));
    });

    const reportCount = (serverStore.endOfDayReports || []).length + 1;
    const rawDateClean = dateStamp.replace(/\./g, '');
    const reportId = `Z-${rawDateClean}-${String(reportCount).padStart(2, '0')}`;

    const newReport: EndOfDayReport = {
      id: reportId,
      date: dateStamp,
      periodStart: lastClosedAt,
      closedAt: fullTime,
      closedBy: staffName || 'Yetkili Yönetici',
      metrics: {
        totalRevenue,
        totalRevenueFormatted: `${totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`,
        ordersCount: windowOrders.length,
        completedOrdersCount,
        pendingOrdersCount,
        cancelledOrdersCount,
        depositsTotal,
        depositsCount: windowDeposits.length,
        ticketsOpened: windowTickets.length,
        ticketsResolved: windowTickets.filter((tk) => tk.status === 'closed').length,
        newUsersCount: windowUsers.length,
        newPinsCount: (serverStore.pins || []).length,
      },
      highlights: {
        topProduct,
        topCustomer,
        largestOrderAmount,
      },
      orderIds: windowOrders.map((o) => o.id),
      notes: notes || 'Gün sonu işlemi başarıyla kapatıldı.',
    };

    if (!Array.isArray(serverStore.endOfDayReports)) {
      serverStore.endOfDayReports = [];
    }
    serverStore.endOfDayReports.unshift(newReport);

    // Advance lastEndOfDayTimestamp to current time so counters reset immediately!
    serverStore.lastEndOfDayTimestamp = fullTime;

    // Record audit log
    serverStore.logs.unshift({
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: fullTime,
      staffName: staffName || 'Yetkili Yönetici',
      action: `Gün Sonu Kapatıldı (${reportId})`,
      details: `${dateStamp} Gün Sonu Raporu: Ciro: ₺${totalRevenue.toLocaleString('tr-TR')} • Sipariş: ${windowOrders.length} • Bakiye: ₺${depositsTotal.toLocaleString('tr-TR')}`,
      type: 'auth',
    });

    saveStore();

    return NextResponse.json({
      success: true,
      report: newReport,
      reports: serverStore.endOfDayReports,
      lastClosedAt: fullTime,
    });
  } catch (err: any) {
    console.error('End of day POST error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
