import { NextRequest, NextResponse } from 'next/server';
import { signUserSession } from '@/lib/adminAuth';

interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'wihyfe.com';
  const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https');
  const currentOrigin = `${proto}://${host}`;

  const appUrl = currentOrigin;
  const clientId = (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_ID !== '1557022423625371688')
    ? process.env.DISCORD_CLIENT_ID
    : '1563000519377817610';
  const clientSecret = (process.env.DISCORD_CLIENT_SECRET && !['TqbMiV3wH9u9vW8IEAes3w9cVupr-nIc', 'b4449bec4ec294a3490f400ec2e7dd998617d800f1d0f44315fc0f7a75f9ca42'].includes(process.env.DISCORD_CLIENT_SECRET))
    ? process.env.DISCORD_CLIENT_SECRET
    : 'nmcoI1hr0D_oe_TmgbBVsmq5zQMHnf_a';

  let redirectUri = `${currentOrigin}/api/auth/discord/callback`;
  if (process.env.DISCORD_REDIRECT_URI && process.env.DISCORD_REDIRECT_URI.includes(host)) {
    redirectUri = process.env.DISCORD_REDIRECT_URI;
  }

  if (error) {
    return NextResponse.redirect(`${appUrl}/?auth_error=${encodeURIComponent('Discord yetkilendirmesi iptal edildi veya reddedildi.')}`);
  }

  if (!code) {
    return NextResponse.redirect(`${appUrl}/?auth_error=${encodeURIComponent('Yetkilendirme kodu bulunamadı.')}`);
  }

  // Validate CSRF state if cookie exists
  const savedState = request.cookies.get('discord_oauth_state')?.value;
  if (savedState && state && savedState !== state) {
    return NextResponse.redirect(`${appUrl}/?auth_error=${encodeURIComponent('Güvenlik doğrulaması başarısız oldu (CSRF koruması).')}`);
  }

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${appUrl}/?auth_error=${encodeURIComponent('Sunucu tarafında Discord Client bilgileri yapılandırılmamış.')}`);
  }

  try {
    // 1. Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errData = await tokenResponse.text();
      console.error('Discord token exchange failed:', errData);
      return NextResponse.redirect(`${appUrl}/?auth_error=${encodeURIComponent(`Discord token değişimi başarısız oldu: ${errData}`)}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch User Profile
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.redirect(`${appUrl}/?auth_error=${encodeURIComponent('Discord kullanıcı bilgileri alınamadı.')}`);
    }

    const userData = await userResponse.json();

    // 3. Fetch User Guilds to count managed servers
    let serversCount = 0;
    let userGuilds: Array<{ id: string; name: string; icon: string | null; owner: boolean }> = [];
    try {
      const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (guildsResponse.ok) {
        const guilds: DiscordGuild[] = await guildsResponse.json();
        // Count guilds where user is owner or has Administrator (0x8) or Manage Guild (0x20) permission
        const adminGuilds = guilds.filter((g) => {
          if (g.owner) return true;
          try {
            const perm = BigInt(g.permissions);
            const ADMIN_FLAG = BigInt(0x8);
            const MANAGE_GUILD_FLAG = BigInt(0x20);
            return (perm & ADMIN_FLAG) === ADMIN_FLAG || (perm & MANAGE_GUILD_FLAG) === MANAGE_GUILD_FLAG;
          } catch {
            return false;
          }
        });
        serversCount = adminGuilds.length;
        userGuilds = adminGuilds.slice(0, 15).map((g) => ({
          id: g.id,
          name: g.name,
          icon: g.icon ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png?size=64` : null,
          owner: g.owner,
        }));
      }
    } catch (gErr) {
      console.warn('Could not fetch user guilds:', gErr);
    }

    // 4. Construct Avatar URL
    let avatarUrl = '/wihyfe-icon.png';
    if (userData.avatar) {
      const isAnimated = userData.avatar.startsWith('a_');
      const ext = isAnimated ? 'gif' : 'png';
      avatarUrl = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.${ext}?size=128`;
    } else {
      const defaultIndex = userData.discriminator && userData.discriminator !== '0'
        ? parseInt(userData.discriminator) % 5
        : Number((BigInt(userData.id) >> BigInt(22)) % BigInt(6));
      avatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
    }

    const discriminatorStr = userData.discriminator && userData.discriminator !== '0'
      ? `#${userData.discriminator}`
      : '';

    const usernameStr = userData.global_name || userData.username;

    // 5. Look up existing persisted user or create new record
    const { getUserRecord, saveUserRecord } = await import('@/lib/serverStore');
    const existingRecord = getUserRecord(userData.id) || getUserRecord(usernameStr);

    saveUserRecord({
      id: userData.id,
      username: usernameStr,
      discriminator: discriminatorStr,
      avatarUrl,
      email: userData.email || '',
      serversCount: serversCount || 0,
      guilds: userGuilds,
      tier: existingRecord?.tier || 'Free',
      role: existingRecord?.role || 'Member',
      balance: existingRecord?.balance ?? 0,
      transactions: existingRecord?.transactions || [],
      orders: existingRecord?.orders || [],
      phone: existingRecord?.phone,
      company: existingRecord?.company,
      notifications: existingRecord?.notifications,
      twoFactorEnabled: existingRecord?.twoFactorEnabled,
      joinedDate: existingRecord?.joinedDate || new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }),
    });

    // 6. Create Response & Set HTTP-Only Cookie with HMAC signature
    const response = NextResponse.redirect(`${appUrl}/?auth_success=1`);
    
    const sessionToken = signUserSession({
      id: userData.id,
      username: usernameStr,
      avatarUrl,
    });

    response.cookies.set('wisp_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Clear state cookie
    response.cookies.set('discord_oauth_state', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (err) {
    console.error('Discord callback exception:', err);
    return NextResponse.redirect(`${appUrl}/?auth_error=${encodeURIComponent('Beklenmeyen bir kimlik doğrulama hatası oluştu.')}`);
  }
}
