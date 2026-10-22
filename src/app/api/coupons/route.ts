import { NextRequest, NextResponse } from 'next/server';
import { getCoupons, validateCoupon, applyCouponUsage, saveCoupon, deleteCoupon } from '@/lib/serverStore';
import { verifyAdminSession } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 401 });
  }

  try {
    const coupons = getCoupons();
    return NextResponse.json({ success: true, coupons });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, cartTotal, action } = body;

    if (!code) {
      return NextResponse.json({ success: false, error: 'Kupon kodu belirtilmedi.' }, { status: 400 });
    }

    const total = Number(cartTotal) || 0;
    const result = validateCoupon(code, total);

    if (!result.valid) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    if (action === 'apply') {
      applyCouponUsage(code);
    }

    return NextResponse.json({
      success: true,
      coupon: result.coupon,
      discountAmount: result.discountAmount,
      finalTotal: result.finalTotal,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// Admin: Save / Create Coupon
export async function PUT(req: NextRequest) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const saved = saveCoupon(body);
    return NextResponse.json({ success: true, coupon: saved, coupons: getCoupons() });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// Admin: Delete Coupon
export async function DELETE(req: NextRequest) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code') || searchParams.get('id');
    if (!code) {
      return NextResponse.json({ success: false, error: 'Kupon kodu belirtilmedi.' }, { status: 400 });
    }

    deleteCoupon(code);
    return NextResponse.json({ success: true, coupons: getCoupons() });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
