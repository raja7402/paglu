import React, { useMemo } from 'react';
import { isMobileViewport } from '../../utils/universeStore';

export default function CosmicBackdrop({ accent = '#38bdf8', secondary = '#a855f7', density = 55 }) {
  const stars = useMemo(() => {
    const mobile = isMobileViewport();
    const count = mobile ? Math.max(22, Math.floor(density * 0.5)) : density;
    return Array.from({ length: count }, (_, i) => {
      // Deterministic pseudo-random distribution so re-renders never jump
      const seed1 = ((i * 73 + 19) % 1000) / 10;
      const seed2 = ((i * 137 + 43) % 1000) / 10;
      const size = (i % 4 === 0 ? 3 : i % 2 === 0 ? 2 : 1.4);
      const dur = 2.8 + (i % 6) * 0.85;
      const delay = (i % 7) * 0.55;
      const color = i % 7 === 0 ? accent : i % 11 === 0 ? secondary : '#ffffff';
      return {
        id: i,
        left: `${seed1}%`,
        top: `${seed2}%`,
        size,
        dur: `${dur}s`,
        delay: `${delay}s`,
        color
      };
    });
  }, [accent, secondary, density]);

  return (
    <div className="ambient-starfield" aria-hidden="true">
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '55vw',
          height: '55vw',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}1f 0%, transparent 68%)`,
          filter: 'blur(40px)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-18%',
          right: '-12%',
          width: '60vw',
          height: '60vw',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${secondary}22 0%, transparent 70%)`,
          filter: 'blur(48px)'
        }}
      />
      {stars.map((s) => (
        <span
          key={s.id}
          className="ambient-star"
          style={{
            left: s.left,
            top: s.top,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: s.color,
            boxShadow: s.size > 2 ? `0 0 8px ${s.color}` : 'none',
            '--dur': s.dur,
            '--delay': s.delay
          }}
        />
      ))}
    </div>
  );
}
