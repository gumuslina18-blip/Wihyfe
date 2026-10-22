'use client';

import React, { useRef, useEffect, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  isAttack: boolean;
  alpha: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
}

export default function DdosDefenseRadar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [blockedCount, setBlockedCount] = useState<number>(18492);
  const [shieldHealth] = useState<number>(100);
  const [activePreset, setActivePreset] = useState<'ALL' | 'RAID' | 'SYN' | 'WEBHOOK'>('ALL');
  const [isSimulatingRaid, setIsSimulatingRaid] = useState<boolean>(false);

  // References for animation state
  const particlesRef = useRef<Particle[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  // Spawn single attack particle
  const spawnAttackParticle = (width: number, height: number, forceRed = false) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.max(width, height) * 0.55;
    const centerX = width / 2;
    const centerY = height / 2;

    const startX = centerX + Math.cos(angle) * distance;
    const startY = centerY + Math.sin(angle) * distance;

    const speed = 1.6 + Math.random() * 1.8;
    const toCenterAngle = Math.atan2(centerY - startY, centerX - startX);

    particlesRef.current.push({
      x: startX,
      y: startY,
      vx: Math.cos(toCenterAngle) * speed,
      vy: Math.sin(toCenterAngle) * speed,
      radius: forceRed ? 4 : 2.5 + Math.random() * 1.5,
      color: forceRed ? '#f43f5e' : Math.random() > 0.4 ? '#fb7185' : '#f59e0b',
      isAttack: true,
      alpha: 1,
    });
  };

  // Trigger burst of test attack particles
  const triggerTestAttack = () => {
    if (!canvasRef.current) return;
    const { width, height } = canvasRef.current;
    setIsSimulatingRaid(true);

    for (let i = 0; i < 24; i++) {
      setTimeout(() => {
        spawnAttackParticle(width, height, true);
      }, i * 45);
    }

    setTimeout(() => {
      setIsSimulatingRaid(false);
    }, 2200);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = 420);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 420;
    };
    window.addEventListener('resize', handleResize);

    // Initial ambient attacks loop
    const spawnInterval = setInterval(() => {
      if (particlesRef.current.length < 35) {
        spawnAttackParticle(width, height);
      }
    }, 320);

    // Main render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const shieldRadius = Math.min(width, height) * 0.22;

      // Draw background cyber radar grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, shieldRadius * 1.6, 0, Math.PI * 2);
      ctx.arc(centerX, centerY, shieldRadius * 2.1, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Central Hexagonal Shield
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const hexAngle = (Math.PI / 3) * i - Math.PI / 6;
        const hx = centerX + Math.cos(hexAngle) * shieldRadius;
        const hy = centerY + Math.sin(hexAngle) * shieldRadius;
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();

      // Hexagon Glow Fill & Stroke
      ctx.fillStyle = isSimulatingRaid
        ? 'rgba(56, 189, 248, 0.22)'
        : 'rgba(56, 189, 248, 0.1)';
      ctx.fill();

      ctx.strokeStyle = isSimulatingRaid ? '#38bdf8' : '#10b981';
      ctx.lineWidth = isSimulatingRaid ? 3.5 : 2.5;
      ctx.shadowColor = isSimulatingRaid ? '#38bdf8' : '#10b981';
      ctx.shadowBlur = isSimulatingRaid ? 24 : 14;
      ctx.stroke();
      ctx.restore();

      // Inner Core Glow Icon
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('WIHYFE GUARD', centerX, centerY - 6);
      ctx.fillStyle = '#10b981';
      ctx.font = '10px monospace';
      ctx.fillText('%100 AKTİF', centerX, centerY + 12);
      ctx.restore();

      // Update & Render Attack Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;

        const dist = Math.hypot(p.x - centerX, p.y - centerY);

        // Check collision with hexagon shield boundary
        if (dist <= shieldRadius) {
          // Particle Deflected! Trigger sparks & soundless burst
          setBlockedCount((c) => c + 1);

          for (let s = 0; s < 7; s++) {
            const sparkAngle = Math.random() * Math.PI * 2;
            const sparkSpeed = 1 + Math.random() * 2.5;
            sparksRef.current.push({
              x: p.x,
              y: p.y,
              vx: Math.cos(sparkAngle) * sparkSpeed,
              vy: Math.sin(sparkAngle) * sparkSpeed,
              color: '#38bdf8',
              life: 1,
              maxLife: 20 + Math.random() * 15,
            });
          }

          particlesRef.current.splice(i, 1);
          continue;
        }

        // Render attack particle & tail trail
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();

        // Trail
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 3.5, p.y - p.vy * 3.5);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      // Update & Render Sparks
      for (let i = sparksRef.current.length - 1; i >= 0; i--) {
        const sp = sparksRef.current[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.life += 1;

        const lifeRatio = 1 - sp.life / sp.maxLife;
        if (lifeRatio <= 0) {
          sparksRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = lifeRatio;
        ctx.shadowColor = sp.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(spawnInterval);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isSimulatingRaid]);

  return (
    <section className="section ddos-radar-section" id="ddos-savunma-radari">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="section-tag">
            <span className="ddos-tag-dot" />
            CANLI SİBER TEHDİT SAVUNMASI
          </div>
          <h2 className="section-title">
            Anti-DDoS & Heuristic <span className="text-accent">Savunma Radarı</span>
          </h2>
          <p className="section-desc">
            Sunucunuza yönelen yetkisiz webhook, bot raid ve SYN flood saldırılarını Wihyfe altıgen kalkanının nasıl saniyeler içinde etkisiz hale getirdiğini canlı izleyin.
          </p>

          {/* Preset Module Filter */}
          <div className="ddos-preset-bar">
            {[
              { key: 'ALL', label: 'Tüm Savunma Kalkanları' },
              { key: 'RAID', label: 'Anti-Raid Koruması' },
              { key: 'SYN', label: 'Layer 4/7 DDoS Filtresi' },
              { key: 'WEBHOOK', label: 'Yetkisiz Webhook Silici' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`ddos-filter-pill ${activePreset === tab.key ? 'active' : ''}`}
                onClick={() => setActivePreset(tab.key as any)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Defense Canvas Stage Card */}
        <div className="ddos-radar-card">
          <div className="ddos-radar-hud-bar">
            <div className="hud-metric">
              <span className="hud-lbl">SAVUŞTURULAN TEHDİT</span>
              <strong className="hud-val text-cyan">{blockedCount.toLocaleString('tr-TR')}+</strong>
            </div>
            <div className="hud-metric">
              <span className="hud-lbl">KALKAN SAĞLIĞI</span>
              <strong className="hud-val text-emerald">%{shieldHealth} KUSURSUZ</strong>
            </div>
            <div className="hud-metric">
              <span className="hud-lbl">SAVUNMA HIZI</span>
              <strong className="hud-val text-cyan">0.001 Saniye</strong>
            </div>
            <div className="hud-metric">
              <span className="hud-lbl">BANT GENİŞLİĞİ KAPASİTESİ</span>
              <strong className="hud-val text-emerald">3.2 Tbps Voxility</strong>
            </div>
          </div>

          {/* The Live Interactive Canvas */}
          <div className="ddos-canvas-container">
            <canvas ref={canvasRef} className="ddos-radar-canvas" />

            {/* Test Attack Action Trigger */}
            <div className="ddos-action-overlay">
              <button
                type="button"
                className={`ddos-test-attack-btn ${isSimulatingRaid ? 'is-firing' : ''}`}
                onClick={triggerTestAttack}
                disabled={isSimulatingRaid}
              >
                <span className="radar-pulse-ring" />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                <span>{isSimulatingRaid ? '⚡ Simüle Saldırı Savuşturuluyor...' : '⚡ Test Saldırısı Gönder (Simüle Et)'}</span>
              </button>
            </div>
          </div>

          {/* Bottom HUD Legend */}
          <div className="ddos-radar-legend">
            <div className="legend-item">
              <span className="legend-dot red" />
              <span>Gelen Kötü Niyetli İstek / Raid</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot cyan" />
              <span>Hexagon Kalkanı & Savuşturma Parçacıkları</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot green" />
              <span>7/24 Kesintisiz Sunucu Uptime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
