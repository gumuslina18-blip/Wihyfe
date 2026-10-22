'use client';

import React from 'react';
import { useAdmin, ALL_TABS } from '@/context/AdminContext';
import { RoleType } from '@/types/admin';
import { RoleSymbol, IconLock, IconEye, IconRefresh } from '../AdminIcons';

const ROLES: RoleType[] = ['Owner', 'Admin', 'Staff', 'Master', 'VIP', 'Müşteri'];

export default function PermissionsView() {
  const { permissions, setPermission, resetPermissions, viewAsRole, setViewAsRole, showToast, logAudit, currentStaff } = useAdmin();

  const toggle = (role: RoleType, tab: (typeof ALL_TABS)[number]['id'], allowed: boolean) => {
    if (tab === 'permissions' && role !== 'Owner' && allowed) {
      if (!window.confirm('Yetki matrisini düzenleme hakkı Owner dışındaki bir role verilsin mi?')) return;
    }
    setPermission(role, tab, allowed);
    logAudit('yetki', 'Yetki matrisi değişti', `${role} → ${ALL_TABS.find((t) => t.id === tab)?.label}: ${allowed ? 'İzin verildi' : 'Kaldırıldı'}`);
  };

  return (
    <div className="admin-view-body">
      <div className="admin-card">
        <div className="admin-hud-corner admin-hud-corner-tl" aria-hidden="true" />
        <div className="admin-hud-corner admin-hud-corner-tr" aria-hidden="true" />
        <div className="admin-hud-corner admin-hud-corner-bl" aria-hidden="true" />
        <div className="admin-hud-corner admin-hud-corner-br" aria-hidden="true" />

        <div className="admin-card-header">
          <div className="admin-card-title-group">
            <h2 className="admin-card-title">
              <IconLock size={18} color="var(--admin-accent-purple)" />
              <span>Rol Bazlı Yetki Matrisi</span>
            </h2>
            <span className="admin-card-desc">
              Hangi rolün hangi panel sayfasını görebileceğini belirleyin. Owner her zaman tam yetkilidir ve değiştirilemez.
              Bu kurallar panelin arayüzünde uygulanır; sunucu tarafı kimlik doğrulaması ayrıca yapılmalıdır.
            </span>
          </div>
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() => {
              resetPermissions();
              logAudit('yetki', 'Yetki matrisi sıfırlandı', 'Varsayılan izinlere dönüldü');
              showToast('Yetkiler varsayılana döndürüldü.', 'info');
            }}
          >
            <IconRefresh size={14} /> <span>Varsayılana Dön</span>
          </button>
        </div>

        <div className="admin-table-container">
          <table className="admin-table admin-perm-table">
            <thead>
              <tr>
                <th>Sayfa</th>
                {ROLES.map((r) => (
                  <th key={r} style={{ textAlign: 'center' }}>
                    <span className={`role-badge ${r === 'Müşteri' ? 'musteri' : r.toLowerCase()}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <RoleSymbol role={r} size={12} />
                      {r}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_TABS.map((tab) => (
                <tr key={tab.id}>
                  <td style={{ color: '#fff', fontWeight: 600 }}>{tab.label}</td>
                  {ROLES.map((r) => {
                    const allowed = r === 'Owner' ? true : (permissions[r] || []).includes(tab.id);
                    return (
                      <td key={r} style={{ textAlign: 'center' }}>
                        <label className={`admin-switch ${r === 'Owner' ? 'locked' : ''}`} title={r === 'Owner' ? 'Owner değiştirilemez' : undefined}>
                          <input
                            type="checkbox"
                            checked={allowed}
                            disabled={r === 'Owner'}
                            onChange={(e) => toggle(r, tab.id, e.target.checked)}
                            aria-label={`${r} - ${tab.label}`}
                          />
                          <span className="admin-switch-track" />
                        </label>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title-group">
            <h3 className="admin-card-title" style={{ fontSize: '0.95rem' }}>
              <IconEye size={16} color="var(--admin-accent-cyan)" />
              <span>Rol Olarak Önizle</span>
            </h3>
            <span className="admin-card-desc">
              Paneli seçtiğiniz rolün gözünden görüntüleyin. Oturum açan yetkili ({currentStaff.username}) değişmez; yalnızca görünen sayfalar sınırlanır.
            </span>
          </div>
        </div>
        <div className="admin-timeframe-pills" style={{ flexWrap: 'wrap', alignSelf: 'flex-start' }}>
          {ROLES.filter((r) => r !== 'Owner').map((r) => (
            <button
              key={r}
              type="button"
              className={`admin-tf-btn ${viewAsRole === r ? 'active' : ''}`}
              onClick={() => setViewAsRole(r)}
            >
              {r} olarak gör
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
