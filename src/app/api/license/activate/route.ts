import { NextRequest, NextResponse } from 'next/server';
import { serverStore, saveStore, reloadStore } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, userId, userName } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Lütfen lisans veya sipariş numaranızı giriniz.' },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase().replace(/^#/, '');
    if (!cleanCode) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz lisans kodu formatı.' },
        { status: 400 }
      );
    }

    reloadStore();
    const allPins = Array.isArray(serverStore.pins) ? serverStore.pins : [];
    const allOrders = Array.isArray(serverStore.orders) ? serverStore.orders : [];

    // 1. PIN / Lisans sorgusu
    const matchedPin = allPins.find(
      (p: any) => p.pin && p.pin.toUpperCase() === cleanCode
    );

    if (matchedPin) {
      // Son geçerlilik kontrolü
      const expMatch = typeof matchedPin.expiresAt === 'string'
        ? matchedPin.expiresAt.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/)
        : null;

      if (expMatch && matchedPin.status === 'Aktif') {
        const endOfDay = new Date(
          Number(expMatch[3]),
          Number(expMatch[2]) - 1,
          Number(expMatch[1]),
          23,
          59,
          59
        ).getTime();

        if (Date.now() > endOfDay) {
          matchedPin.status = 'Süresi Doldu';
          saveStore();
          return NextResponse.json(
            { success: false, error: 'Bu lisans kodunun geçerlilik süresi dolmuştur.' },
            { status: 400 }
          );
        }
      }

      if (matchedPin.status !== 'Aktif') {
        return NextResponse.json(
          { success: false, error: `Bu lisans kodu kullanılamaz (Durum: ${matchedPin.status}).` },
          { status: 400 }
        );
      }

      if ((matchedPin.currentUses || 0) >= matchedPin.maxUses) {
        matchedPin.status = 'Kullanıldı';
        saveStore();
        return NextResponse.json(
          { success: false, error: 'Bu lisans kodunun kullanım kotası dolmuştur.' },
          { status: 400 }
        );
      }

      // Plan Tagı belirleme: Satın alınan ilan ve periyot
      const rawTarget = (matchedPin.targetApp || '').trim();
      const planTag = rawTarget || 'Discord Full Pack - 1 Aylık';
      const tier = planTag;
      const role = planTag.toLowerCase().includes('full') || planTag.toLowerCase().includes('plus') || planTag.toLowerCase().includes('admin') ? 'VIP' : 'Müşteri';

      // Kullanım sayacını artır
      matchedPin.currentUses = (matchedPin.currentUses || 0) + 1;
      if (matchedPin.currentUses >= matchedPin.maxUses) {
        matchedPin.status = 'Kullanıldı';
      }

      const dateStamp =
        new Date().toLocaleDateString('tr-TR') +
        ' ' +
        new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

      if (!Array.isArray(matchedPin.usageLog)) matchedPin.usageLog = [];
      matchedPin.usageLog.unshift({
        at: dateStamp,
        ip: userId || userName || 'Web Client',
      });

      // Kullanıcı hesabını güncelle
      if (userId) {
        if (!serverStore.users) serverStore.users = {};
        let userRec = serverStore.users[userId];
        if (!userRec) {
          userRec = {
            id: userId,
            username: userName || 'Kullanıcı',
            tier,
            role,
            balance: 0,
            transactions: [],
            orders: [],
            notifications: { email: true, sms: false, discord: true },
            twoFactorEnabled: false,
            serversCount: 0,
            activeBotsCount: 0,
            createdAt: dateStamp,
            updatedAt: dateStamp,
          };
          serverStore.users[userId] = userRec;
        } else {
          userRec.tier = tier;
          if (userRec.role !== 'Owner' && userRec.role !== 'Admin') {
            userRec.role = role;
          }
          userRec.updatedAt = dateStamp;
        }

        if (!Array.isArray(userRec.orders)) userRec.orders = [];
        userRec.orders.unshift({
          orderId: `LIC-${cleanCode}`,
          date: dateStamp,
          items: [
            {
              name: `${tier} Lisansı`,
              periodLabel: 'Lisans Koduyla Aktif Edildi',
              price: '0,00 TL',
            },
          ],
          totalFormatted: '0,00',
          serverId: 'Tüm Sunucular',
          serverName: 'Wihyfe Lisans Sistemi',
          status: 'Aktif',
          paymentMethod: 'Lisans PIN Kodu',
        });

        // SaaS / Bot paneli için customerLicenses kaydı oluştur
        if (!Array.isArray(serverStore.customerLicenses)) serverStore.customerLicenses = [];
        const primaryGuild = userRec.guilds && userRec.guilds[0];
        const serverId = primaryGuild ? primaryGuild.id : 'default';
        const serverName = primaryGuild ? primaryGuild.name : 'Tüm Sunucularım';

        const existingLic = serverStore.customerLicenses.find((l: any) => l.serverId === serverId);
        if (!existingLic) {
          serverStore.customerLicenses.push({
            id: `LIC-${cleanCode}`,
            packageName: `${tier} Paketi`,
            serverId,
            serverName,
            periodLabel: 'Yıllık',
            price: '0,00 TL',
            startDate: dateStamp.split(' ')[0],
            expireDate: matchedPin.expiresAt || '31.12.2026',
            daysRemaining: 365,
            status: 'active',
          });
        } else {
          existingLic.packageName = `${tier} Paketi`;
          existingLic.status = 'active';
          existingLic.daysRemaining = 365;
          existingLic.expireDate = matchedPin.expiresAt || '31.12.2026';
        }
      }

      // Denetim kaydı ekle
      serverStore.logs.unshift({
        id: `LOG-${Date.now().toString().slice(-4)}`,
        timestamp: dateStamp,
        staffName: userName || userId || 'Müşteri',
        action: `Lisans Kodu Aktif Edildi (${cleanCode})`,
        details: `${tier} Lisansı kullanıcı hesabına tanımlandı.`,
        type: 'pricing',
      });

      saveStore();

      return NextResponse.json({
        success: true,
        tier,
        role,
        message: `✓ [${tier}] lisans kodu başarıyla doğrulandı ve müşteri paneliniz aktif edildi!`,
        pin: {
          pin: matchedPin.pin,
          targetApp: tier,
          tier,
          expiresAt: matchedPin.expiresAt,
        },
      });
    }

    // 2. Sipariş Numarası sorgusu (#WSP-...)
    const matchedOrder = allOrders.find(
      (o: any) =>
        o.id &&
        (o.id.toUpperCase() === cleanCode ||
          o.id.toUpperCase() === '#' + cleanCode ||
          o.id.toUpperCase().replace(/^#/, '') === cleanCode)
    );

    if (matchedOrder) {
      if (matchedOrder.status === 'cancelled') {
        return NextResponse.json(
          { success: false, error: 'Bu sipariş numarası iptal edilmiştir.' },
          { status: 400 }
        );
      }

      let tier: 'Free' | 'Plus' | 'Plus+' = 'Plus';
      const pkg = (matchedOrder.packageName || '').toLowerCase();
      if (pkg.includes('full') || pkg.includes('plus+')) {
        tier = 'Plus+';
      }

      const role = tier === 'Plus+' ? 'VIP' : 'Plus';
      const dateStamp =
        new Date().toLocaleDateString('tr-TR') +
        ' ' +
        new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

      if (userId) {
        if (!serverStore.users) serverStore.users = {};
        const userRec = serverStore.users[userId];
        if (userRec) {
          userRec.tier = tier;
          if (userRec.role !== 'Owner' && userRec.role !== 'Admin') {
            userRec.role = role;
          }
          userRec.updatedAt = dateStamp;
        }
      }

      saveStore();

      return NextResponse.json({
        success: true,
        tier,
        role,
        message: `✓ Sipariş (${matchedOrder.id}) başarıyla hesabınıza bağlandı ve üyeliğiniz ${tier} seviyesine yükseltildi!`,
      });
    }

    // Kod bulunamadıysa KESİNLİKLE HATA DÖNÜLÜR (Yanıltıcı kabul yapılmaz!)
    return NextResponse.json(
      {
        success: false,
        error: `Girdiğiniz "${cleanCode}" lisans veya sipariş numarası sistemde bulunamadı. Lütfen geçerli bir kod giriniz.`,
      },
      { status: 404 }
    );
  } catch (err: any) {
    console.error('License activation error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Lisans aktivasyonu sırasında bir hata oluştu.' },
      { status: 500 }
    );
  }
}
