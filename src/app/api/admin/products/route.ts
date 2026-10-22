import { NextResponse } from 'next/server';
import { saveStore, reloadStore } from '@/lib/serverStore';
import { verifyAdminSession } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

function formatPriceString(price: number | string): string {
  if (typeof price === 'number') {
    return price.toLocaleString('tr-TR');
  }
  return String(price).replace(/\s*TL\s*/gi, '').trim();
}

export async function GET() {
  const store = reloadStore();
  return NextResponse.json({
    success: true,
    packageConfig: store.packageConfig,
    productOverrides: store.productOverrides || {},
  });
}

export async function POST(req: Request) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error || 'Yetkisiz erişim.' }, { status: 401 });
  }

  try {
    const store = reloadStore();
    const body = await req.json();
    const product = body.product;
    const products = body.products;

    if (!store.productOverrides) {
      store.productOverrides = {};
    }
    if (!store.packageConfig) {
      store.packageConfig = {};
    }

    const itemsToUpdate = Array.isArray(products) ? products : product ? [product] : [];

    itemsToUpdate.forEach((prod: any) => {
      if (!prod?.id) return;

      const rawId = prod.id;
      const botId = prod.originalId || rawId.replace(/^prod_/, '');

      // 1. Update packageConfig for site periods
      if (prod.periods) {
        if (!store.packageConfig[botId]) {
          store.packageConfig[botId] = {} as any;
        }

        const periodKeys: ('monthly' | 'quarterly' | 'semi-annual' | 'annual')[] = [
          'monthly',
          'quarterly',
          'semi-annual',
          'annual',
        ];

        periodKeys.forEach((key) => {
          const p = prod.periods[key];
          if (p) {
            store.packageConfig[botId][key] = {
              isAvailable: p.isAvailable !== false,
              statusBadge: p.isAvailable ? '' : (p.statusBadge || 'Yakında'),
              paytrUrl: p.paytrUrl || '',
              customPrice: p.price ? formatPriceString(p.price) : undefined,
            };
          }
        });
      }

      // 2. Save full product override
      const overrideData = {
        id: prod.id,
        originalId: botId,
        name: prod.name,
        category: prod.category,
        price: prod.price,
        discountPrice: prod.discountPrice,
        badge: prod.badge,
        description: prod.description,
        features: prod.features,
        status: prod.status,
        period: prod.period,
        paytrUrl: prod.paytrUrl,
        periods: prod.periods,
        updatedAt: new Date().toLocaleDateString('tr-TR'),
      };

      if (!store.productOverrides) {
        store.productOverrides = {};
      }
      store.productOverrides[rawId] = overrideData;
      store.productOverrides[botId] = overrideData;
    });

    saveStore();

    return NextResponse.json({
      success: true,
      packageConfig: store.packageConfig,
      productOverrides: store.productOverrides,
    });
  } catch (err: any) {
    console.error('Error saving products:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Ürün kaydedilirken hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error || 'Yetkisiz erişim.' }, { status: 401 });
  }

  try {
    const store = reloadStore();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID eksik.' }, { status: 400 });
    }

    const botId = id.replace(/^prod_/, '');

    if (store.productOverrides) {
      delete store.productOverrides[id];
      delete store.productOverrides[botId];
    }
    if (store.packageConfig && store.packageConfig[botId]) {
      delete store.packageConfig[botId];
    }

    saveStore();

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
