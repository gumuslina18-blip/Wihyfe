import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'wihyfe.com';
  const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https');
  const currentOrigin = `${proto}://${host}`;

  const clientId = (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_ID !== '1557022423625371688')
    ? process.env.DISCORD_CLIENT_ID
    : '1563000519377817610';

  // Bulletproof redirectUri: always matches the active domain (e.g. https://wihyfe.com/api/auth/discord/callback)
  let redirectUri = `${currentOrigin}/api/auth/discord/callback`;
  if (process.env.DISCORD_REDIRECT_URI && process.env.DISCORD_REDIRECT_URI.includes(host)) {
    redirectUri = process.env.DISCORD_REDIRECT_URI;
  }

  // If Client ID is not configured yet
  if (!clientId || clientId.trim() === '') {
    return NextResponse.redirect(
      `${currentOrigin}/?auth_error=${encodeURIComponent('Lütfen DISCORD_CLIENT_ID ve DISCORD_CLIENT_SECRET tanımlayın.')}`
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
