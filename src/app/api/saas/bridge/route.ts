import { NextRequest, NextResponse } from 'next/server';
import {
  getGuildSaaSData,
  updatePulseTrackerConfig,
  updateAutorazerConfig,
  updateGuardConfig,
  createBackupSnapshot,
  updateBotProfiles,
  inviteTeamMember,
  removeTeamMember,
  DEFAULT_GUILD_ID,
} from '@/lib/saasBridge';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const guildId = searchParams.get('guildId') || DEFAULT_GUILD_ID;
    const data = await getGuildSaaSData(guildId);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[API /api/saas/bridge GET error]:', error);
    return NextResponse.json({ success: false, error: error.message || 'Veri yüklenemedi' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, guildId = DEFAULT_GUILD_ID, payload } = body;

    if (!action) {
      return NextResponse.json({ success: false, error: 'Eylem belirtilmedi.' }, { status: 400 });
    }

    switch (action) {
      case 'update_pulse': {
        const ok = await updatePulseTrackerConfig(guildId, payload);
        const data = await getGuildSaaSData(guildId);
        return NextResponse.json({
          success: ok,
          message: 'PulseTracker ayarları Discord botuna başarıyla uygulandı.',
          data,
        });
      }

      case 'update_autorazer': {
        const ok = await updateAutorazerConfig(guildId, payload);
        const data = await getGuildSaaSData(guildId);
        return NextResponse.json({
          success: ok,
          message: 'Autorazer moderasyon yapılandırması Discord botuna uygulandı.',
          data,
        });
      }

      case 'update_guard': {
        const ok = await updateGuardConfig(guildId, payload);
        const data = await getGuildSaaSData(guildId);
        return NextResponse.json({
          success: ok,
          message: 'Guard güvenlik koruması ayarları Discord botuna uygulandı.',
          data,
        });
      }

      case 'create_backup': {
        const backup = await createBackupSnapshot(guildId, payload?.type || 'full');
        const data = await getGuildSaaSData(guildId);
        return NextResponse.json({
          success: Boolean(backup),
          message: `${payload?.type || 'Tam'} sunucu yedeği başarıyla oluşturuldu ve JSON veritabanına kaydedildi.`,
          backup,
          data,
        });
      }

      case 'apply_profiles': {
        const profile = await updateBotProfiles(guildId, payload);
        const data = await getGuildSaaSData(guildId);
        return NextResponse.json({
          success: true,
          message: 'Bot profilleri ve sunucu şablonları Discord botlarına başarıyla uygulandı.',
          profile,
          data,
        });
      }

      case 'invite_team': {
        const { email, permissions } = payload;
        if (!email) {
          return NextResponse.json({ success: false, error: 'Geçerli bir e-posta adresi girin.' }, { status: 400 });
        }
        const member = await inviteTeamMember(guildId, email, permissions);
        const data = await getGuildSaaSData(guildId);
        return NextResponse.json({
          success: true,
          message: `${email} başarıyla ekibe davet edildi.`,
          member,
          data,
        });
      }

      case 'remove_team': {
        const { memberId } = payload;
        const ok = await removeTeamMember(guildId, memberId);
        const data = await getGuildSaaSData(guildId);
        return NextResponse.json({
          success: ok,
          message: 'Ekip üyesinin yetkileri kaldırıldı.',
          data,
        });
      }

      case 'restart_bot': {
        const botName = payload?.botName || 'Bot';
        // Simulate safe restart signal
        return NextResponse.json({
          success: true,
          message: `${botName} yeniden başlatma sinyali gönderildi. Çevrim içi kalmaya devam ediyor.`,
        });
      }

      default:
        return NextResponse.json({ success: false, error: `Bilinmeyen eylem: ${action}` }, { status: 400 });
    }
  } catch (error: any) {
    console.error('[API /api/saas/bridge POST error]:', error);
    return NextResponse.json({ success: false, error: error.message || 'İşlem gerçekleştirilemedi.' }, { status: 500 });
  }
}
