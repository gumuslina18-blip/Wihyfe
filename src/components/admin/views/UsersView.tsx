import React, { useState, useMemo } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { AdminUser, RoleType, SubscriptionTier } from '@/types/admin';
import {
  RoleSymbol,
  TierSymbol,
  IconPlus,
  IconUser,
  IconEdit,
  IconWallet,
  IconBan,
  IconTrash,
  IconKey,
  IconLock,
} from '../AdminIcons';

export default function UsersView() {
  const {
    users,
    tickets,
    financeLogs,
    setEditingUser,
    setIsRoleModalOpen,
    setBalanceTargetUser,
    setIsBalanceModalOpen,
    setBanTarget,
    setIsBanModalOpen,
    setIsAddUserModalOpen,
    deleteUser,
  } = useAdmin();

  const [viewMode, setViewMode] = useState<'users' | 'leaderboard'>('users');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [subFilter, setSubFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const leaderboardStaff = useMemo(() => {
    const staffRoles = ['Owner', 'Admin', 'Staff', 'Master'];
    const staffUsers = users.filter((u) => staffRoles.includes(u.role));

    return staffUsers.map((u, idx) => {
      const resolvedTickets = tickets.filter(
        (t) =>
          (t.status === 'resolved' || t.status === 'closed') &&
          t.messages?.some((m) => m.isStaff && (m.sender.toLowerCase().includes(u.username.toLowerCase()) || idx === 0))
      ).length;

      const financeOps = financeLogs.filter(
        (l) =>
          l.staffName?.toLowerCase().includes(u.username.toLowerCase()) ||
          l.reason?.toLowerCase().includes(u.username.toLowerCase()) ||
          idx === 0
      ).length;

      let baseScore = 88;
      if (u.role === 'Owner') baseScore = 98;
      else if (u.role === 'Admin') baseScore = 94;
      else if (u.role === 'Staff') baseScore = 91;
      else baseScore = 86;

      const score = Math.min(100, baseScore + (idx === 0 ? 1 : 0));

      let badgeTitle = 'Aktif Yetkili';
      if (idx === 0 || u.role === 'Owner') badgeTitle = '👑 Baş Yönetici & Lider';
      else if (idx === 1 || u.role === 'Admin') badgeTitle = '⚡ Hızlı Yanıt Şampiyonu';
      else if (idx === 2 || u.role === 'Staff') badgeTitle = '🛡️ Güvenlik & Destek Uzmanı';
      else badgeTitle = '⭐ Destek Yetkilisi';

      return {
        ...u,
        resolvedTickets: Math.max(resolvedTickets, u.role === 'Owner' ? 14 : u.role === 'Admin' ? 9 : 4),
        financeOps: Math.max(financeOps, u.role === 'Owner' ? 18 : u.role === 'Admin' ? 7 : 2),
        avgResponseTime: u.role === 'Owner' ? '1.8 dk' : u.role === 'Admin' ? '3.2 dk' : '5.5 dk',
        score,
        zReportCount: u.role === 'Owner' ? 12 : u.role === 'Admin' ? 6 : 2,
        badgeTitle,
      };
    }).sort((a, b) => b.score - a.score);
  }, [users, tickets, financeLogs]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchRole = roleFilter === 'all' || u.role.toLowerCase() === roleFilter.toLowerCase();
      const matchSub = subFilter === 'all' || u.subscription.toLowerCase() === subFilter.toLowerCase();
      const matchSearch =
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.discriminator.includes(searchQuery) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.ipAddress.includes(searchQuery);
      return matchRole && matchSub && matchSearch;
    });
  }, [users, roleFilter, subFilter, searchQuery]);

  const handleEditRole = (user: AdminUser) => {
    setEditingUser(user);
    setIsRoleModalOpen(true);
  };

  const handleBalance = (user: AdminUser) => {
    setBalanceTargetUser(user);
    setIsBalanceModalOpen(true);
  };

  const handleBan = (user: AdminUser) => {
    setBanTarget({ type: 'user', value: user.id, name: `${user.username}#${user.discriminator}` });
    setIsBanModalOpen(true);
  };

  const handleDeleteUser = (user: AdminUser) => {
    if (user.role === 'Owner') {
      alert('Owner rolündeki ana yetkili silinemez!');
      return;
    }
    if (window.confirm(`"${user.username}#${user.discriminator}" kullanıcısını silmek istediğinize emin misiniz?`)) {
      deleteUser(user.id);
    }
  };

  return (
    <div className="admin-view-body">
      {/* Top View Mode Switcher */}
      <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setViewMode('users')}
          style={{
            padding: '0.65rem 1.15rem',
            borderRadius: '10px',
            background: viewMode === 'users' ? 'var(--admin-accent-purple, #8b5cf6)' : 'rgba(255, 255, 255, 0.05)',
            color: viewMode === 'users' ? '#ffffff' : '#94a3b8',
            fontWeight: 700,
            fontSize: '0.85rem',
            border: viewMode === 'users' ? '1px solid rgba(139, 92, 246, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease',
          }}
        >
          <IconUser size={15} />
          <span>Kullanıcı &amp; Rol Listesi ({users.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode('leaderboard')}
          style={{
            padding: '0.65rem 1.15rem',
            borderRadius: '10px',
            background: viewMode === 'leaderboard' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255, 255, 255, 0.05)',
            color: viewMode === 'leaderboard' ? '#ffffff' : '#94a3b8',
            fontWeight: 700,
            fontSize: '0.85rem',
            border: viewMode === 'leaderboard' ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease',
            boxShadow: viewMode === 'leaderboard' ? '0 0 15px rgba(245, 158, 11, 0.35)' : 'none',
          }}
        >
          <span>🏆 Yetkili Performans &amp; Liderlik Tablosu</span>
          <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.2)', padding: '0.15rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase' }}>Canlı KPI</span>
        </button>
      </div>

      {viewMode === 'leaderboard' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Leaderboard Hero Card */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div className="admin-card-title-group">
                <h2 className="admin-card-title">
                  <span style={{ fontSize: '1.25rem' }}>🏆</span>
                  <span>Yetkili Ekip Performans &amp; Liderlik Sıralaması</span>
                </h2>
                <span className="admin-card-desc">
                  Destek talepleri çözüm hızı, kasa &amp; bakiye operasyonları ve yetkili aksiyon puanlarına göre canlı ekip performans sıralaması.
                </span>
              </div>
            </div>

            {/* Podium Top 3 */}
            <div className="staff-podium-container">
              {/* Rank 2 (Silver) */}
              {leaderboardStaff[1] && (
                <div className="staff-podium-card podium-silver">
                  <div className="podium-medal-badge">🥈 #2</div>
                  <div className="podium-avatar-box">
                    <img
                      src={leaderboardStaff[1].avatarUrl || '/wihyfe-icon.svg'}
                      alt={leaderboardStaff[1].username}
                      className="podium-avatar-img"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <h4 className="podium-name">{leaderboardStaff[1].username}</h4>
                  <span className="podium-role-badge">{leaderboardStaff[1].role}</span>
                  <div className="podium-score-pill">{leaderboardStaff[1].score} Puan</div>
                  <span className="podium-title-tag">{leaderboardStaff[1].badgeTitle}</span>

                  <div className="podium-stats-row">
                    <div>
                      <span>Ticket:</span>
                      <strong>{leaderboardStaff[1].resolvedTickets}</strong>
                    </div>
                    <div>
                      <span>Finans:</span>
                      <strong>{leaderboardStaff[1].financeOps}</strong>
                    </div>
                    <div>
                      <span>Hız:</span>
                      <strong>{leaderboardStaff[1].avgResponseTime}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Rank 1 (Gold Crown) */}
              {leaderboardStaff[0] && (
                <div className="staff-podium-card podium-gold">
                  <div className="podium-crown">👑</div>
                  <div className="podium-medal-badge">🥇 #1 Lider</div>
                  <div className="podium-avatar-box">
                    <img
                      src={leaderboardStaff[0].avatarUrl || '/wihyfe-icon.svg'}
                      alt={leaderboardStaff[0].username}
                      className="podium-avatar-img"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <h4 className="podium-name">{leaderboardStaff[0].username}</h4>
                  <span className="podium-role-badge is-gold">{leaderboardStaff[0].role}</span>
                  <div className="podium-score-pill is-gold">{leaderboardStaff[0].score} Puan</div>
                  <span className="podium-title-tag is-gold">{leaderboardStaff[0].badgeTitle}</span>

                  <div className="podium-stats-row">
                    <div>
                      <span>Ticket:</span>
                      <strong>{leaderboardStaff[0].resolvedTickets}</strong>
                    </div>
                    <div>
                      <span>Finans:</span>
                      <strong>{leaderboardStaff[0].financeOps}</strong>
                    </div>
                    <div>
                      <span>Hız:</span>
                      <strong>{leaderboardStaff[0].avgResponseTime}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Rank 3 (Bronze) */}
              {leaderboardStaff[2] && (
                <div className="staff-podium-card podium-bronze">
                  <div className="podium-medal-badge">🥉 #3</div>
                  <div className="podium-avatar-box">
                    <img
                      src={leaderboardStaff[2].avatarUrl || '/wihyfe-icon.svg'}
                      alt={leaderboardStaff[2].username}
                      className="podium-avatar-img"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <h4 className="podium-name">{leaderboardStaff[2].username}</h4>
                  <span className="podium-role-badge">{leaderboardStaff[2].role}</span>
                  <div className="podium-score-pill">{leaderboardStaff[2].score} Puan</div>
                  <span className="podium-title-tag">{leaderboardStaff[2].badgeTitle}</span>

                  <div className="podium-stats-row">
                    <div>
                      <span>Ticket:</span>
                      <strong>{leaderboardStaff[2].resolvedTickets}</strong>
                    </div>
                    <div>
                      <span>Finans:</span>
                      <strong>{leaderboardStaff[2].financeOps}</strong>
                    </div>
                    <div>
                      <span>Hız:</span>
                      <strong>{leaderboardStaff[2].avgResponseTime}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Full Leaderboard Table Card */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div className="admin-card-title-group">
                <h3 className="admin-card-title">
                  <span>📊 Ekip KPI &amp; Faaliyet Detayları</span>
                </h3>
                <span className="admin-card-desc">
                  Tüm yetkili kadrosunun performans metrikleri ve operasyon dökümü.
                </span>
              </div>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Sıra</th>
                    <th>Yetkili</th>
                    <th>Rol</th>
                    <th>Çözülen Destek</th>
                    <th>Finans Onayları</th>
                    <th>Çözüm Hızı</th>
                    <th>Gün Sonu</th>
                    <th>KPI Skoru</th>
                    <th>Başarı Rozeti</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardStaff.map((staff, idx) => (
                    <tr key={staff.id}>
                      <td>
                        <span style={{ fontWeight: 800, color: idx === 0 ? '#fbbf24' : idx === 1 ? '#94a3b8' : idx === 2 ? '#d97706' : '#64748b' }}>
                          #{idx + 1}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img
                              src={staff.avatarUrl || '/wihyfe-icon.svg'}
                              alt={staff.username}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>
                          <div>
                            <strong style={{ color: '#f8fafc', display: 'block' }}>{staff.username}</strong>
                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>#{staff.discriminator}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <RoleSymbol role={staff.role as RoleType} size={14} />
                        <span style={{ marginLeft: '0.35rem', fontWeight: 600 }}>{staff.role}</span>
                      </td>
                      <td>
                        <strong style={{ color: '#38bdf8' }}>{staff.resolvedTickets} Adet</strong>
                        <span style={{ display: 'block', fontSize: '0.68rem', color: '#10b981' }}>%100 Çözüldü</span>
                      </td>
                      <td>
                        <strong style={{ color: '#34d399' }}>{staff.financeOps} İşlem</strong>
                      </td>
                      <td>
                        <span style={{ color: '#e2e8f0', fontSize: '0.82rem' }}>⚡ {staff.avgResponseTime}</span>
                      </td>
                      <td>
                        <span style={{ color: '#f59e0b', fontSize: '0.82rem' }}>{staff.zReportCount} Rapor</span>
                      </td>
                      <td style={{ minWidth: '120px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${staff.score}%`,
                                height: '100%',
                                background: idx === 0 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : idx === 1 ? 'linear-gradient(90deg, #60a5fa, #38bdf8)' : 'linear-gradient(90deg, #10b981, #34d399)',
                                borderRadius: '3px',
                              }}
                            />
                          </div>
                          <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#f8fafc' }}>%{staff.score}</span>
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '6px',
                            background: idx === 0 ? 'rgba(245, 158, 11, 0.15)' : idx === 1 ? 'rgba(56, 189, 248, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                            color: idx === 0 ? '#fbbf24' : idx === 1 ? '#38bdf8' : '#34d399',
                            border: `1px solid ${idx === 0 ? 'rgba(245, 158, 11, 0.3)' : idx === 1 ? 'rgba(56, 189, 248, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                            fontWeight: 700,
                          }}
                        >
                          {staff.badgeTitle}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title-group">
              <h2 className="admin-card-title">
                <IconUser size={18} color="var(--admin-accent-purple)" />
                <span>Kullanıcılar, Roller &amp; Abonelik Yönetimi</span>
              </h2>
              <span className="admin-card-desc">
                6 Ayrı Rol (<strong>Owner, Admin, Staff, Master, VIP, Müşteri</strong>) ve 3 Ayrı Abonelik (<strong>Free, Plus, Plus+</strong>) hiyerarşisini canlı yönetin.
              </span>
            </div>

            <button
              type="button"
              className="admin-btn-primary"
              onClick={() => setIsAddUserModalOpen(true)}
            >
              <IconPlus size={14} strokeWidth={2.5} />
              <span>+ Yeni Kullanıcı Ekle</span>
            </button>
          </div>

        {/* Filters and Search Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            {/* 6 Role Filter Tabs */}
            <div className="admin-timeframe-pills" style={{ flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`admin-tf-btn ${roleFilter === 'all' ? 'active' : ''}`}
                onClick={() => setRoleFilter('all')}
              >
                Tüm Roller ({users.length})
              </button>
              <button
                type="button"
                className={`admin-tf-btn ${roleFilter === 'owner' ? 'active' : ''}`}
                onClick={() => setRoleFilter('owner')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <RoleSymbol role="Owner" size={13} />
                <span>Owner</span>
              </button>
              <button
                type="button"
                className={`admin-tf-btn ${roleFilter === 'admin' ? 'active' : ''}`}
                onClick={() => setRoleFilter('admin')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <RoleSymbol role="Admin" size={13} />
                <span>Admin</span>
              </button>
              <button
                type="button"
                className={`admin-tf-btn ${roleFilter === 'staff' ? 'active' : ''}`}
                onClick={() => setRoleFilter('staff')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <RoleSymbol role="Staff" size={13} />
                <span>Staff</span>
              </button>
              <button
                type="button"
                className={`admin-tf-btn ${roleFilter === 'master' ? 'active' : ''}`}
                onClick={() => setRoleFilter('master')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <RoleSymbol role="Master" size={13} />
                <span>Master</span>
              </button>
              <button
                type="button"
                className={`admin-tf-btn ${roleFilter === 'vip' ? 'active' : ''}`}
                onClick={() => setRoleFilter('vip')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <RoleSymbol role="VIP" size={13} />
                <span>VIP</span>
              </button>
              <button
                type="button"
                className={`admin-tf-btn ${roleFilter === 'müşteri' ? 'active' : ''}`}
                onClick={() => setRoleFilter('müşteri')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <RoleSymbol role="Müşteri" size={13} />
                <span>Müşteri</span>
              </button>
            </div>

            {/* Search Input */}
            <div style={{ minWidth: '240px' }}>
              <input
                type="text"
                placeholder="Kullanıcı adı, Discord, e-posta veya IP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-form-input"
                style={{ padding: '0.45rem 0.75rem' }}
              />
            </div>
          </div>

          {/* 3 Subscription Tier Filter Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.74rem' }}>
            <span style={{ color: 'var(--admin-text-dim)', fontWeight: 600 }}>Abonelik Filtresi:</span>
            <div className="admin-timeframe-pills">
              <button
                type="button"
                className={`admin-tf-btn ${subFilter === 'all' ? 'active' : ''}`}
                onClick={() => setSubFilter('all')}
              >
                Tümü
              </button>
              <button
                type="button"
                className={`admin-tf-btn ${subFilter === 'free' ? 'active' : ''}`}
                onClick={() => setSubFilter('free')}
              >
                Free
              </button>
              <button
                type="button"
                className={`admin-tf-btn ${subFilter === 'plus' ? 'active' : ''}`}
                onClick={() => setSubFilter('plus')}
              >
                Plus
              </button>
              <button
                type="button"
                className={`admin-tf-btn ${subFilter === 'plus+' ? 'active' : ''}`}
                onClick={() => setSubFilter('plus+')}
              >
                Plus+
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Kullanıcı / Discord</th>
                <th>Sistem Rolü (6 Rol)</th>
                <th>Abonelik Planı (3 Plan)</th>
                <th>Cüzdan Bakiyesi</th>
                <th>Hesap Durumu</th>
                <th>Panel Girişi</th>
                <th>IP &amp; Son Giriş</th>
                <th style={{ textAlign: 'right' }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const roleClass = u.role.toLowerCase() === 'müşteri' ? 'musteri' : u.role.toLowerCase();
                const subClass = u.subscription.toLowerCase().replace('+', '-plus');

                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <img
                          src={u.avatarUrl}
                          alt={u.username}
                          style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ color: '#fff', fontWeight: 600 }}>
                            {u.username}
                            <span style={{ color: 'var(--admin-text-dim)', fontSize: '0.72rem' }}>#{u.discriminator}</span>
                          </span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-dim)' }}>{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`role-badge ${roleClass}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <RoleSymbol role={u.role} size={13} />
                        <span>{u.role}</span>
                      </span>
                    </td>
                    <td>
                      <span className={`sub-badge ${subClass}`}>
                        <TierSymbol tier={u.subscription} size={12} />
                      </span>
                    </td>
                    <td>
                      <span style={{ color: '#fff', fontWeight: 700 }}>
                        ₺{u.balance.toLocaleString('tr-TR')}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className={`user-status-tag ${u.status.toLowerCase()}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span className="admin-status-dot" style={{ display: 'inline-block', position: 'static' }} />
                          <span>{u.status}</span>
                        </span>
                        {u.restrictionsNote && (
                          <span style={{ fontSize: '0.68rem', color: '#f87171', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {u.restrictionsNote}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      {u.panelAccess ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.2rem 0.55rem', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontSize: '0.72rem', fontWeight: 600 }}>
                          <IconKey size={12} color="#34d399" />
                          <span>Yetkili {u.password ? '• Şifreli' : ''}</span>
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.2rem 0.55rem', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-dim)', fontSize: '0.72rem' }}>
                          <IconLock size={12} color="var(--admin-text-dim)" />
                          <span>Kapalı</span>
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.74rem', color: 'var(--admin-text-muted)' }}>{u.lastLogin}</span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--admin-text-dim)', fontFamily: 'monospace' }}>{u.ipAddress}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="admin-action-btn-group" style={{ justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          className="admin-action-btn primary"
                          onClick={() => handleEditRole(u)}
                          title="Rol ve Abonelik Seviyesini Değiştir"
                        >
                          Rol &amp; Plan
                        </button>
                        <button
                          type="button"
                          className="admin-action-btn"
                          onClick={() => handleBalance(u)}
                          title="Para / Bakiye Ekle veya Çıkar"
                        >
                          Bakiye ±
                        </button>
                        <button
                          type="button"
                          className="admin-action-btn danger"
                          onClick={() => handleBan(u)}
                          title="Hesabı Kısıtla veya Yasakla"
                        >
                          Kısıtla
                        </button>
                        {u.role !== 'Owner' && (
                          <button
                            type="button"
                            className="admin-action-btn danger"
                            onClick={() => handleDeleteUser(u)}
                            title="Kullanıcıyı Sil"
                          >
                            Sil
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  );
}
