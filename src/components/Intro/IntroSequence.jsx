import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { Volume2, VolumeX, Sparkles, FastForward } from 'lucide-react';
import pagluConfig from '../../config/pagluConfig';
import soundEngine from '../../utils/soundEngine';
import { isMobileViewport } from '../../utils/universeStore';
import './IntroSequence.css';

export default function IntroSequence({ onEnterUnknown }) {
  // phase 0 = pure pitch dark, 1..3 = sequential messages, 4 = final prompt + ENTER THE UNKNOWN
  const [phase, setPhase] = useState(0);
  const [starsAwake, setStarsAwake] = useState(false);
  const [audioAwake, setAudioAwake] = useState(soundEngine.getState().isPlaying);
  const canvasRef = useRef(null);
  const timelineRef = useRef(null);
  const starOpacityRef = useRef({ value: 0 });

  useEffect(() => {
    const unsub = soundEngine.subscribe((s) => setAudioAwake(s.isPlaying && !s.isMuted));
    return unsub;
  }, []);

  // Gradual Canvas Starfield & Floating Cosmic Particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    let rafId = null;

    const mobile = isMobileViewport();
    const starCount = mobile ? 85 : 190;
    const dustCount = mobile ? 22 : 48;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.6 + 0.35,
      twinkleSpeed: Math.random() * 0.025 + 0.008,
      phase: Math.random() * Math.PI * 2,
      tint:
        Math.random() > 0.82
          ? '#38bdf8'
          : Math.random() > 0.86
          ? '#c084fc'
          : Math.random() > 0.92
          ? '#f472b6'
          : '#ffffff'
    }));

    const particles = Array.from({ length: dustCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.28,
      vy: -Math.random() * 0.35 - 0.08,
      r: Math.random() * 2.3 + 0.8,
      alpha: Math.random() * 0.55 + 0.2,
      color: Math.random() > 0.5 ? '56, 189, 248' : '168, 85, 247'
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const masterAlpha = starOpacityRef.current.value;

      if (masterAlpha > 0.005) {
        stars.forEach((s) => {
          s.phase += s.twinkleSpeed;
          const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(s.phase));
          ctx.globalAlpha = masterAlpha * tw;
          ctx.fillStyle = s.tint;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        });

        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -10) p.y = canvas.height + 10;
          if (p.x < -10) p.x = canvas.width + 10;
          if (p.x > canvas.width + 10) p.x = -10;

          ctx.globalAlpha = masterAlpha * p.alpha;
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
          grad.addColorStop(0, `rgba(${p.color}, 0.9)`);
          grad.addColorStop(1, `rgba(${p.color}, 0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // GSAP Master Intro Sequence Timeline
  useEffect(() => {
    const tl = gsap.timeline();
    timelineRef.current = tl;

    // Start pitch dark for 0.85s, then awaken tiny glowing stars & nebula
    tl.to(starOpacityRef.current, {
      value: 1,
      duration: 2.8,
      delay: 0.85,
      ease: 'power2.out',
      onStart: () => setStarsAwake(true)
    });

    // Message 1: "Somewhere beyond the ordinary..."
    tl.call(() => setPhase(1), null, 1.5);
    // Message 2: "Some worlds are never found by accident."
    tl.call(() => setPhase(2), null, 4.3);
    // Message 3: "Somewhere, a universe is waiting."
    tl.call(() => setPhase(3), null, 7.1);
    // Final Prompt + ENTER THE UNKNOWN button
    tl.call(() => setPhase(4), null, 9.9);

    return () => {
      tl.kill();
    };
  }, []);

  const handleFastForward = () => {
    soundEngine.playClick();
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    gsap.to(starOpacityRef.current, { value: 1, duration: 0.5 });
    setStarsAwake(true);
    setPhase(4);
  };

  const handleAudioToggle = () => {
    soundEngine.togglePlay();
    soundEngine.playClick();
  };

  const handleEnterClick = () => {
    soundEngine.unlockAudioFromGesture(true);
    soundEngine.playUnlock();
    onEnterUnknown();
  };

  const { sequenceMessages, callToActionPrompt, enterButtonLabel } = pagluConfig.intro;

  return (
    <section className="intro-root" aria-label="Introduction – The Unknown">
      <div className={`intro-nebula-layer ${starsAwake ? 'visible' : ''}`} />
      <canvas ref={canvasRef} className="intro-canvas" />

      {starsAwake && (
        <motion.div
          className="intro-top-controls"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <button
            type="button"
            className="cosmic-btn-ghost"
            onClick={handleAudioToggle}
            aria-label={audioAwake ? 'Mute cosmic audio' : 'Enable cosmic audio'}
          >
            {audioAwake ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{audioAwake ? 'Cosmic Sound: ON' : 'Awaken Sound'}</span>
          </button>

          {phase < 4 && (
            <button
              type="button"
              className="cosmic-btn-ghost"
              onClick={handleFastForward}
              aria-label="Skip intro animation"
            >
              <span>Skip</span>
              <FastForward size={15} />
            </button>
          )}
        </motion.div>
      )}

      <div className="intro-stage">
        <AnimatePresence mode="wait">
          {phase >= 1 && phase <= 3 && (
            <motion.p
              key={`intro-msg-${phase}`}
              className="intro-line"
              initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
              transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            >
              {sequenceMessages[phase - 1]}
            </motion.p>
          )}

          {phase === 4 && (
            <motion.div
              key="intro-final"
              className="intro-final-wrap"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="intro-kicker">
                {pagluConfig.universeTitle} • {pagluConfig.universeSubtitle}
              </span>

              <h1 className="intro-final-prompt">{callToActionPrompt}</h1>

              <button
                type="button"
                className="intro-enter-btn"
                onClick={handleEnterClick}
                onMouseEnter={() => soundEngine.playHover()}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                  <Sparkles size={18} />
                  {enterButtonLabel}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {starsAwake && (
        <div className="intro-progress-dots" aria-hidden="true">
          {[1, 2, 3, 4].map((step) => (
            <span
              key={step}
              className={`intro-dot ${phase === step ? 'active' : ''}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
