import { NextResponse } from 'next/server';
import os from 'os';
import { serverStore } from '@/lib/serverStore';

import { verifyAdminSession } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

// CPU yüzdesi iki ölçüm arasındaki fark ile hesaplanır (gerçek ölçüm).
let prevCpu: { idle: number; total: number } | null = null;

function sampleCpu(): number {
  const cpus = os.cpus();
  let idle = 0;
  let total = 0;
  cpus.forEach((c) => {
    idle += c.times.idle;
    total += c.times.user + c.times.nice + c.times.sys + c.times.idle + c.times.irq;
  });
  let percent = 0;
  if (prevCpu) {
    const dIdle = idle - prevCpu.idle;
    const dTotal = total - prevCpu.total;
    percent = dTotal > 0 ? Math.round((1 - dIdle / dTotal) * 100) : 0;
  }
  prevCpu = { idle, total };
  return Math.max(0, Math.min(100, percent));
}

/** GET /api/admin/health — Sunucunun gerçek metrikleri. */
export async function GET(req: Request) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error || 'Yetkisiz erişim.' }, { status: 401 });
  }
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  return NextResponse.json({
    ok: true,
    cpuPercent: sampleCpu(),
    memUsedPercent: Math.round((used / total) * 100),
    memUsedMb: Math.round(used / 1024 / 1024),
    memTotalMb: Math.round(total / 1024 / 1024),
    uptimeSec: Math.round(process.uptime()),
    nodeVersion: process.version,
    cores: os.cpus().length,
    platform: `${os.platform()} ${os.arch()}`,
    siteOrders: serverStore.orders.length,
    pinsCount: Array.isArray(serverStore.pins) ? serverStore.pins.length : 0,
    discordWebhook: Boolean(process.env.DISCORD_WEBHOOK_URL),
  });
}
