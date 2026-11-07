import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  Compass,
  Eye,
  HelpCircle,
  KeyRound,
  Lock,
  RotateCcw,
  Sparkles,
  Unlock
} from 'lucide-react';
import pagluConfig from '../../config/pagluConfig';
import soundEngine from '../../utils/soundEngine';
import CosmicBackdrop from '../../components/Navigation/CosmicBackdrop';
import './MysteryPlanet.css';

export default function MysteryPlanet({
  completedLevels = [],
  onCompleteLevel,
  onNavigateFinalDestination
}) {
  const mys = pagluConfig.mysteryPlanet;

  // Determine initial active stage based on saved progress
  const initialStage = completedLevels.includes(3)
    ? 4
    : completedLevels.includes(2)
    ? 3
    : completedLevels.includes(1)
    ? 2
    : 1;

  const [stage, setStage] = useState(initialStage); // 1 | 2 | 3 | 4 (Secret Room)
  const [feedback, setFeedback] = useState(null); // { type: 'error' | 'success', text: string }
  const [showHint, setShowHint] = useState(false);
  const [shakeCard, setShakeCard] = useState(false);

  // Level 2 State: Visual Hidden Message Scanner
  const targetWord = mys.level2HiddenMessage.targetWord.toUpperCase();
  const [selectedRunes, setSelectedRunes] = useState([]); // array of node ids
  const [scannerPos, setScannerPos] = useState({ x: 50, y: 50 });
  const [pulseRevealAll, setPulseRevealAll] = useState(false);
  const boardRef = useRef(null);

  // Level 3 State: Final Code Vault
  const targetCode = String(mys.level3FinalCode.code);
  const [codeDigits, setCodeDigits] = useState('');

  const runeNodes = useMemo(() => {
    const letters = [
      ...targetWord.split('').map((ch, idx) => ({
        id: `target-${idx}`,
        char: ch,
        isTarget: true
      })),
      ...mys.level2HiddenMessage.decoyLetters.slice(0, 5).map((ch, idx) => ({
        id: `decoy-${idx}`,
        char: ch,
        isTarget: false
      }))
    ];

    // Well-spaced deterministic starfield coordinates (in percentages)
    const coords = [
      { x: 18, y: 24 },
      { x: 46, y: 20 },
      { x: 78, y: 26 },
      { x: 30, y: 54 },
      { x: 64, y: 50 },
      { x: 20, y: 78 },
      { x: 52, y: 80 },
      { x: 82, y: 72 },
      { x: 84, y: 46 },
      { x: 38, y: 34 }
    ];

    return letters.map((item, idx) => ({
      ...item,
      x: coords[idx % coords.length].x,
      y: coords[idx % coords.length].y
    }));
  }, [targetWord, mys.level2HiddenMessage.decoyLetters]);

  // Reset feedback & hint when switching levels
  useEffect(() => {
    setFeedback(null);
    setShowHint(false);
  }, [stage]);

  // Keyboard support for Level 3 digits
  useEffect(() => {
    if (stage !== 3) return undefined;
    const onKeyDown = (e) => {
      if (/^[0-9]$/.test(e.key)) {
        setCodeDigits((prev) => (prev.length < targetCode.length ? prev + e.key : prev));
      } else if (e.key === 'Backspace') {
        setCodeDigits((prev) => prev.slice(0, -1));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [stage, targetCode.length]);

  const triggerWrong = (message) => {
    soundEngine.playError();
    setFeedback({ type: 'error', text: message });
    setShakeCard(true);
    setTimeout(() => setShakeCard(false), 480);
  };

  // LEVEL 1 HANDLER
  const handleLevel1Choice = (idx) => {
    if (idx === mys.level1Riddle.correctIndex) {
      soundEngine.playSuccess();
      setFeedback({ type: 'success', text: mys.level1Riddle.correctFeedback });
      onCompleteLevel(1);
      setTimeout(() => {
        setStage(2);
      }, 1350);
    } else {
      triggerWrong(mys.level1Riddle.wrongFeedback);
    }
  };

  // LEVEL 2 HANDLERS
  const updateScannerFromEvent = (clientX, clientY) => {
    if (!boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(95, ((clientY - rect.top) / rect.height) * 100));
    setScannerPos({ x, y });
  };

  const handleRuneTap = (node) => {
    if (selectedRunes.some((r) => r.id === node.id)) return;
    soundEngine.playClick();

    const nextSelection = [...selectedRunes, node];
    const formedSoFar = nextSelection.map((r) => r.char).join('');

    // Verify prefix immediately so player knows right away if they tapped a decoy or wrong order
    if (!targetWord.startsWith(formedSoFar)) {
      triggerWrong(mys.level2HiddenMessage.wrongFeedback);
      setSelectedRunes([]);
      return;
    }

    setSelectedRunes(nextSelection);
    setFeedback(null);

    if (formedSoFar === targetWord) {
      soundEngine.playSuccess();
      setFeedback({ type: 'success', text: mys.level2HiddenMessage.correctFeedback });
      onCompleteLevel(2);
      setTimeout(() => {
        setStage(3);
      }, 1450);
    }
  };

  // LEVEL 3 HANDLER
  const handleVerifyVaultCode = () => {
    if (codeDigits === targetCode) {
      soundEngine.playUnlock();
      setFeedback({ type: 'success', text: mys.level3FinalCode.correctFeedback });
      onCompleteLevel(3);
      setTimeout(() => {
        setStage(4);
      }, 1450);
    } else {
      triggerWrong(mys.level3FinalCode.wrongFeedback);
      setCodeDigits('');
    }
  };

  const currentHintText =
    stage === 1
      ? mys.level1Riddle.hint
      : stage === 2
      ? mys.level2HiddenMessage.hint
      : mys.level3FinalCode.hint;

  return (
    <div className="planet-page" aria-label="Mystery Planet – The Secret Adventure">
      <CosmicBackdrop accent="#a855f7" secondary="#38bdf8" density={65} />

      <div className="planet-container">
        <header className="planet-hero">
          <span className="cosmic-badge">
            <KeyRound size={13} />
            <span>Planet 02 • The Secret Adventure</span>
          </span>
          <h1 className="planet-hero-title">{mys.heroTitle}</h1>
          <p className="planet-hero-subtitle">{mys.heroSubtitle}</p>
        </header>

        {/* 3-Level + Secret Room Progress Indicator */}
        <div className="mystery-stepper" role="navigation" aria-label="Adventure Levels">
          {[
            { num: 1, label: 'Level 1: The Riddle' },
            { num: 2, label: 'Level 2: Hidden Message' },
            { num: 3, label: 'Level 3: Final Code' },
            { num: 4, label: 'Secret Sanctuary' }
          ].map((item) => {
            const isDone =
              item.num < 4 ? completedLevels.includes(item.num) : completedLevels.includes(3);
            const isUnlocked =
              item.num === 1 ||
              completedLevels.includes(item.num - 1) ||
              (item.num === 4 && completedLevels.includes(3));
            const isActive = stage === item.num;

            return (
              <button
                key={item.num}
                type="button"
                disabled={!isUnlocked}
                onClick={() => {
                  if (isUnlocked) {
                    soundEngine.playClick();
                    setStage(item.num);
                  }
                }}
                className={`mystery-step-pill ${isActive ? 'active' : isDone ? 'done' : ''}`}
                style={{ opacity: isUnlocked ? 1 : 0.48 }}
              >
                {isDone ? <CheckCircle2 size={15} /> : isUnlocked ? <Unlock size={14} /> : <Lock size={14} />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* ================================================================
            ACTIVE LEVEL ARENA
            ================================================================ */}
        <div className={`mystery-arena-card ${shakeCard ? 'animate-shake' : ''}`}>
          <AnimatePresence mode="wait">
            {/* LEVEL 1: THE RIDDLE */}
            {stage === 1 && (
              <motion.div
                key="mystery-lvl-1"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
              >
                <span className="cosmic-badge" style={{ marginBottom: 10 }}>
                  Trial I of III
                </span>
                <h2 className="section-heading">{mys.level1Riddle.title}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.93rem' }}>
                  {mys.level1Riddle.lore}
                </p>

                <blockquote className="mystery-riddle-quote">
                  {mys.level1Riddle.riddle}
                </blockquote>

                <div className="mystery-options-grid">
                  {mys.level1Riddle.options.map((opt, idx) => (
                    <button
                      key={opt}
                      type="button"
                      className="mystery-option-btn"
                      onClick={() => handleLevel1Choice(idx)}
                    >
                      <strong style={{ color: '#a855f7', marginRight: 8 }}>
                        {String.fromCharCode(65 + idx)}.
                      </strong>
                      {opt}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* LEVEL 2: THE HIDDEN MESSAGE */}
            {stage === 2 && (
              <motion.div
                key="mystery-lvl-2"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 10
                  }}
                >
                  <span className="cosmic-badge">Trial II of III</span>
                  <button
                    type="button"
                    className="cosmic-btn-ghost"
                    style={{ minHeight: 36, padding: '6px 14px', fontSize: '0.76rem' }}
                    onClick={() => {
                      soundEngine.playClick();
                      setPulseRevealAll((v) => !v);
                    }}
                  >
                    <Eye size={14} />
                    <span>{pulseRevealAll ? 'Normal Scanner Lens' : 'Illuminate Starfield'}</span>
                  </button>
                </div>

                <h2 className="section-heading">{mys.level2HiddenMessage.title}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: 8 }}>
                  {mys.level2HiddenMessage.lore}
                </p>
                <p style={{ color: '#93c5fd', fontSize: '0.84rem', fontFamily: 'var(--font-tech)' }}>
                  Clue: {mys.level2HiddenMessage.clue}
                </p>

                {/* Decoded Rune Slots */}
                <div className="scanner-slots" style={{ marginTop: 18 }}>
                  {targetWord.split('').map((_, idx) => (
                    <div key={idx} className="scanner-slot">
                      {selectedRunes[idx]?.char || '•'}
                    </div>
                  ))}
                </div>

                {/* Interactive Starfield Board */}
                <div
                  ref={boardRef}
                  className="scanner-board"
                  onMouseMove={(e) => updateScannerFromEvent(e.clientX, e.clientY)}
                  onTouchMove={(e) => {
                    if (e.touches[0]) {
                      updateScannerFromEvent(e.touches[0].clientX, e.touches[0].clientY);
                    }
                  }}
                >
                  <div
                    className="scanner-beam"
                    style={{ left: `${scannerPos.x}%`, top: `${scannerPos.y}%` }}
                  />

                  {runeNodes.map((node) => {
                    const dx = scannerPos.x - node.x;
                    const dy = scannerPos.y - node.y;
                    const dist = Math.hypot(dx, dy);
                    const isPicked = selectedRunes.some((r) => r.id === node.id);
                    const isLit = pulseRevealAll || isPicked || dist < 24;

                    return (
                      <button
                        key={node.id}
                        type="button"
                        className="scanner-rune-node"
                        onClick={() => handleRuneTap(node)}
                        style={{
                          left: `${node.x}%`,
                          top: `${node.y}%`,
                          opacity: isPicked ? 1 : isLit ? 0.96 : 0.22,
                          background: isPicked
                            ? 'linear-gradient(135deg, #38bdf8, #a855f7)'
                            : 'rgba(15, 23, 52, 0.88)',
                          border: `1.5px solid ${
                            isPicked ? '#ffffff' : isLit ? '#38bdf8' : 'rgba(148,163,184,0.3)'
                          }`,
                          color: isPicked ? '#ffffff' : isLit ? '#f8fafc' : 'transparent',
                          boxShadow: isLit ? '0 0 18px rgba(56, 189, 248, 0.55)' : 'none',
                          transform: `translate(-50%, -50%) scale(${isPicked ? 1.12 : 1})`
                        }}
                        aria-label={`Cosmic rune ${isLit ? node.char : 'hidden'}`}
                      >
                        {isLit ? node.char : '✦'}
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    type="button"
                    className="cosmic-btn-ghost"
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedRunes([]);
                    }}
                  >
                    <RotateCcw size={14} />
                    <span>Reset Selected Runes</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* LEVEL 3: THE FINAL CODE */}
            {stage === 3 && (
              <motion.div
                key="mystery-lvl-3"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
              >
                <span className="cosmic-badge" style={{ marginBottom: 10 }}>
                  Final Trial • III of III
                </span>
                <h2 className="section-heading">{mys.level3FinalCode.title}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.93rem' }}>
                  {mys.level3FinalCode.lore}
                </p>

                <div className="vault-clues-list">
                  {mys.level3FinalCode.clues.map((clue, idx) => (
                    <div key={idx} className="vault-clue-item">
                      {clue}
                    </div>
                  ))}
                </div>

                <div className="vault-code-display" aria-label="Entered 4-digit code">
                  {Array.from({ length: targetCode.length }, (_, idx) => (
                    <div key={idx} className="vault-digit-box">
                      {codeDigits[idx] || '–'}
                    </div>
                  ))}
                </div>

                <div className="vault-keypad">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                      key={num}
                      type="button"
                      className="vault-key-btn"
                      onClick={() => {
                        soundEngine.playClick();
                        if (codeDigits.length < targetCode.length) {
                          setCodeDigits((prev) => prev + String(num));
                        }
                      }}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="vault-key-btn"
                    style={{ fontSize: '0.8rem', color: '#fda4af' }}
                    onClick={() => {
                      soundEngine.playClick();
                      setCodeDigits('');
                    }}
                  >
                    CLEAR
                  </button>
                  <button
                    type="button"
                    className="vault-key-btn"
                    onClick={() => {
                      soundEngine.playClick();
                      if (codeDigits.length < targetCode.length) {
                        setCodeDigits((prev) => prev + '0');
                      }
                    }}
                  >
                    0
                  </button>
                  <button
                    type="button"
                    className="vault-key-btn"
                    style={{ fontSize: '0.8rem', color: '#93c5fd' }}
                    onClick={() => {
                      soundEngine.playClick();
                      setCodeDigits((prev) => prev.slice(0, -1));
                    }}
                  >
                    DEL
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    type="button"
                    className="cosmic-btn-primary"
                    disabled={codeDigits.length !== targetCode.length}
                    onClick={handleVerifyVaultCode}
                  >
                    <Unlock size={17} />
                    <span>UNLOCK CELESTIAL VAULT</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STAGE 4: THE SECRET ROOM */}
            {stage === 4 && (
              <motion.div
                key="mystery-secret-room"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '12px 6px' }}
              >
                <div
                  className="animate-pulse-aura"
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: '50%',
                    margin: '0 auto 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background:
                      'radial-gradient(circle, rgba(251, 191, 36, 0.35), rgba(168, 85, 247, 0.35))',
                    border: '1.5px solid #fde68a'
                  }}
                >
                  <Sparkles size={36} color="#fef08a" />
                </div>

                <span
                  className="cosmic-badge"
                  style={{
                    borderColor: 'rgba(251, 191, 36, 0.55)',
                    color: '#fde68a',
                    background: 'rgba(251, 191, 36, 0.12)'
                  }}
                >
                  {mys.secretRoom.unlockBadgeText}
                </span>

                <h2
                  className="section-heading"
                  style={{ marginTop: 16, fontSize: 'clamp(1.5rem, 3.2vw, 2.2rem)' }}
                >
                  {mys.secretRoom.title}
                </h2>

                <p
                  style={{
                    fontFamily: 'var(--font-tech)',
                    fontSize: '0.84rem',
                    letterSpacing: '0.14em',
                    color: '#38bdf8',
                    marginBottom: 18
                  }}
                >
                  RELIC RECOVERED: {mys.secretRoom.artifactName.toUpperCase()}
                </p>

                <p
                  style={{
                    maxWidth: 620,
                    margin: '0 auto 28px',
                    padding: '22px',
                    borderRadius: 20,
                    background: 'rgba(20, 15, 45, 0.72)',
                    border: '1px solid rgba(251, 191, 36, 0.28)',
                    fontSize: '0.98rem',
                    lineHeight: 1.7,
                    color: '#f1f5f9'
                  }}
                >
                  {mys.secretRoom.secretMessage}
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: 12
                  }}
                >
                  <button
                    type="button"
                    className="cosmic-btn-primary"
                    onClick={() => {
                      soundEngine.playUnlock();
                      onNavigateFinalDestination();
                    }}
                  >
                    <Compass size={18} />
                    <span>WARP TO FINAL DESTINATION</span>
                  </button>

                  <button
                    type="button"
                    className="cosmic-btn-ghost"
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedRunes([]);
                      setCodeDigits('');
                      setStage(1);
                    }}
                  >
                    <RotateCcw size={15} />
                    <span>Replay Trials</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Shared Feedback & Hint Footer for Levels 1–3 */}
          {stage <= 3 && (
            <div style={{ marginTop: 22 }}>
              <AnimatePresence mode="wait">
                {feedback && (
                  <motion.div
                    key={feedback.text}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      padding: '13px 16px',
                      borderRadius: 14,
                      marginBottom: 14,
                      textAlign: 'center',
                      fontSize: '0.9rem',
                      background:
                        feedback.type === 'success'
                          ? 'rgba(16, 185, 129, 0.16)'
                          : 'rgba(244, 63, 94, 0.14)',
                      border: `1px solid ${
                        feedback.type === 'success'
                          ? 'rgba(52, 211, 153, 0.45)'
                          : 'rgba(251, 113, 133, 0.42)'
                      }`,
                      color: feedback.type === 'success' ? '#a7f3d0' : '#fecdd3'
                    }}
                  >
                    {feedback.text}
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  className="cosmic-btn-ghost"
                  onClick={() => {
                    soundEngine.playClick();
                    setShowHint((h) => !h);
                  }}
                >
                  <HelpCircle size={15} color="#38bdf8" />
                  <span>{showHint ? 'Hide Hint' : 'Reveal Celestial Hint'}</span>
                </button>

                <AnimatePresence>
                  {showHint && (
                    <motion.p
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{
                        marginTop: 12,
                        padding: '12px 16px',
                        borderRadius: 14,
                        background: 'rgba(56, 189, 248, 0.1)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        color: '#e0f2fe',
                        fontSize: '0.88rem'
                      }}
                    >
                      💡 {currentHintText}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
