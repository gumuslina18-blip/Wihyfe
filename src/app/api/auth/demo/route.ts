import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { success: false, error: 'Demo modu devre dışı bırakılmıştır. Lütfen Discord ile giriş yapınız.' },
    { status: 403 }
  );
}
