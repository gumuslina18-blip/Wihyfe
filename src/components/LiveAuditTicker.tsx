'use client';

import React, { useState, useEffect } from 'react';

interface AuditLog {
  id: string;
  time: string;
  module: 'GUARD' | 'PAYTR' | 'AUTH' | 'TICKET' | 'BACKUP';
  level: 'SUCCESS' | 'BLOCK' | 'INFO';
  message: string;
  latency: string;
  target?: string;
}

const INITIAL_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    time: '18:42:01',
    module: 'GUARD',
    level: 'BLOCK',
    message: 'Red Roleplay: Yetkisiz webhook silme girişimi saniyesinde engellendi.',
    latency: '0.01s',
    target: 'Channel #duyurular',
  },
  {
    id: 'log-2',
    time: '18:42:04',
    module: 'PAYTR',
    level: 'SUCCESS',
    message: '3D Secure onaylandı: Koenigsegg Jesko lisans anahtarı oyuna teslim edildi.',
    latency: '0.04s',
    target: 'User @berk_k9',
  },
  {
    id: 'log-3',
    time: '18:42:07',
    module: 'AUTH',
    level: 'INFO',
    message: 'Wihyfe Gateway: 6 Haneli oturum PIN doğrulaması tamamlandı.',
    latency: '0.02s',
    target: 'Gateway Session #9418',
  },
  {
    id: 'log-4',
    time: '18:42:11',
    module: 'TICKET',
    level: 'SUCCESS',
    message: 'Destek talebi arşivlendi & transkript otomatik HTML formatına dönüştürüldü.',
    latency: '0.03s',
    target: 'Ticket #TCK-4819',
  },
  {
    id: 'log-5',
    time: '18:42:15',
    module: 'GUARD',
    level: 'BLOCK',
    message: 'Anti-Spam Kalkanı: Saniyede 12 mesaj gönderen bot tokeni susturuldu.',
    latency: '0.01s',
    target: 'Bot ID: 119402941',
  },
  {
    id: 'log-6',
    time: '18:42:19',
    module: 'BACKUP',
    level: 'SUCCESS',
    message: 'Otomatik Sunucu Veritabanı Yedeği: 32.400 üye rol hiyerarşisi şifrelendi.',
    latency: '0.05s',
    target: 'Cloudflare R2 Storage',
  },
];

const EXTRA_LOGS_POOL: Omit<AuditLog, 'id' | 'time'>[] = [
  {
    module: 'GUARD',
    level: 'BLOCK',
    message: 'Yetkisiz rol dağıtım girişimi tespit edildi, yetkili anında denetim kaydına alındı.',
    latency: '0.01s',
    target: 'Role: @Yönetim',
  },
  {
    module: 'PAYTR',
    level: 'SUCCESS',
    message: 'Bakiye Yükleme Talebi: 5.000 Sunucu Kredisi cüzdana anında aktarıldı.',
    latency: '0.03s',
    target: 'Cüzdan: Luna Alvine',
  },
  {
    module: 'GUARD',
    level: 'BLOCK',
    message: 'Sunucuya yabancı bot davet linki gönderildi, link filtrelendi ve silindi.',
    latency: '0.01s',
    target: 'Channel #genel-sohbet',
  },
  {
    module: 'AUTH',
    level: 'SUCCESS',
    message: 'Dashboard Webhook Senkronizasyonu: 18 Modül canlı aktif edildi.',
    latency: '0.02s',
    target: 'Wihyfe Web Panel',
  },
  {
    module: 'TICKET',
    level: 'SUCCESS',
    message: 'VIP Özel Destek Odası açıldı, yetkiliye anında sesli bildirim iletildi.',
    latency: '0.02s',
    target: 'Voice Alert Hub',
  },
  {
    module: 'BACKUP',
    level: 'SUCCESS',
    message: 'FiveM SQL bağlantı kontrolü: 120ms altında gecikme ile 7/24 kesintisiz senkron.',
    latency: '0.02s',
    target: 'MySQL Cluster Node-1',
  },
];

