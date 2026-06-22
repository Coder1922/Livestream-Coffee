import React, { useMemo } from 'react';

interface SteamParticlesProps {
  count?: number;
}

export default function SteamParticles({ count = 8 }: SteamParticlesProps) {
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${15 + Math.random() * 70}%`, // concentrate near center/center-right
      size: `${20 + Math.random() * 40}px`,
      delay: `${Math.random() * 6}s`,
      dur: `${8 + Math.random() * 8}s`,
      opacity: 0.1 + Math.random() * 0.15
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((p) => (
        <div
          key={p.id}
          className="steam-particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.dur,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}
