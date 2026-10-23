import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https');
  const currentOrigin = host ? `${proto}://${host}` : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || currentOrigin;
  const redirectUri = process.env.DISCORD_REDIRECT_URI || `${currentOrigin}/api/auth/discord/callback`;

  // If Client ID is not configured yet
  if (!clientId || clientId.trim() === '') {
    return NextResponse.redirect(
      `${appUrl}/?auth_error=${encodeURIComponent('Lütfen .env.local dosyasında DISCORD_CLIENT_ID ve DISCORD_CLIENT_SECRET tanımlayın.')}`
    );
  }

  // Generate cryptographic state for CSRF defense
  const state = crypto.randomBytes(16).toString('hex');

  const scopes = ['identify', 'email', 'guilds'].join(' ');
  const discordUrl = new URL('https://discord.com/api/oauth2/authorize');
  discordUrl.searchParams.set('client_id', clientId);
  discordUrl.searchParams.set('redirect_uri', redirectUri);
  discordUrl.searchParams.set('response_type', 'code');
  discordUrl.searchParams.set('scope', scopes);
  discordUrl.searchParams.set('state', state);
  discordUrl.searchParams.set('prompt', 'consent');

  const response = NextResponse.redirect(discordUrl.toString());
  response.cookies.set('discord_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10, // 10 minutes
  });

  return response;
}
