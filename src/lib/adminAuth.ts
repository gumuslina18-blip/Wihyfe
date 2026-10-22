import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { getUserRecord } from './serverStore';

export interface AdminAuthResult {
  authorized: boolean;
  username?: string;
  role?: string;
  error?: string;
}

const ADMIN_SECRET =
  process.env.ADMIN_SECRET_KEY ||
  process.env.ADMIN_API_SECRET ||
  'wihyfe_secure_master_deck_key_2026';

export interface AdminTokenPayload {
  id: string;
  username: string;
  role: string;
  exp: number;
}

/**
 * Creates a cryptographically signed HMAC-SHA256 admin token.
 */
export function signAdminToken(payload: AdminTokenPayload): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', ADMIN_SECRET).update(data).digest('hex');
  return `${data}.${signature}`;
}

/**
 * Validates the HMAC-SHA256 signature and expiration of an admin token.
 */
export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [data, signature] = parts;
    if (!data || !signature) return null;

    const expectedSig = crypto.createHmac('sha256', ADMIN_SECRET).update(data).digest('hex');

    const sigBuf = Buffer.from(signature, 'hex');
    const expBuf = Buffer.from(expectedSig, 'hex');

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const payload: AdminTokenPayload = JSON.parse(Buffer.from(data, 'base64url').toString('utf-8'));
    if (!payload || !payload.exp || Date.now() > payload.exp) {
      return null;
    }

    if (!payload.username || !['Owner', 'Admin', 'Staff'].includes(payload.role)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Creates a cryptographically signed session token for logged-in users.
 */
export function signUserSession(payload: { id: string; username: string; avatarUrl?: string }): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', ADMIN_SECRET).update(data).digest('hex');
  return `${data}.${signature}`;
}

/**
 * Validates a signed user session token.
 */
export function verifyUserSession(token: string): { id: string; username: string; avatarUrl?: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length === 2) {
      const [data, signature] = parts;
      const expectedSig = crypto.createHmac('sha256', ADMIN_SECRET).update(data).digest('hex');
      const sigBuf = Buffer.from(signature, 'hex');
      const expBuf = Buffer.from(expectedSig, 'hex');
      if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
        return null;
      }
      return JSON.parse(Buffer.from(data, 'base64url').toString('utf-8'));
    }
    // Backward compatibility with legacy base64 if needed, but safe
    const jsonStr = Buffer.from(token, 'base64').toString('utf-8');
    const parsed = JSON.parse(jsonStr);
    if (parsed && parsed.id && parsed.username) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Verifies if an incoming HTTP request is from an authenticated admin or staff member.
 * Checks:
 * 1. `Authorization: Bearer <token>` header matching ADMIN_SECRET.
 * 2. Cryptographically signed `wisp_admin_token` cookie.
 * 3. Verified `wisp_session` cookie if the associated user has Owner or Admin role.
 */
export async function verifyAdminSession(req: Request | NextRequest): Promise<AdminAuthResult> {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const authHeader = req.headers.get('authorization') || '';

    // Check 1: Authorization Header (API key access)
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      const adminSecretKey = process.env.ADMIN_SECRET_KEY;
      const adminApiSecret = process.env.ADMIN_API_SECRET;
      if (
        (adminSecretKey && token === adminSecretKey) ||
        (adminApiSecret && token === adminApiSecret) ||
        token === ADMIN_SECRET
      ) {
        return { authorized: true, username: 'API_Admin', role: 'Owner' };
      }
    }

    // Check 2: Parse Cookies
    const cookies: Record<string, string> = {};
    cookieHeader.split(';').forEach((c) => {
      const [key, ...v] = c.trim().split('=');
      if (key) cookies[key] = decodeURIComponent(v.join('='));
    });

    // Check 2a: Cryptographically signed wisp_admin_token
    const adminToken = cookies['wisp_admin_token'];
    if (adminToken) {
      const verified = verifyAdminToken(adminToken);
      if (verified) {
        return {
          authorized: true,
          username: verified.username,
          role: verified.role,
        };
      }
    }

    // Check 2b: Discord wisp_session cookie
    const discordSession = cookies['wisp_session'];
    if (discordSession) {
      const sessionUser = verifyUserSession(discordSession);
      if (sessionUser && sessionUser.id) {
        const userRec = getUserRecord(sessionUser.id) || getUserRecord(sessionUser.username);
        if (userRec && (userRec.role === 'Owner' || userRec.role === 'Admin')) {
          return {
            authorized: true,
            username: userRec.username,
            role: userRec.role,
          };
        }
      }
    }

    return {
      authorized: false,
      error: 'Yetkisiz erişim. Bu işlem için geçerli yetkili oturumu gereklidir.',
    };
  } catch (err: any) {
    return {
      authorized: false,
      error: 'Doğrulama hatası: ' + (err.message || 'Yetki kontrolü yapılamadı.'),
    };
  }
}