export default function LiveAuditTicker() {
  const [logs, setLogs] = useState<AuditLog[]>(INITIAL_LOGS);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentLatency, setCurrentLatency] = useState<number>(3);

  // Dynamic incoming log ticker loop
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      const randomTemplate = EXTRA_LOGS_POOL[Math.floor(Math.random() * EXTRA_LOGS_POOL.length)];
      
      const newLog: AuditLog = {
        id: `log-${Date.now()}`,
        time: timeStr,
        ...randomTemplate,
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 7)]);
      setCurrentLatency(Math.floor(Math.random() * 3) + 2); // 2ms - 4ms
    }, 3200);

    return () => clearInterval(interval);
  }, [isPaused]);

  const filteredLogs = logs.filter((log) => {
    if (activeFilter === 'ALL') return true;
    return log.module === activeFilter;
  });

  return (
    <section className="section audit-ticker-section" id="canli-guvenlik-akisi">
      <div className="container">
        <div className="audit-terminal-card">
          {/* Top Chrome Header Bar */}
          <div className="audit-terminal-header">
            <div className="audit-terminal-title-group">
              <div className="audit-live-status-pill">
                <span className="audit-pulse-dot" />
                <strong>CANLI SİBER DENETİM & BOT TERMİNALİ</strong>
              </div>
              <span className="audit-uptime-label">
                Uptime: <strong className="text-emerald">%99.99</strong> • Gecikme: <strong className="text-cyan">{currentLatency}ms</strong>
              </span>
            </div>

            {/* Filter Pills */}
            <div className="audit-filter-pills" role="tablist" aria-label="Modül Filtreleri">
              {[
                { key: 'ALL', label: 'Tüm İşlemler' },
                { key: 'GUARD', label: 'Guard Kalkanı' },
                { key: 'PAYTR', label: 'PayTR & SQL' },
                { key: 'AUTH', label: 'Token & Auth' },
                { key: 'TICKET', label: 'Ticket' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`audit-filter-btn ${activeFilter === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveFilter(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Stream State Indicator */}
            <div className="audit-pause-control">
              <button
                type="button"
                className="audit-toggle-pause"
                onClick={() => setIsPaused(!isPaused)}
                title={isPaused ? 'Akışı Başlat' : 'Akışı Duraklat'}
              >
                {isPaused ? '▶ Akışı Sürdür' : '⏸ Duraklat'}
              </button>
            </div>
          </div>

          {/* Terminal Logs Output Stream */}
          <div
            className="audit-terminal-body"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            title="İncelemek için fareyi üzerinde tutabilirsiniz (Otomatik duraklar)"
          >
            <div className="audit-terminal-scanlines" aria-hidden="true" />
            <div className="audit-terminal-watermark">WIHYFE ENGINE v4.2 // SECURITY AUDIT</div>

            <div className="audit-logs-list">
              {filteredLogs.map((log) => {
                const isBlock = log.level === 'BLOCK';
                const isSuccess = log.level === 'SUCCESS';
                return (
                  <div key={log.id} className={`audit-log-row log-${log.level.toLowerCase()}`}>
                    <span className="audit-time-col">{log.time}</span>
                    
                    <span className={`audit-module-tag tag-${log.module.toLowerCase()}`}>
                      {log.module}
                    </span>

                    <span className={`audit-level-badge badge-${log.level.toLowerCase()}`}>
                      {isBlock ? 'ENGEL' : isSuccess ? 'ONAY' : 'BİLGİ'}
                    </span>

                    <span className="audit-message-col">
                      {log.message}
                      {log.target && <span className="audit-target-chip">{log.target}</span>}
                    </span>

                    <span className="audit-latency-col">{log.latency}</span>
                  </div>
                );
              })}
            </div>

            {/* Bottom Terminal Status Line */}
            <div className="audit-terminal-footer">
              <span className="audit-cursor-blink">_</span>
              <span>7/24 Kesintisiz Heuristic Savunma ve Otomatik SQL Log Akışı Devrede</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
