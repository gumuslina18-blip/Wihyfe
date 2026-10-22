'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  isLand: boolean;
  baseAlpha: number;
}

interface Hub3D {
  name: string;
  lat: number;
  lon: number;
  ping: string;
  isPrimary?: boolean;
}

const HUBS: Hub3D[] = [
  { name: 'İstanbul', lat: 41.0, lon: 28.9, ping: '12ms', isPrimary: true },
  { name: 'Frankfurt', lat: 50.1, lon: 8.6, ping: '24ms' },
  { name: 'Londra', lat: 51.5, lon: -0.1, ping: '28ms' },
  { name: 'New York', lat: 40.7, lon: -74.0, ping: '78ms' },
  { name: 'Tokyo', lat: 35.6, lon: 139.6, ping: '110ms' },
  { name: 'Singapur', lat: 1.3, lon: 103.8, ping: '135ms' },
];

const ARCS = [
  { from: 0, to: 1 }, // İstanbul -> Frankfurt
  { from: 0, to: 2 }, // İstanbul -> Londra
  { from: 1, to: 3 }, // Frankfurt -> New York
  { from: 0, to: 4 }, // İstanbul -> Tokyo
  { from: 0, to: 5 }, // İstanbul -> Singapur
];

function latLonToVector3D(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return {
    x: -(radius * Math.sin(phi) * Math.cos(theta)),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta),
  };
}

// Check if a point is roughly within continent boundaries for realistic landmass effect
function isLandCoordinate(lat: number, lon: number): boolean {
  // Europe & Turkey
  if (lat >= 35 && lat <= 70 && lon >= -10 && lon <= 45) return true;
  // Anatolia & Middle East
  if (lat >= 25 && lat <= 42 && lon >= 25 && lon <= 60) return true;
  // North America
  if (lat >= 20 && lat <= 70 && lon >= -130 && lon <= -60) return true;
  // South America
  if (lat >= -55 && lat <= 12 && lon >= -80 && lon <= -35) return true;
  // Asia
  if (lat >= 10 && lat <= 70 && lon >= 60 && lon <= 145) return true;
  // Africa
  if (lat >= -35 && lat <= 35 && lon >= -18 && lon <= 50) return true;
  // Australia
  if (lat >= -42 && lat <= -10 && lon >= 112 && lon <= 155) return true;
  // Japan / East Asia Islands
  if (lat >= 30 && lat <= 45 && lon >= 130 && lon <= 145) return true;
  return false;
}

