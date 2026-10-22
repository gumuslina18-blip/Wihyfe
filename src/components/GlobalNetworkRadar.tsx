'use client';

import React, { useState, useEffect } from 'react';

interface ServerNode {
  id: string;
  city: string;
  country: string;
  flag: string;
  role: string;
  basePing: number;
  uptime: string;
  bandwidth: string;
  hardware: string;
  ddos: string;
  coordinates: { x: number; y: number }; // percentage on stylized map
}

const SERVER_NODES: ServerNode[] = [
  {
    id: 'tr-istanbul',
    city: 'İstanbul',
    country: 'Türkiye',
    flag: 'TR',
    role: 'Ana Discord Bot & Web Gateway',
    basePing: 3,
    uptime: '%99.99',
    bandwidth: '10 Gbps Redundant Fiber',
    hardware: 'AMD EPYC™ 9654 (High-Frequency)',
    ddos: '3.2 Tbps Voxility + Wihyfe Guard',
    coordinates: { x: 62, y: 58 },
  },
  {
    id: 'eu-frankfurt',
    city: 'Frankfurt',
    country: 'Almanya',
    flag: 'DE',
    role: 'Avrupa Veritabanı & Redis Cluster',
    basePing: 17,
    uptime: '%100.0',
    bandwidth: '20 Gbps Tier-1 Transit',
    hardware: 'Intel Xeon Platinum 8480+',
    ddos: 'Cloudflare Magic Transit DDoS Shield',
    coordinates: { x: 48, y: 44 },
  },
  {
    id: 'eu-amsterdam',
    city: 'Amsterdam',
    country: 'Hollanda',
    flag: 'NL',
    role: 'Otomatik Yedekleme & R2 Storage Hub',
    basePing: 22,
    uptime: '%99.99',
    bandwidth: '10 Gbps AMS-IX Doğrudan Hat',
    hardware: 'Dual NVMe Gen5 RAID-10',
    ddos: 'Anında SYN & UDP Flood Filtreleme',
    coordinates: { x: 42, y: 38 },
  },
  {
    id: 'uk-london',
    city: 'Londra',
    country: 'İngiltere',
    flag: 'UK',
    role: 'Global CDN & API Edge Node',
    basePing: 26,
    uptime: '%99.98',
    bandwidth: '10 Gbps LINX Direct Peer',
    hardware: 'Edge Compute Cloud Server',
    ddos: 'Layer 7 Heuristic Web Application Firewall',
    coordinates: { x: 34, y: 35 },
  },
];

