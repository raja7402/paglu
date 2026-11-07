import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Compass, Lock, Sparkles, Unlock } from 'lucide-react';
import pagluConfig from '../../config/pagluConfig';
import soundEngine from '../../utils/soundEngine';
import { isMobileViewport } from '../../utils/universeStore';
import CosmicBackdrop from '../../components/Navigation/CosmicBackdrop';
import './FinalDestination.css';

export default function FinalDestination({
  isUnlocked = false,
  completedMysteryLevels = [],
  onNavigateMystery
}) {
  const fd = pagluConfig.finalDestination;

  // 'portal' | 'dark-fade' | 'line-1' | 'line-2' | 'grand-letter'
  const [phase, setPhase] = useState('portal');
  const fireworksCanvasRef = useRef(null);
  const launchBurstRef = useRef(null);
  const timersRef = useRef([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  // Canvas Rising Glowing Particles + Multi-burst Cosmic Fireworks once portal opens
  useEffect(() => {
    if (phase === 'portal') return undefined;

    const canvas = fireworksCanvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const mobile = isMobileViewport();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const embers = Array.from({ length: mobile ? 36 : 75 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vy: -Math.random() * 0.65 - 0.2,
      vx: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2.2 + 0.8,
      color: ['#fde68a', '#38bdf8', '#c084fc', '#f472b6'][Math.floor(Math.random() * 4)],
      a: Math.random() * 0.6 + 0.2
    }));

    const sparks = [];
    const palette = ['#fbbf24', '#38bdf8', '#a855f7', '#f472b6', '#ffffff', '#22d3ee'];

    const spawnFirework = (customX, customY) => {
      const x = customX ?? (0.15 + Math.random() * 0.7) * canvas.width;
      const y = customY ?? (0.12 + Math.random() * 0.38) * canvas.height;
      const color = palette[Math.floor(Math.random() * palette.length)];
      const count = mobile ? 34 : 60;

      soundEngine.playFirework();
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.15;
        const speed = 1.6 + Math.random() * 4.4;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: 0.011 + Math.random() * 0.01,
          r: 1.5 + Math.random() * 2,
          color
        });
      }
    };

    launchBurstRef.current = () => {
      spawnFirework();
      setTimeout(() => spawnFirework(), 260);
      setTimeout(() => spawnFirework(), 520);
    };

    let autoBurstTimer = null;
    if (phase === 'line-2' || phase === 'grand-letter') {
      spawnFirework();
      autoBurstTimer = setInterval(() => {
        spawnFirework();
      }, 2400);
    }

    let rafId;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Rising glowing starlight particles
      embers.forEach((e) => {
        e.x += e.vx;
        e.y += e.vy;
        if (e.y < -10) {
          e.y = canvas.height + 10;
          e.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.globalAlpha = e.a;
        ctx.fillStyle = e.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = e.color;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Firework bursts
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vx *= 0.982;
        sp.vy *= 0.982;
        sp.vy += 0.032; // gentle gravity
        sp.alpha -= sp.decay;

        if (sp.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = sp.alpha;
        ctx.fillStyle = sp.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = sp.color;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafId) cancelAnimationFrame(rafId);
      if (autoBurstTimer) clearInterval(autoBurstTimer);
    };
  }, [phase]);

  const handleOpenPortal = () => {
    soundEngine.unlockAudioFromGesture(false);
    soundEngine.playUnlock();
    if (!soundEngine.getState().isMuted) {
      soundEngine.playMusic('final');
    } else {
      soundEngine.switchTrack('final');
    }

    setPhase('dark-fade');
    timersRef.current.push(
      setTimeout(() => setPhase('line-1'), 900),
      setTimeout(() => setPhase('line-2'), 3800),
      setTimeout(() => setPhase('grand-letter'), 7100)
    );
  };

  // ==========================================================================
  // LOCKED STATE (Before completing Mystery Planet's 3 Trials)
  // ==========================================================================
  if (!isUnlocked) {
    return (
      <div className="planet-page" aria-label="Final Destination – Sealed Portal">
        <CosmicBackdrop accent="#fbbf24" secondary="#a855f7" density={60} />

        <div className="planet-container">
          <div className="final-portal-stage">
            <div
              style={{
                width: 86,
                height: 86,
                borderRadius: '50%',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(251, 191, 36, 0.12)',
                border: '1.5px solid rgba(251, 191, 36, 0.5)'
              }}
            >
              <Lock size={34} color="#fde68a" />
            </div>

            <span
              className="cosmic-badge"
              style={{ borderColor: 'rgba(251,191,36,0.45)', color: '#fde68a' }}
            >
              Planet 06 • Sealed Singularity
            </span>

            <h1 className="planet-hero-title" style={{ marginTop: 14 }}>
              Final Destination
            </h1>
            <p className="planet-hero-subtitle" style={{ marginBottom: 26 }}>
              The Grand Surprise at the edge of this universe is protected by three ancient seals
              on <strong>Mystery Planet</strong>. Complete all three trials to awaken the portal!
            </p>

            {/* 3 Seal Checklist */}
            <div
              style={{
                display: 'grid',
                gap: 10,
                maxWidth: 420,
                margin: '0 auto 28px',
                textAlign: 'left'
              }}
            >
              {[
                { lvl: 1, name: 'Seal I: The Riddle of Eternity' },
                { lvl: 2, name: 'Seal II: Hidden Constellation Message' },
                { lvl: 3, name: 'Seal III: The Final Celestial Code' }
              ].map((s) => {
                const done = completedMysteryLevels.includes(s.lvl);
                return (
                  <div
                    key={s.lvl}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: 14,
                      background: done ? 'rgba(16, 185, 129, 0.14)' : 'rgba(17, 22, 50, 0.72)',
                      border: `1px solid ${
                        done ? 'rgba(52, 211, 153, 0.45)' : 'rgba(148, 163, 184, 0.2)'
                      }`
                    }}
                  >
                    <span style={{ fontSize: '0.9rem', color: '#f1f5f9' }}>{s.name}</span>
                    {done ? (
                      <CheckCircle2 size={17} color="#34d399" />
                    ) : (
                      <Lock size={15} color="#94a3b8" />
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              className="cosmic-btn-primary"
              onClick={() => {
                soundEngine.playClick();
                onNavigateMystery();
              }}
            >
              <Compass size={18} />
              <span>WARP TO MYSTERY PLANET</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // UNLOCKED PORTAL THRESHOLD (Before stepping through)
  // ==========================================================================
  if (phase === 'portal') {
    return (
      <div className="planet-page" aria-label="Final Destination – Magical Portal">
        <CosmicBackdrop accent="#fbbf24" secondary="#c084fc" density={70} />

        <div className="planet-container">
          <motion.div
            className="final-portal-stage"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65 }}
          >
            <div className="magical-portal-orb" aria-hidden="true">
              <div className="portal-ring-1" />
              <div className="portal-ring-2" />
              <div className="portal-ring-3" />
              <div className="portal-singularity-core" />
            </div>

            <span
              className="cosmic-badge"
              style={{
                borderColor: 'rgba(52, 211, 153, 0.5)',
                color: '#86efac',
                background: 'rgba(16, 185, 129, 0.14)'
              }}
            >
              <Unlock size={13} />
              <span>All Mystery Seals Broken • Portal Awakened</span>
            </span>

            <h1 className="planet-hero-title" style={{ marginTop: 14 }}>
              {fd.portalTitle}
            </h1>
            <p className="planet-hero-subtitle" style={{ marginBottom: 28 }}>
              {fd.portalSubtitle}
            </p>

            <button type="button" className="cosmic-btn-primary" onClick={handleOpenPortal}>
              <Sparkles size={18} />
              <span>{fd.portalButtonLabel}</span>
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // GRAND FINALE CINEMA EXPERIENCE (Darkness -> Particles -> Fireworks -> Letter)
  // ==========================================================================
  return (
    <section className="finale-cinema-root" aria-label="The Grand Surprise">
      <canvas ref={fireworksCanvasRef} className="finale-fireworks-canvas" />

      <AnimatePresence mode="wait">
        {phase === 'line-1' && (
          <motion.div
            key="finale-line-1"
            className="finale-intro-typography"
            initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
            transition={{ duration: 1.05 }}
          >
            <p className="finale-opening-line">{fd.openingLineOne}</p>
          </motion.div>
        )}

        {phase === 'line-2' && (
          <motion.div
            key="finale-line-2"
            className="finale-intro-typography"
            initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
            transition={{ duration: 1.05 }}
          >
            <p className="finale-opening-line">{fd.openingLineTwo}</p>
          </motion.div>
        )}

        {phase === 'grand-letter' && (
          <motion.article
            key="finale-grand-letter"
            className="finale-letter-sanctuary"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <span
                className="cosmic-badge"
                style={{
                  borderColor: 'rgba(251, 191, 36, 0.5)',
                  color: '#fde68a',
                  background: 'rgba(251, 191, 36, 0.12)'
                }}
              >
                <Sparkles size={13} />
                <span>{pagluConfig.universeTitle} • THE GRAND SURPRISE</span>
              </span>

              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.55rem, 3.6vw, 2.35rem)',
                  color: '#ffffff',
                  marginTop: 16,
                  lineHeight: 1.25
                }}
              >
                {fd.letterHeadline}
              </h1>

              <p
                style={{
                  fontFamily: 'var(--font-editorial)',
                  fontStyle: 'italic',
                  fontSize: '1.18rem',
                  color: '#fbcfe8',
                  marginTop: 10
                }}
              >
                “{fd.openingLineOne} {fd.openingLineTwo}”
              </p>
            </div>

            {/* Editable Long Personal Letter */}
            <div>
              {fd.letterParagraphs.map((paragraph, idx) => (
                <p key={idx} className="finale-letter-paragraph">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Required Closing Lines */}
            <div className="finale-closing-block">
              <p className="finale-closing-quote">{fd.closingLines[0]}</p>
              <p className="finale-closing-quote">{fd.closingLines[1]}</p>
              <p
                style={{
                  fontFamily: 'var(--font-editorial)',
                  fontStyle: 'italic',
                  fontSize: '1.2rem',
                  color: '#e9d5ff',
                  marginTop: 16
                }}
              >
                {fd.closingLines[2]}
              </p>
              <p className="finale-signature">{fd.closingLines[3]}</p>

              <div style={{ marginTop: 28 }}>
                <button
                  type="button"
                  className="cosmic-btn-ghost"
                  onClick={() => {
                    if (launchBurstRef.current) launchBurstRef.current();
                  }}
                >
                  <Sparkles size={15} color="#fde68a" />
                  <span>Celebrate With More Fireworks</span>
                </button>
              </div>
            </div>
          </motion.article>
        )}
      </AnimatePresence>
    </section>
  );
}