export default function Globe3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const rotation = useRef({ x: 0.35, y: -0.8 }); // tilted perspective
  const targetRotation = useRef({ x: 0.35, y: -0.8 });
  const velocity = useRef({ x: 0, y: 0.0035 }); // auto-rotation speed
  const [activeHubIndex, setActiveHubIndex] = useState(0);

  // Switch active hub tooltip periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHubIndex((prev) => (prev + 1) % HUBS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handlePointerDown = useCallback((clientX: number, clientY: number) => {
    isDragging.current = true;
    lastMousePos.current = { x: clientX, y: clientY };
  }, []);

  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging.current) return;
    const deltaX = clientX - lastMousePos.current.x;
    const deltaY = clientY - lastMousePos.current.y;

    targetRotation.current.y += deltaX * 0.006;
    targetRotation.current.x = Math.max(-0.9, Math.min(0.9, targetRotation.current.x + deltaY * 0.006));

    lastMousePos.current = { x: clientX, y: clientY };
  }, []);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let animTime = 0;

    // Generate sphere points
    const GLOBE_RADIUS = 165;
    const TOTAL_POINTS = 950;
    const points: Point3D[] = [];

    // Golden ratio sphere point distribution (Fibonacci Sphere)
    for (let i = 0; i < TOTAL_POINTS; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / TOTAL_POINTS);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const x = GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta);
      const y = GLOBE_RADIUS * Math.cos(phi);
      const z = GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta);

      // Derive approximate lat/lon
      const lat = 90 - (phi * 180) / Math.PI;
      const lon = ((theta * 180) / Math.PI) % 360 - 180;
      const isLand = isLandCoordinate(lat, lon);

      points.push({
        x,
        y,
        z,
        isLand,
        baseAlpha: isLand ? 0.85 : 0.22,
      });
    }

    // Latitude rings angles
    const latRings = [-60, -30, 0, 30, 60];
    // Longitude meridians angles
    const lonMeridians = [0, 45, 90, 135, 180, 225, 270, 315];

    const render = () => {
      animTime += 0.02;

      // Handle auto rotation when not dragging
      if (!isDragging.current) {
        targetRotation.current.y += velocity.current.y;
      }

      // Smooth damping interpolation
      rotation.current.x += (targetRotation.current.x - rotation.current.x) * 0.08;
      rotation.current.y += (targetRotation.current.y - rotation.current.y) * 0.08;

      const rx = rotation.current.x;
      const ry = rotation.current.y;

      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);

      // Coordinate transformation function (3D Rotate + Perspective)
      const project = (x: number, y: number, z: number, extraRadius = 0) => {
        const factor = extraRadius ? (GLOBE_RADIUS + extraRadius) / GLOBE_RADIUS : 1;
        const px = x * factor;
        const py = y * factor;
        const pz = z * factor;

        // Rotate around Y axis
        const x1 = px * cosY + pz * sinY;
        const y1 = py;
        const z1 = -px * sinY + pz * cosY;

        // Rotate around X axis
        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;

        // Center on canvas
        const cx = canvas.width / (2 * (window.devicePixelRatio || 1));
        const cy = canvas.height / (2 * (window.devicePixelRatio || 1));
        const cameraDistance = 580;
        const scale = cameraDistance / (cameraDistance - z2);

        return {
          x: cx + x2 * scale,
          y: cy + y2 * scale,
          z: z2,
          scale,
        };
      };

      // Set Canvas Resolution for crisp High-DPI screens
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // 1. Atmospheric Back Glow
      const bgGlow = ctx.createRadialGradient(cx, cy, GLOBE_RADIUS * 0.2, cx, cy, GLOBE_RADIUS * 1.35);
      bgGlow.addColorStop(0, 'rgba(8, 120, 255, 0.16)');
      bgGlow.addColorStop(0.5, 'rgba(8, 120, 255, 0.05)');
      bgGlow.addColorStop(0.85, 'rgba(6, 182, 212, 0.02)');
      bgGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = bgGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, GLOBE_RADIUS * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // 2. Globe Dark Planet Base Sphere
      const sphereGrad = ctx.createRadialGradient(
        cx - GLOBE_RADIUS * 0.35,
        cy - GLOBE_RADIUS * 0.35,
        GLOBE_RADIUS * 0.1,
        cx,
        cy,
        GLOBE_RADIUS
      );
      sphereGrad.addColorStop(0, '#0e1d35');
      sphereGrad.addColorStop(0.7, '#070f1e');
      sphereGrad.addColorStop(1, '#03060c');

      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, GLOBE_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      // 3. Globe Outer Rim Ring (Subtle Cyan Rim Light)
      ctx.strokeStyle = 'rgba(8, 120, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 4. Draw Latitude Rings (Wireframe Meridians)
      latRings.forEach((lat) => {
        ctx.beginPath();
        let started = false;
        const phi = (90 - lat) * (Math.PI / 180);
        const ringR = GLOBE_RADIUS * Math.sin(phi);
        const y = GLOBE_RADIUS * Math.cos(phi);

        for (let i = 0; i <= 64; i++) {
          const theta = (i / 64) * Math.PI * 2;
          const x = ringR * Math.cos(theta);
          const z = ringR * Math.sin(theta);
          const p = project(x, y, z);

          if (p.z > -GLOBE_RADIUS * 0.1) {
            if (!started) {
              ctx.moveTo(p.x, p.y);
              started = true;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          } else {
            started = false;
          }
        }
        ctx.strokeStyle = lat === 0 ? 'rgba(8, 120, 255, 0.25)' : 'rgba(38, 52, 71, 0.2)';
        ctx.lineWidth = lat === 0 ? 1.2 : 0.8;
        ctx.stroke();
      });

      // 5. Draw Longitude Meridians
      lonMeridians.forEach((lon) => {
        ctx.beginPath();
        let started = false;
        const theta = (lon * Math.PI) / 180;

        for (let i = 0; i <= 48; i++) {
          const phi = (i / 48) * Math.PI;
          const x = GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta);
          const y = GLOBE_RADIUS * Math.cos(phi);
          const z = GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta);
          const p = project(x, y, z);

          if (p.z > -GLOBE_RADIUS * 0.05) {
            if (!started) {
              ctx.moveTo(p.x, p.y);
              started = true;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          } else {
            started = false;
          }
        }
        ctx.strokeStyle = 'rgba(38, 52, 71, 0.18)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // 6. Draw 3D Land & Ocean Dot Matrix
      points.forEach((pt) => {
        const p = project(pt.x, pt.y, pt.z);

        // Depth cue: only render points that face the camera or slight horizon
        if (p.z > -GLOBE_RADIUS * 0.2) {
          const depthAlpha = Math.max(0.1, (p.z + GLOBE_RADIUS) / (GLOBE_RADIUS * 2));
          const alpha = pt.baseAlpha * depthAlpha;

          const dotSize = pt.isLand
            ? (p.z > 0 ? 2.2 : 1.6) * p.scale
            : (p.z > 0 ? 1.2 : 0.8) * p.scale;

          ctx.beginPath();
          ctx.arc(p.x, p.y, dotSize, 0, Math.PI * 2);

          if (pt.isLand) {
            ctx.fillStyle = p.z > 30 ? `rgba(56, 189, 248, ${alpha})` : `rgba(8, 120, 255, ${alpha})`;
          } else {
            ctx.fillStyle = `rgba(100, 116, 139, ${alpha * 0.4})`;
          }
          ctx.fill();
        }
      });

      // 7. Draw Great-Circle Data Arcs with Traveling Pulses
      ARCS.forEach((arc, arcIdx) => {
        const hub1 = HUBS[arc.from];
        const hub2 = HUBS[arc.to];

        const v1 = latLonToVector3D(hub1.lat, hub1.lon, GLOBE_RADIUS);
        const v2 = latLonToVector3D(hub2.lat, hub2.lon, GLOBE_RADIUS);

        const arcSegments = 32;
        const arcPoints: { x: number; y: number; z: number; scale: number }[] = [];

        for (let i = 0; i <= arcSegments; i++) {
          const t = i / arcSegments;

          // Slerp-like linear interpolation
          const ix = v1.x * (1 - t) + v2.x * t;
          const iy = v1.y * (1 - t) + v2.y * t;
          const iz = v1.z * (1 - t) + v2.z * t;

          // Normalize to sphere surface then lift into atmosphere
          const len = Math.sqrt(ix * ix + iy * iy + iz * iz);
          const lift = Math.sin(t * Math.PI) * 36; // arc height
          const radiusWithLift = GLOBE_RADIUS + lift;

          const px = (ix / len) * radiusWithLift;
          const py = (iy / len) * radiusWithLift;
          const pz = (iz / len) * radiusWithLift;

          arcPoints.push(project(px, py, pz));
        }

        // Draw Arc Path
        ctx.beginPath();
        let visible = false;
        arcPoints.forEach((pt, idx) => {
          if (pt.z > -GLOBE_RADIUS * 0.15) {
            if (!visible) {
              ctx.moveTo(pt.x, pt.y);
              visible = true;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            visible = false;
          }
        });

        ctx.strokeStyle = 'rgba(8, 120, 255, 0.35)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Traveling Packet Pulse along the arc
        const pulseProgress = (animTime * 0.5 + arcIdx * 0.28) % 1;
        const pulseIndex = Math.floor(pulseProgress * arcSegments);
        const pulsePt = arcPoints[pulseIndex];

        if (pulsePt && pulsePt.z > -GLOBE_RADIUS * 0.1) {
          ctx.beginPath();
          ctx.arc(pulsePt.x, pulsePt.y, 3.2 * pulsePt.scale, 0, Math.PI * 2);
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#0878FF';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // 8. Draw Hub Markers (Cities) with Pulsing Pings
      HUBS.forEach((hub, idx) => {
        const v = latLonToVector3D(hub.lat, hub.lon, GLOBE_RADIUS);
        const p = project(v.x, v.y, v.z);

        // Only draw when on the visible hemisphere
        if (p.z > 0) {
          const isCurrentActive = idx === activeHubIndex;
          const pingScale = ((animTime * 1.5 + idx * 0.4) % 1);
          const pingRadius = (6 + pingScale * 14) * p.scale;
          const pingAlpha = Math.max(0, 1 - pingScale);

          // Ping Ripple
          ctx.beginPath();
          ctx.arc(p.x, p.y, pingRadius, 0, Math.PI * 2);
          ctx.strokeStyle = hub.isPrimary
            ? `rgba(34, 197, 94, ${pingAlpha * 0.7})`
            : `rgba(8, 120, 255, ${pingAlpha * 0.6})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Core Hub Dot
          ctx.beginPath();
          ctx.arc(p.x, p.y, (hub.isPrimary ? 4.5 : 3.5) * p.scale, 0, Math.PI * 2);
          ctx.fillStyle = hub.isPrimary ? '#22c55e' : '#38bdf8';
          ctx.shadowColor = hub.isPrimary ? '#22c55e' : '#0878FF';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Hub Label Tag when near the front or active
          if (p.z > 40 || isCurrentActive) {
            ctx.font = '600 11px system-ui, -apple-system, sans-serif';
            ctx.fillStyle = hub.isPrimary ? '#4ade80' : '#e2e8f0';
            ctx.fillText(hub.name, p.x + 8, p.y - 4);

            ctx.font = '500 9.5px monospace';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(hub.ping, p.x + 8, p.y + 8);
          }
        }
      });

      // 9. Tilted Cyber Orbit Ring around globe with a floating satellite
      ctx.beginPath();
      const ringTilt = 0.45;
      const orbitRadius = GLOBE_RADIUS * 1.32;
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        const ox = orbitRadius * Math.cos(theta);
        const oy = orbitRadius * Math.sin(theta) * Math.sin(ringTilt);
        const oz = orbitRadius * Math.sin(theta) * Math.cos(ringTilt);
        const op = project(ox, oy, oz);

        if (i === 0) ctx.moveTo(op.x, op.y);
        else ctx.lineTo(op.x, op.y);
      }
      ctx.strokeStyle = 'rgba(8, 120, 255, 0.18)';
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Orbiting Satellite Beacon
      const satAngle = animTime * 0.65;
      const sx = orbitRadius * Math.cos(satAngle);
      const sy = orbitRadius * Math.sin(satAngle) * Math.sin(ringTilt);
      const sz = orbitRadius * Math.sin(satAngle) * Math.cos(ringTilt);
      const sp = project(sx, sy, sz);

      if (sp.z > -GLOBE_RADIUS * 0.3) {
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 3 * sp.scale, 0, Math.PI * 2);
        ctx.fillStyle = '#60a5fa';
        ctx.shadowColor = '#0878FF';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp]);

  return (
    <div className="hero-globe-wrapper">
      {/* Dynamic Ambient Background Aura */}
      <div className="hero-globe-aura" aria-hidden="true" />

      {/* Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="hero-globe-canvas"
        onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
        onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={(e) => {
          if (e.touches[0]) handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTouchMove={(e) => {
          if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTouchEnd={handlePointerUp}
        title="Etkileşimli 3D Dünya - Döndürmek için sürükleyin"
      />

      {/* Floating 3D HUD Badge 1: Top Node Info */}
      <div className="globe-overlay-card globe-overlay-top">
        <span className="globe-status-dot" />
        <div className="globe-overlay-text">
          <span className="globe-overlay-title">Wihyfe Global Node</span>
          <span className="globe-overlay-subtitle">Aktif Bağlantı: 12ms • %99.9 Uptime</span>
        </div>
      </div>

      {/* Floating 3D HUD Badge 2: DDoS & Guard Shield */}
      <div className="globe-overlay-card globe-overlay-bottom">
        <div className="globe-shield-icon-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div className="globe-overlay-text">
          <span className="globe-overlay-title">Bulut Guard Koruması</span>
          <span className="globe-overlay-subtitle">7/24 Kesintisiz DDoS Filtresi</span>
        </div>
      </div>
    </div>
  );
}
