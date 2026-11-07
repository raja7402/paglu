import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Eye, EyeOff, HelpCircle, Sparkles, KeyRound } from 'lucide-react';
import pagluConfig from '../../config/pagluConfig';
import soundEngine from '../../utils/soundEngine';
import CosmicBackdrop from '../Navigation/CosmicBackdrop';
import './PasswordGate.css';

export default function PasswordGate({ onUnlocked }) {
  const gateCfg = pagluConfig.passwordGate;

  const [inputValue, setInputValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  // 'locked' | 'unlocking' | 'welcome-1' | 'welcome-2'
  const [unlockPhase, setUnlockPhase] = useState('locked');

  const explosionCanvasRef = useRef(null);
  const timersRef = useRef([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  // Trigger colorful cosmic particle explosion on canvas when unlocked
  const triggerParticleExplosion = () => {
    const canvas = explosionCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const colors = ['#38bdf8', '#a855f7', '#f472b6', '#fbbf24', '#ffffff', '#22d3ee'];

    const particles = Array.from({ length: 130 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9.5 + 2.2;
      return {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: Math.random() * 3.8 + 1.4,
        alpha: 1,
        decay: Math.random() * 0.014 + 0.009,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    });

    let frameId;
    const animateExplosion = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach((p) => {
        if (p.alpha <= 0) return;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.vy += 0.04;
        p.alpha -= p.decay;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 14;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      if (alive) {
        frameId = requestAnimationFrame(animateExplosion);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animateExplosion();
    timersRef.current.push(
      setTimeout(() => {
        if (frameId) cancelAnimationFrame(frameId);
      }, 4000)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (unlockPhase !== 'locked') return;

    soundEngine.unlockAudioFromGesture(true);

    const cleaned = inputValue.trim();
    if (cleaned === String(gateCfg.password)) {
      setErrorMsg('');
      setUnlockPhase('unlocking');
      soundEngine.playUnlock();
      triggerParticleExplosion();

      timersRef.current.push(
        setTimeout(() => setUnlockPhase('welcome-1'), 900),
        setTimeout(() => setUnlockPhase('welcome-2'), 3200),
        setTimeout(() => onUnlocked(), 6400)
      );
    } else {
      soundEngine.playError();
      const responses = gateCfg.wrongPasswordResponses;
      const nextMsg = responses[errorCount % responses.length];
      setErrorMsg(nextMsg);
      setErrorCount((c) => c + 1);
      if (errorCount >= 1) {
        setShowHint(true);
      }
      setIsShaking(true);
      timersRef.current.push(setTimeout(() => setIsShaking(false), 500));
    }
  };

  return (
    <section className="gate-root" aria-label="Secret Gate Password Protection">
      <CosmicBackdrop accent="#a855f7" secondary="#38bdf8" density={65} />
      <canvas ref={explosionCanvasRef} className="gate-explosion-canvas" />

      {unlockPhase === 'locked' || unlockPhase === 'unlocking' ? (
        <motion.div
          key="gate-form-card"
          className={`gate-card ${isShaking ? 'animate-shake' : ''}`}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="gate-lock-emblem" aria-hidden="true">
            <div
              className="gate-lock-ring-outer"
              style={{
                transform: `rotate(${inputValue.length * 36}deg)`
              }}
            />
            <div className="gate-lock-ring-inner" />
            <div
              className={`gate-lock-core ${
                unlockPhase === 'unlocking' ? 'unlocked' : isShaking ? 'error' : ''
              }`}
            >
              {unlockPhase === 'unlocking' ? <Unlock size={25} /> : <Lock size={24} />}
            </div>
          </div>

          <div className="gate-recipient-pill">
            <Sparkles size={13} />
            <span>VIP Clearance: {pagluConfig.recipientName}</span>
          </div>

          <h1 className="gate-title">{gateCfg.headline}</h1>
          <p className="gate-subtitle">{gateCfg.subheadline}</p>

          <form className="gate-form" onSubmit={handleSubmit}>
            <div className="gate-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="gate-input"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder={gateCfg.placeholder}
                aria-label="Secret gate password"
                autoComplete="off"
                disabled={unlockPhase === 'unlocking'}
              />
              <button
                type="button"
                className="gate-eye-btn"
                onClick={() => {
                  soundEngine.playClick();
                  setShowPassword((prev) => !prev);
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              className="cosmic-btn-primary"
              disabled={!inputValue.trim() || unlockPhase === 'unlocking'}
              style={{ width: '100%', marginTop: 4 }}
            >
              <KeyRound size={17} />
              <span>
                {unlockPhase === 'unlocking'
                  ? 'ASTRAL LOCK DISENGAGED...'
                  : gateCfg.unlockButtonLabel}
              </span>
            </button>

            <button
              type="button"
              className="gate-hint-toggle"
              onClick={() => {
                soundEngine.playClick();
                setShowHint((h) => !h);
              }}
            >
              <HelpCircle size={15} />
              <span>{showHint ? 'Hide password hint' : 'Need a cosmic hint?'}</span>
            </button>
          </form>

          {showHint && (
            <motion.div
              className="gate-hint-box"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <strong>Hint:</strong> {gateCfg.hint}
            </motion.div>
          )}

          {errorMsg && (
            <motion.div
              key={errorCount}
              className="gate-error-box"
              role="alert"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errorMsg}
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div
          key="gate-welcome-sequence"
          className="gate-welcome-stage"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.h2
            className="gate-welcome-primary"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {gateCfg.unlockSuccessPrimary}
          </motion.h2>

          {unlockPhase === 'welcome-2' && (
            <motion.p
              className="gate-welcome-secondary"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95 }}
            >
              {gateCfg.unlockSuccessSecondary}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            style={{ marginTop: 28 }}
          >
            <button
              type="button"
              className="cosmic-btn-ghost"
              onClick={() => {
                timersRef.current.forEach((t) => clearTimeout(t));
                onUnlocked();
              }}
            >
              <Sparkles size={15} />
              <span>Enter Galaxy Now</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
