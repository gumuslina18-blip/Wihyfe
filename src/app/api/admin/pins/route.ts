import { NextResponse } from 'next/server';
import { saveStore, reloadStore } from '@/lib/serverStore';
import { verifyAdminSession } from '@/lib/adminAuth';
import { AdminPin } from '@/types/admin';

export const dynamic = 'force-dynamic';

function getPins(): AdminPin[] {
  const store = reloadStore();
  if (!store.pins || !Array.isArray(store.pins)) {
    store.pins = [];
    saveStore();
  }
  return store.pins as AdminPin[];
}

export async function GET(req: Request) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error || 'Yetkisiz erişim.' }, { status: 401 });
  }

  try {
    const pins = getPins();
    return NextResponse.json({ success: true, pins });
  } catch (error) {
    console.error('Failed to get pins:', error);
    return NextResponse.json({ success: false, error: 'PIN listesi alınamadı' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error || 'Yetkisiz erişim.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { pin, targetApp, maxUses, expiresAt, assignedUser, note, createdBy } = body;

    if (!pin || typeof pin !== 'string') {
      return NextResponse.json({ success: false, error: 'PIN kodu zorunludur' }, { status: 400 });
    }

    const cleanPin = pin.trim().toUpperCase();
    const pins = getPins();

    // Check if PIN already exists
    if (pins.some((p) => p.pin === cleanPin)) {
      return NextResponse.json({ success: false, error: `PIN "${cleanPin}" zaten mevcut.` }, { status: 400 });
    }

    const newPinObj: AdminPin = {
      id: `pin_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      pin: cleanPin,
      targetApp: targetApp && typeof targetApp === 'string' ? targetApp.trim() : 'Discord Full Pack - 1 Aylık',
      maxUses: Number(maxUses) || 1,
      currentUses: 0,
      status: 'Aktif',
      createdBy: createdBy || 'lunaalvine',
      createdAt: new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      expiresAt: expiresAt || '31.12.2026',
      assignedUser: assignedUser || undefined,
      note: note || undefined,
    };

    pins.unshift(newPinObj);
    const store = reloadStore();
    store.pins = pins;
    saveStore();

    return NextResponse.json({ success: true, pin: newPinObj });
  } catch (error) {
    console.error('Failed to create pin:', error);
    return NextResponse.json({ success: false, error: 'PIN oluşturulurken hata oluştu' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error || 'Yetkisiz erişim.' }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();
    const allowed = ['Aktif', 'İptal'];
    if (!id || !allowed.includes(status)) {
      return NextResponse.json({ success: false, error: 'Geçersiz istek' }, { status: 400 });
    }
    const pins = getPins();
    const target = pins.find((p) => p.id === id || p.pin === id);
    if (!target) {
      return NextResponse.json({ success: false, error: 'PIN bulunamadı' }, { status: 404 });
    }
    target.status = status;
    const store = reloadStore();
    store.pins = pins;
    saveStore();
    return NextResponse.json({ success: true, pin: target });
  } catch (error) {
    console.error('Failed to patch pin:', error);
    return NextResponse.json({ success: false, error: 'PIN güncellenemedi' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error || 'Yetkisiz erişim.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const pinId = searchParams.get('id');

    if (!pinId) {
      return NextResponse.json({ success: false, error: 'PIN ID belirtilmedi' }, { status: 400 });
    }

    const store = reloadStore();
    const pins = Array.isArray(store.pins) ? store.pins : [];
    store.pins = pins.filter((p: any) => p.id !== pinId && p.pin !== pinId);
    saveStore();

    return NextResponse.json({ success: true, message: 'PIN silindi' });
  } catch (error) {
    console.error('Failed to delete pin:', error);
    return NextResponse.json({ success: false, error: 'PIN silinemedi' }, { status: 500 });
  }
}