export default function GlobalNetworkRadar() {
  const [selectedNode, setSelectedNode] = useState<ServerNode>(SERVER_NODES[0]);
  const [livePings, setLivePings] = useState<Record<string, number>>({
    'tr-istanbul': 3,
    'eu-frankfurt': 17,
    'eu-amsterdam': 22,
    'uk-london': 26,
  });

  // Natural ping fluctuation simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePings((prev) => {
        const next = { ...prev };
        SERVER_NODES.forEach((node) => {
          const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
          next[node.id] = Math.max(1, node.basePing + delta);
        });
        return next;
      });
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="section network-radar-section" id="canli-ag-haritasi">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="section-tag">
            <span className="network-tag-dot" />
            GLOBAL BULUT ALTYAPISI
          </div>
          <h2 className="section-title">
            Canlı Lokasyon & <span className="text-accent">Ping Monitörü</span>
          </h2>
          <p className="section-desc">
            Sunucularınız için sıfır gecikme! İstanbul ve Avrupa düğümlerimiz arasındaki doğrudan fiber hatlarla 7/24 kesintisiz 0.01 saniye işlem hızı.
          </p>
        </div>

        {/* Radar & Interactive Map Canvas Box */}
        <div className="network-radar-card">
          <div className="network-card-topbar">
            <div className="network-topbar-left">
              <span className="network-status-glow-dot" />
              <strong>WİHYFE EDGE NETWORK // CANLI TELEMETRİ</strong>
            </div>
            <div className="network-topbar-right">
              <span>Toplam Bant Genişliği: <strong className="text-cyan">50+ Gbps</strong></span>
              <span>Paket Kaybı: <strong className="text-emerald">%0.00</strong></span>
            </div>
          </div>

          <div className="network-card-content-grid">
            {/* Visual Interactive Map Stage */}
            <div className="network-map-stage" aria-label="Harita Görseli">
              <div className="network-radar-rings" aria-hidden="true">
                <span className="ring ring-1" />
                <span className="ring ring-2" />
                <span className="ring ring-3" />
                <div className="radar-sweep-beam" />
              </div>

              {/* Stylized Cyber Map Grid Floor */}
              <div className="network-grid-dots" aria-hidden="true" />

              {/* Animated Connecting Vector Lines */}
              <svg className="network-connections-svg" aria-hidden="true">
                <defs>
                  <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                {/* Lines between nodes */}
                <line x1="62%" y1="58%" x2="48%" y2="44%" stroke="url(#laserGrad)" strokeWidth="1.5" strokeDasharray="4 4" className="stream-line" />
                <line x1="48%" y1="44%" x2="42%" y2="38%" stroke="url(#laserGrad)" strokeWidth="1.5" strokeDasharray="4 4" className="stream-line" />
                <line x1="42%" y1="38%" x2="34%" y2="35%" stroke="url(#laserGrad)" strokeWidth="1.5" strokeDasharray="4 4" className="stream-line" />
              </svg>

              {/* Interactive Node Pins */}
              {SERVER_NODES.map((node) => {
                const isSelected = selectedNode.id === node.id;
                const pingVal = livePings[node.id] || node.basePing;
                return (
                  <button
                    key={node.id}
                    type="button"
                    className={`network-node-pin ${isSelected ? 'is-selected' : ''}`}
                    style={{ left: `${node.coordinates.x}%`, top: `${node.coordinates.y}%` }}
                    onClick={() => setSelectedNode(node)}
                    title={`${node.city} Düğümü - ${pingVal}ms`}
                  >
                    <span className="node-ping-sonar" />
                    <span className="node-core-dot" />
                    
                    {/* Node Hover Tooltip Label */}
                    <div className="node-floating-badge">
                      <span className="node-badge-city">{node.city}</span>
                      <strong className="node-badge-ping">{pingVal}ms</strong>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Node Specs Telemetry Panel */}
            <div className="network-telemetry-panel">
              <div className="telemetry-panel-header">
                <div>
                  <span className="telemetry-node-sub">{selectedNode.country} DÜĞÜMÜ // {selectedNode.flag}</span>
                  <h3 className="telemetry-node-title">{selectedNode.city} Edge Hub</h3>
                </div>
                <div className="telemetry-live-ping-chip">
                  <span className="ping-dot" />
                  <strong>{livePings[selectedNode.id]} ms</strong>
                </div>
              </div>

              <p className="telemetry-node-role">{selectedNode.role}</p>

              <div className="telemetry-specs-list">
                <div className="telemetry-spec-row">
                  <span className="spec-label">Donanım İşlemcisi</span>
                  <strong className="spec-value text-cyan">{selectedNode.hardware}</strong>
                </div>
                <div className="telemetry-spec-row">
                  <span className="spec-label">Ağ & Bant Genişliği</span>
                  <strong className="spec-value">{selectedNode.bandwidth}</strong>
                </div>
                <div className="telemetry-spec-row">
                  <span className="spec-label">Anti-DDoS Savunması</span>
                  <strong className="spec-value text-emerald">{selectedNode.ddos}</strong>
                </div>
                <div className="telemetry-spec-row">
                  <span className="spec-label">Yıllık Uptime Oranı</span>
                  <strong className="spec-value text-emerald">{selectedNode.uptime}</strong>
                </div>
              </div>

              {/* Node Selection Switcher Buttons */}
              <div className="telemetry-switcher-row">
                {SERVER_NODES.map((node) => (
                  <button
                    key={node.id}
                    type="button"
                    className={`telemetry-node-tab ${selectedNode.id === node.id ? 'active' : ''}`}
                    onClick={() => setSelectedNode(node)}
                  >
                    <span>{node.city}</span>
                    <small>{livePings[node.id]}ms</small>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
