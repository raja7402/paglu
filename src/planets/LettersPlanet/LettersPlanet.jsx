import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Mail, MailOpen, Sparkles, X } from 'lucide-react';
import pagluConfig from '../../config/pagluConfig';
import soundEngine from '../../utils/soundEngine';
import CosmicBackdrop from '../../components/Navigation/CosmicBackdrop';
import './LettersPlanet.css';

export default function LettersPlanet({ openedLetters = [], onMarkLetterOpened }) {
  const lp = pagluConfig.lettersPlanet;
  const envelopes = lp.envelopes;

  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    if (activeIndex === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowRight') {
        setActiveIndex((i) => (i + 1) % envelopes.length);
      }
      if (e.key === 'ArrowLeft') {
        setActiveIndex((i) => (i - 1 + envelopes.length) % envelopes.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIndex, envelopes.length]);

  const handleOpenEnvelope = (idx) => {
    soundEngine.playEnvelopeOpen();
    setActiveIndex(idx);
    const env = envelopes[idx];
    if (env && onMarkLetterOpened) {
      onMarkLetterOpened(env.id);
    }
  };

  const activeLetter = activeIndex !== null ? envelopes[activeIndex] : null;

  return (
    <div className="planet-page" aria-label="Letters Planet – Messages From Another World">
      <CosmicBackdrop accent="#f472b6" secondary="#a855f7" density={60} />

      <div className="planet-container">
        <header className="planet-hero">
          <span className="cosmic-badge" style={{ borderColor: 'rgba(244,114,182,0.45)', color: '#f9a8d4' }}>
            <Mail size={13} />
            <span>Planet 04 • Messages From Another World</span>
          </span>
          <h1 className="planet-hero-title">{lp.heroTitle}</h1>
          <p className="planet-hero-subtitle">{lp.heroSubtitle}</p>
          <div className="editable-notice">
            <span>💌 Personalise every letter inside src/config/pagluConfig.js</span>
          </div>
        </header>

        {/* 7 Magical Envelopes Grid */}
        <div className="envelopes-grid">
          {envelopes.map((env, idx) => {
            const isOpened = openedLetters.includes(env.id);
            return (
              <motion.button
                key={env.id}
                type="button"
                className="magical-envelope-card"
                style={{ '--seal-color': env.sealColor }}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06, duration: 0.4 }}
                onClick={() => handleOpenEnvelope(idx)}
              >
                {/* Illustrated Magical Envelope & Glowing Wax Seal */}
                <svg viewBox="0 0 220 110" className="envelope-flap-svg" aria-hidden="true">
                  <rect
                    x="10"
                    y="14"
                    width="200"
                    height="86"
                    rx="12"
                    fill="rgba(17, 22, 54, 0.9)"
                    stroke={env.sealColor}
                    strokeOpacity="0.6"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M 12 18 L 110 68 L 208 18"
                    fill="none"
                    stroke={env.sealColor}
                    strokeWidth="1.8"
                    strokeOpacity="0.85"
                  />
                  <path
                    d="M 14 96 L 82 54 M 206 96 L 138 54"
                    stroke="rgba(255,255,255,0.14)"
                    strokeWidth="1.3"
                  />
                  <circle
                    cx="110"
                    cy="64"
                    r="16"
                    fill={env.sealColor}
                    fillOpacity="0.28"
                    stroke={env.sealColor}
                    strokeWidth="1.8"
                  />
                  <text
                    x="110"
                    y="69"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="13"
                  >
                    ♥
                  </text>
                </svg>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: 'var(--font-tech)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: env.sealColor,
                    marginBottom: 8
                  }}
                >
                  {isOpened ? <MailOpen size={13} /> : <Sparkles size={13} />}
                  <span>
                    Envelope 0{env.order} • {env.moodTag}
                  </span>
                </div>

                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.12rem',
                    color: '#ffffff',
                    lineHeight: 1.35,
                    marginBottom: 10
                  }}
                >
                  {env.title}
                </h2>

                <span
                  style={{
                    fontSize: '0.78rem',
                    color: isOpened ? '#86efac' : '#cbd5e1'
                  }}
                >
                  {isOpened ? 'Opened ✓ — Tap to read again' : 'Tap to break starlight seal'}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* OPENED ENVELOPE MODAL */}
      <AnimatePresence>
        {activeLetter && (
          <motion.div
            className="letter-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveIndex(null)}
          >
            <motion.article
              key={activeLetter.id}
              className="letter-parchment-glass"
              initial={{ opacity: 0, scale: 0.9, rotateX: 14, y: 24 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Subtle Floating Hearts & Particles */}
              <div className="letter-floating-hearts" aria-hidden="true">
                {[12, 28, 48, 68, 84].map((leftPct, i) => (
                  <span
                    key={i}
                    className="letter-heart-particle"
                    style={{
                      left: `${leftPct}%`,
                      '--dur': `${4.8 + i * 0.7}s`,
                      '--delay': `${i * 0.8}s`
                    }}
                  >
                    ♥
                  </span>
                ))}
              </div>

              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 22
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    fontFamily: 'var(--font-tech)',
                    fontSize: '0.76rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: activeLetter.sealColor
                  }}
                >
                  <Heart size={14} />
                  <span>{activeLetter.moodTag}</span>
                </span>

                <button
                  type="button"
                  className="cosmic-btn-ghost"
                  style={{ minHeight: 36, padding: '6px 12px' }}
                  onClick={() => setActiveIndex(null)}
                >
                  <X size={15} />
                  <span>Close</span>
                </button>
              </div>

              <h2
                style={{
                  position: 'relative',
                  zIndex: 2,
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.35rem, 3vw, 1.85rem)',
                  color: '#ffffff',
                  marginBottom: 20
                }}
              >
                {activeLetter.title}
              </h2>

              <div className="letter-body-text" style={{ position: 'relative', zIndex: 2 }}>
                <p style={{ fontWeight: 600, color: '#fbcfe8' }}>{activeLetter.salutation}</p>

                {activeLetter.paragraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}

                <p
                  style={{
                    marginTop: 26,
                    whiteSpace: 'pre-line',
                    fontStyle: 'italic',
                    color: '#e9d5ff'
                  }}
                >
                  {activeLetter.signOff}
                </p>
              </div>

              {/* Prev / Next Envelope Controls */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  marginTop: 26,
                  paddingTop: 16,
                  borderTop: '1px solid rgba(148, 163, 184, 0.18)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <button
                  type="button"
                  className="cosmic-btn-ghost"
                  onClick={() => {
                    const prevIdx = (activeIndex - 1 + envelopes.length) % envelopes.length;
                    handleOpenEnvelope(prevIdx);
                  }}
                >
                  <ChevronLeft size={16} />
                  <span>Prev Letter</span>
                </button>

                <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'var(--font-tech)' }}>
                  {activeIndex + 1} / {envelopes.length}
                </span>

                <button
                  type="button"
                  className="cosmic-btn-ghost"
                  onClick={() => {
                    const nextIdx = (activeIndex + 1) % envelopes.length;
                    handleOpenEnvelope(nextIdx);
                  }}
                >
                  <span>Next Letter</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
