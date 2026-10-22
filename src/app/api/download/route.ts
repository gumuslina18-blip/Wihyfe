import { NextResponse } from 'next/server';

/**
 * POST /api/download
 * Infrastructure for PIN verification and client download dispatch.
 * Easily extensible for real file streaming, token verification, or CDN signing.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pin } = body;

    if (!pin || typeof pin !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Lütfen 6 haneli oturum PIN kodunu eksiksiz girin.' },
        { status: 400 }
      );
    }

    const cleanPin = pin.trim().toUpperCase();

    if (cleanPin.length !== 6) {
      return NextResponse.json(
        { success: false, error: 'Tarama PIN kodu tam 6 karakter olmalıdır.' },
        { status: 400 }
      );
    }

    // PIN Verification Logic: Only allow PINs generated in the Admin Panel
    const { reloadStore, saveStore } = await import('@/lib/serverStore');
    const store = reloadStore();
    const allPins = Array.isArray(store.pins) ? store.pins : [];

    const matchedPin = allPins.find(
      (p: any) => p.pin && p.pin.toUpperCase() === cleanPin
    );

    if (!matchedPin) {
      return NextResponse.json(
        {
          success: false,
          error: `Geçersiz PIN ("${cleanPin}"). İstemci yalnızca yetkili panelinden oluşturulmuş doğrulanmış PIN kodları ile indirilebilir.`,
        },
        { status: 403 }
      );
    }

    // Son kullanma tarihi kontrolü (gg.aa.yyyy)
    const expMatch = typeof matchedPin.expiresAt === 'string' ? matchedPin.expiresAt.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/) : null;
    if (expMatch && matchedPin.status === 'Aktif') {
      const endOfDay = new Date(Number(expMatch[3]), Number(expMatch[2]) - 1, Number(expMatch[1]), 23, 59, 59).getTime();
      if (Date.now() > endOfDay) {
        matchedPin.status = 'Süresi Doldu';
        saveStore();
      }
    }

    if (matchedPin.status !== 'Aktif') {
      return NextResponse.json(
        {
          success: false,
          error: `Bu PIN kodu kullanılamaz durumda (Durum: ${matchedPin.status}). Lütfen yetkilinizden yeni bir indirme PIN'i talep edin.`,
        },
        { status: 403 }
      );
    }

    if (matchedPin.currentUses >= matchedPin.maxUses) {
      matchedPin.status = 'Kullanıldı';
      saveStore();
      return NextResponse.json(
        {
          success: false,
          error: 'Bu PIN kodunun maksimum indirme kotası dolmuştur.',
        },
        { status: 403 }
      );
    }

    // Valid PIN: Increment usage count & persist
    matchedPin.currentUses = (matchedPin.currentUses || 0) + 1;
    const forwarded = req.headers.get('x-forwarded-for');
    const clientIp = (forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip')) || 'bilinmiyor';
    if (!Array.isArray(matchedPin.usageLog)) matchedPin.usageLog = [];
    matchedPin.usageLog.unshift({
      at: new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      ip: clientIp,
    });
    matchedPin.usageLog = matchedPin.usageLog.slice(0, 50);
    if (matchedPin.currentUses >= matchedPin.maxUses) {
      matchedPin.status = 'Kullanıldı';
    }
    saveStore();

    // Success response payload
    return NextResponse.json({
      success: true,
      message: `PIN ${cleanPin} doğrulandı! [${matchedPin.targetApp}] lisansı ile istemci indirme işlemi başlatılıyor...`,
      pin: cleanPin,
      fileName: 'Wihyfe_Client.exe',
      downloadUrl: `/api/download/file?token=${encodeURIComponent(cleanPin)}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Download verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.' },
      { status: 500 }
    );
  }
}
