import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { reloadStore } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';

/**
 * GET /api/download/file?token=...
 * Serves the real client executable or streams the binary package from public/downloads.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = (searchParams.get('token') || '').trim().toUpperCase();

    if (!token) {
      return new NextResponse('Erişim Reddedildi: İndirme belirteci (token) eksik.', { status: 400 });
    }

    // 1. Verify token against real PIN database
    const store = reloadStore();
    const allPins = Array.isArray(store.pins) ? store.pins : [];
    const matchedPin = allPins.find((p: any) => p.pin && p.pin.toUpperCase() === token);

    if (!matchedPin) {
      return new NextResponse('Erişim Reddedildi: Geçersiz veya yetkisiz indirme belirteci.', { status: 403 });
    }

    // 2. Check for configured external download URL (e.g. CDN or cloud storage)
    if (process.env.CLIENT_DOWNLOAD_URL && process.env.CLIENT_DOWNLOAD_URL.startsWith('http')) {
      return NextResponse.redirect(process.env.CLIENT_DOWNLOAD_URL);
    }

    // 3. Check for real binary on disk in public/downloads
    const possibleFiles = [
      path.join(process.cwd(), 'public', 'downloads', 'Wihyfe_Client.exe'),
      path.join(process.cwd(), 'public', 'downloads', 'Wihyfe_Client.zip'),
      path.join(process.cwd(), 'public', 'downloads', 'wihyfe-client.exe'),
    ];

    for (const filePath of possibleFiles) {
      if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);
        const fileBuffer = fs.readFileSync(filePath);
        const fileName = path.basename(filePath);
        const ext = path.extname(filePath).toLowerCase();

        const contentType =
          ext === '.exe'
            ? 'application/vnd.microsoft.portable-executable'
            : ext === '.zip'
            ? 'application/zip'
            : 'application/octet-stream';

        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="${fileName}"`,
            'Content-Length': stat.size.toString(),
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          },
        });
      }
    }

    // 4. Fallback if actual .exe hasn't been placed in public/downloads yet:
    // Generate a valid executable batch wrapper configured with the user's validated session token
    const setupContent = `@echo off
chcp 65001 > nul
title Wihyfe Client Loader
color 0b
echo ========================================================
echo               WIHYFE CLIENT INITIALIZER                 
echo ========================================================
echo.
echo [OK] Lisans ve Guvenlik Dogrulamasi Basarili!
echo [OK] Oturum Belirteci: ${token}
echo [OK] Lisans Tipi: ${matchedPin.targetApp || 'Plus+'}
echo.
echo Client dosyasi yukleniyor...
echo Lutfen sunucu sahibinin public/downloads/Wihyfe_Client.exe dosyasini 
echo derleyip sunucuya yuklemesini bekleyiniz veya Discord uzerinden 
echo talep olusturunuz.
echo.
echo https://discord.gg/SbrKk6Q87H
echo ========================================================
pause
`;

    return new NextResponse(setupContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/x-msdownload',
        'Content-Disposition': `attachment; filename="Wihyfe_Launcher_${token}.bat"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (err) {
    console.error('Download stream error:', err);
    return new NextResponse('İstemci indirilirken bir sunucu hatası oluştu.', { status: 500 });
  }
}
