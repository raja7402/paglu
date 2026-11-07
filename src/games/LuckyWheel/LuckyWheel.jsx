import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Gift, RotateCw, Sparkles } from 'lucide-react';
import pagluConfig from '../../config/pagluConfig';
import soundEngine from '../../utils/soundEngine';

export default function LuckyWheel() {
  const segments = pagluConfig.funPlanet.luckyWheelSegments;
  const count = segments.length;
  const sliceDeg = 360 / count;

  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [history, setHistory] = useState([]);

  const spinTimeoutRef = useRef(null);
  const tickTimersRef = useRef([]);

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      tickTimersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const spinWheel = () => {
    if (isSpinning) return;
    soundEngine.unlockAudioFromGesture(false);
    setIsSpinning(true);
    setWinner(null);

    const chosenIndex = Math.floor(Math.random() * count);
    const jitter = (Math.random() - 0.5) * (sliceDeg * 0.48);

    // Align chosenIndex cleanly under top pointer (0 deg offset)
    const currentNormalized = rotation % 360;
    const desiredMod = (360 - chosenIndex * sliceDeg + jitter + 360) % 360;
    const delta = 360 * 6 + ((desiredMod - currentNormalized + 360) % 360);
    const nextRot = rotation + delta;

    setRotation(nextRot);

    // Schedule decelerating peg-tick chimes
    tickTimersRef.current.forEach((t) => clearTimeout(t));
    tickTimersRef.current = [];
    const tickMoments = [120, 260, 420, 610, 830, 1090, 1400, 1760, 2180, 2680, 3250, 3850];
    tickMoments.forEach((ms) => {
      tickTimersRef.current.push(
        setTimeout(() => {
          soundEngine.playWheelTick();
        }, ms)
      );
    });

    spinTimeoutRef.current = setTimeout(() => {
      const result = segments[chosenIndex];
      setIsSpinning(false);
      setWinner(result);
      setHistory((prev) => [result, ...prev.slice(0, 4)]);
      soundEngine.playSuccess();
    }, 4300);
  };

  // Helper to build SVG pie slice path centered at (160, 160) with radius 148
  const buildSlicePath = (idx) => {
    const cx = 160;
    const cy = 160;
    const r = 148;
    const startAngle = ((idx * sliceDeg - 90 - sliceDeg / 2) * Math.PI) / 180;
    const endAngle = (((idx + 1) * sliceDeg - 90 - sliceDeg / 2) * Math.PI) / 180;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);

    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
  };

  return (
    <div
      className="glass-panel-strong"
      style={{
        maxWidth: 860,
        margin: '0 auto',
        padding: '32px 22px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 30,
        alignItems: 'center'
      }}
    >
      {/* Left: Animated Celestial Wheel */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 300, height: 300 }}>
          {/* Top Golden Starlight Pointer */}
          <div
            style={{
              position: 'absolute',
              top: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              width: 0,
              height: 0,
              borderLeft: '13px solid transparent',
              borderRight: '13px solid transparent',
              borderTop: '24px solid #fde68a',
              filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.9))'
            }}
          />

          <svg
            viewBox="0 0 320 320"
            width="300"
            height="300"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning
                ? 'transform 4.25s cubic-bezier(0.14, 0.88, 0.18, 1)'
                : 'none',
              filter: 'drop-shadow(0 0 28px rgba(139, 92, 246, 0.38))'
            }}
          >
            <circle
              cx="160"
              cy="160"
              r="154"
              fill="#070a1e"
              stroke="rgba(168, 85, 247, 0.65)"
              strokeWidth="4"
            />

            {segments.map((seg, idx) => {
              const midDeg = idx * sliceDeg - 90;
              const midRad = (midDeg * Math.PI) / 180;
              const tx = 160 + 96 * Math.cos(midRad);
              const ty = 160 + 96 * Math.sin(midRad);

              return (
                <g key={seg.id}>
                  <path
                    d={buildSlicePath(idx)}
                    fill={seg.color}
                    fillOpacity="0.28"
                    stroke={seg.color}
                    strokeWidth="1.8"
                  />
                  <text
                    x={tx}
                    y={ty}
                    fill="#ffffff"
                    fontSize="10.5"
                    fontWeight="700"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${midDeg + 90}, ${tx}, ${ty})`}
                    style={{ fontFamily: 'var(--font-tech)', letterSpacing: '0.04em' }}
                  >
                    {seg.shortLabel}
                  </text>
                </g>
              );
            })}

            {/* Center Cosmic Hub */}
            <circle
              cx="160"
              cy="160"
              r="28"
              fill="#0b102c"
              stroke="#fde68a"
              strokeWidth="2.5"
            />
            <circle cx="160" cy="160" r="10" fill="#38bdf8" />
          </svg>
        </div>

        <button
          type="button"
          className="cosmic-btn-primary"
          style={{ marginTop: 22 }}
          disabled={isSpinning}
          onClick={spinWheel}
        >
          <RotateCw size={17} className={isSpinning ? 'animate-spin-slow' : ''} />
          <span>{isSpinning ? 'SPINNING THE COSMOS...' : 'SPIN THE LUCKY WHEEL'}</span>
        </button>
      </div>

      {/* Right: Result & Categories */}
      <div>
        <span className="cosmic-badge" style={{ marginBottom: 12 }}>
          <Gift size={13} />
          <span>Wheel of Cosmic Fate</span>
        </span>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            color: '#ffffff',
            marginBottom: 8
          }}
        >
          What Will The Universe Pick?
        </h3>
        <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.55, marginBottom: 20 }}>
          Every spin lands on a compliment, a funny challenge, a secret message, a beautiful
          memory prompt, or a random surprise!
        </p>

        <AnimatePresence mode="wait">
          {winner ? (
            <motion.div
              key={`${winner.id}-${rotation}`}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{
                padding: '22px',
                borderRadius: 20,
                background: 'rgba(18, 22, 54, 0.88)',
                border: `1.5px solid ${winner.color}`,
                boxShadow: `0 0 28px ${winner.color}33`
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: 'var(--font-tech)',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: winner.color,
                  marginBottom: 8
                }}
              >
                <Sparkles size={14} />
                <span>{winner.category}</span>
              </div>
              <p style={{ fontSize: '0.98rem', color: '#f8fafc', lineHeight: 1.62 }}>
                {winner.resultText}
              </p>
            </motion.div>
          ) : (
            <div
              style={{
                padding: '22px',
                borderRadius: 20,
                background: 'rgba(15, 20, 46, 0.55)',
                border: '1px dashed rgba(148, 163, 184, 0.28)',
                color: '#94a3b8',
                fontSize: '0.9rem',
                textAlign: 'center'
              }}
            >
              {isSpinning
                ? 'Listening to the stars align...'
                : 'Tap "SPIN THE LUCKY WHEEL" to reveal your cosmic outcome!'}
            </div>
          )}
        </AnimatePresence>

        {history.length > 1 && (
          <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 6 }}>
              Recent Spins:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {history.slice(1).map((h, i) => (
                <span
                  key={i}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 99,
                    fontSize: '0.72rem',
                    background: 'rgba(255,255,255,0.06)',
                    color: '#cbd5e1'
                  }}
                >
                  {h.category}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
