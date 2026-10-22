'use client';

import React, { useRef, useState, MouseEvent } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxAngle?: number;
  perspective?: number;
  scale?: number;
  glare?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * 3D Gyroscopic Tilt & Crystal Depth Card
 * Smoothly tilts towards mouse cursor with realistic specular sheen & glare
 */
export default function TiltCard({
  children,
  className = '',
  maxAngle = 10,
  perspective = 1000,
  scale = 1.02,
  glare = true,
  style = {},
  onClick,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [glarePos, setGlarePos] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate angles (-maxAngle to +maxAngle)
    const rY = ((mouseX / width) - 0.5) * (maxAngle * 2);
    const rX = -(((mouseY / height) - 0.5) * (maxAngle * 2));

    setRotateX(rX);
    setRotateY(rY);

    if (glare) {
      setGlarePos({
        x: (mouseX / width) * 100,
        y: (mouseY / height) * 100,
        opacity: 0.45,
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      className={`tilt-card-wrapper ${className} ${isHovered ? 'tilt-hovered' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        perspective: `${perspective}px`,
        ...style,
      }}
    >
      <div
        className="tilt-card-inner"
        style={{
          transform: isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          transformStyle: 'preserve-3d',
        }}
      >
        {children}

        {/* Dynamic Specular Crystal Glare Layer */}
        {glare && (
          <div
            className="tilt-glare-overlay"
            style={{
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.08) 28%, transparent 68%)`,
              opacity: glarePos.opacity,
              transition: isHovered ? 'opacity 0.15s ease' : 'opacity 0.4s ease',
            }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
