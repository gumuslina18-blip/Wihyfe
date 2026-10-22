import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/notify — Yetkili kanalına Discord webhook bildirimi gönderir.
 * Yalnızca yetkili oturumuyla veya ADMIN_API_SECRET ile çağrılabilir.
 */
export async function POST(req: Request) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error || 'Yetkisiz erişim.' }, { status: 401 });
  }

  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) {
    return NextResponse.json({ success: false, configured: false, error: 'DISCORD_WEBHOOK_URL tanımlı değil.' });
  }
  try {
    const { title, message } = await req.json();
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Wihyfe OS',
        embeds: [
          {
            title: String(title || 'Bildirim').slice(0, 200),
            description: String(message || '').slice(0, 1800),
            color: 0xa855f7,
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });
    return NextResponse.json({ success: res.ok, configured: true });
  } catch (e) {
    return NextResponse.json({ success: false, configured: true, error: 'Webhook gönderilemedi.' }, { status: 500 });
  }
}
