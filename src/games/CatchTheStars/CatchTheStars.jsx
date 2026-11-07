import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Sparkles, Timer, Trophy, Zap } from 'lucide-react';
import pagluConfig from '../../config/pagluConfig';
import soundEngine from '../../utils/soundEngine';
import { persistStarsHighScore } from '../../utils/universeStore';

export default function CatchTheStars({ initialHighScore = 0 }) {
  const cfg = pagluConfig.funPlanet.catchTheStars;
  const totalTime = cfg.gameDurationSeconds || 45;

  const [gameState, setGameState] = useState('idle'); // 'idle' | 'playing' | 'ended'
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(initialHighScore);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [wave, setWave] = useState(1);
  const [combo, setCombo] = useState(1);

  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const stateRef = useRef({
    score: 0,
    combo: 1,
    timeLeft: totalTime,
    paddleX: 0.5, // normalized 0..1
    items: [],
    popups: [],
    bgStars: [],
    keys: { left: false, right: false },
    lastSpawn: 0
  });

  const startGame = useCallback(() => {
    soundEngine.unlockAudioFromGesture(false);
    soundEngine.playSuccess();
    stateRef.current = {
      score: 0,
      combo: 1,
      timeLeft: totalTime,
      paddleX: 0.5,
      items: [],
      popups: [],
      bgStars: Array.from({ length: 55 }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.5 + 0.5
      })),
      keys: { left: false, right: false },
      lastSpawn: 0
    };
    setScore(0);
    setCombo(1);
    setWave(1);
    setTimeLeft(totalTime);
    setGameState('playing');
  }, [totalTime]);

  // Timer countdown & escalating difficulty waves
  useEffect(() => {
    if (gameState !== 'playing') return undefined;

    const timer = setInterval(() => {
      stateRef.current.timeLeft -= 1;
      const remaining = stateRef.current.timeLeft;
      setTimeLeft(remaining);

      const elapsed = totalTime - remaining;
      if (elapsed >= 30) {
        setWave(3);
      } else if (elapsed >= 15) {
        setWave(2);
      } else {
        setWave(1);
      }

      if (remaining <= 0) {
        clearInterval(timer);
        const finalScore = stateRef.current.score;
        setHighScore((prev) => {
          const next = Math.max(prev, finalScore);
          persistStarsHighScore(next);
          return next;
        });
        soundEngine.playUnlock();
        setGameState('ended');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, totalTime]);

  // Keyboard arrow controls
  useEffect(() => {
    if (gameState !== 'playing') return undefined;
    const down = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') stateRef.current.keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') stateRef.current.keys.right = true;
    };
    const up = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') stateRef.current.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') stateRef.current.keys.right = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [gameState]);

  // 60fps Canvas Arcade Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');

    const syncSize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = Math.max(300, Math.floor(rect.width));
      canvas.height = Math.min(460, Math.max(340, Math.floor(window.innerHeight * 0.52)));
    };
    syncSize();
    window.addEventListener('resize', syncSize);

    const drawStarShape = (cx, cy, spikes, outerR, innerR, color) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy - outerR);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerR;
        y = cy + Math.sin(rot) * outerR;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerR;
        y = cy + Math.sin(rot) * innerR;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerR);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.shadowBlur = 16;
      ctx.shadowColor = color;
      ctx.fill();
      ctx.restore();
    };

    const loop = (timestamp) => {
      const w = canvas.width;
      const h = canvas.height;
      const st = stateRef.current;

      // Cosmic sky gradient
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#040614');
      bg.addColorStop(0.6, '#0d1333');
      bg.addColorStop(1, '#1c0f3b');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Static twinkling sky stars
      ctx.fillStyle = 'rgba(255,255,255,0.65)';
      st.bgStars.forEach((bs) => {
        ctx.beginPath();
        ctx.arc(bs.x * w, bs.y * h, bs.r, 0, Math.PI * 2);
        ctx.fill();
      });

      if (gameState === 'playing') {
        const elapsed = totalTime - st.timeLeft;
        const difficultyFactor = 1 + (elapsed / totalTime) * 1.45; // Smoothly ramps speed & spawn rate!
        const spawnInterval = Math.max(240, 680 - elapsed * 9.5);

        if (timestamp - st.lastSpawn > spawnInterval) {
          st.lastSpawn = timestamp;
          const roll = Math.random();
          // Types: 'star' (+10), 'heart' (+25), 'meteor' (-15 & combo reset)
          let type = 'star';
          if (roll > 0.84) type = 'heart';
          else if (roll < 0.16 + (elapsed / totalTime) * 0.1) type = 'meteor';

          st.items.push({
            x: 0.08 + Math.random() * 0.84,
            y: -24,
            vy: (2.3 + Math.random() * 1.7) * difficultyFactor,
            type,
            rot: Math.random() * Math.PI
          });
        }

        // Keyboard movement
        if (st.keys.left) st.paddleX = Math.max(0.08, st.paddleX - 0.018);
        if (st.keys.right) st.paddleX = Math.min(0.92, st.paddleX + 0.018);

        const catcherW = Math.min(116, Math.max(82, w * 0.17));
        const catcherH = 18;
        const catcherX = st.paddleX * w;
        const catcherY = h - 34;

        // Draw Glowing Starlight Catcher Vessel
        ctx.save();
        const catcherGrad = ctx.createLinearGradient(
          catcherX - catcherW / 2,
          catcherY,
          catcherX + catcherW / 2,
          catcherY
        );
        catcherGrad.addColorStop(0, '#38bdf8');
        catcherGrad.addColorStop(0.5, '#ffffff');
        catcherGrad.addColorStop(1, '#ec4899');
        ctx.fillStyle = catcherGrad;
        ctx.shadowBlur = 22;
        ctx.shadowColor = '#38bdf8';
        ctx.beginPath();
        ctx.roundRect(catcherX - catcherW / 2, catcherY, catcherW, catcherH, 99);
        ctx.fill();
        ctx.restore();

        // Update & Draw Falling Cosmic Objects
        st.items = st.items.filter((item) => {
          item.y += item.vy;
          const px = item.x * w;
          const py = item.y;

          // Draw object
          if (item.type === 'star') {
            drawStarShape(px, py, 5, 13, 6, '#fbbf24');
          } else if (item.type === 'heart') {
            drawStarShape(px, py, 6, 15, 7.5, '#f472b6');
          } else {
            ctx.save();
            ctx.fillStyle = '#fb7185';
            ctx.shadowBlur = 14;
            ctx.shadowColor = '#e11d48';
            ctx.beginPath();
            ctx.arc(px, py, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#1f1024';
            ctx.beginPath();
            ctx.arc(px - 2, py - 2, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // Collision check with catcher vessel
          const hitY = py >= catcherY - 12 && py <= catcherY + catcherH + 10;
          const hitX = Math.abs(px - catcherX) <= catcherW / 2 + 12;

          if (hitX && hitY) {
            if (item.type === 'meteor') {
              soundEngine.playError();
              st.combo = 1;
              st.score = Math.max(0, st.score - 10);
              setCombo(1);
              setScore(st.score);
              st.popups.push({ x: px, y: py - 10, text: 'Meteor! -10', color: '#fb7185', a: 1 });
            } else {
              const basePts = item.type === 'heart' ? 25 : 10;
              const pts = basePts * Math.min(4, Math.floor(1 + st.combo * 0.25));
              st.score += pts;
              st.combo += 1;
              setScore(st.score);
              setCombo(st.combo);
              soundEngine.playStarCatch(item.type === 'heart');
              st.popups.push({
                x: px,
                y: py - 10,
                text: `+${pts}`,
                color: item.type === 'heart' ? '#f472b6' : '#fde68a',
                a: 1
              });
            }
            return false;
          }

          // Missed golden/heart star resets streak gently
          if (py > h + 20) {
            if (item.type !== 'meteor') {
              st.combo = 1;
              setCombo(1);
            }
            return false;
          }
          return true;
        });

        // Floating Score Popups
        st.popups = st.popups.filter((pop) => {
          pop.y -= 1.2;
          pop.a -= 0.025;
          if (pop.a <= 0) return false;
          ctx.save();
          ctx.globalAlpha = pop.a;
          ctx.fillStyle = pop.color;
          ctx.font = 'bold 15px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(pop.text, pop.x, pop.y);
          ctx.restore();
          return true;
        });
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('resize', syncSize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [gameState, totalTime]);

  const handlePointerMove = (clientX) => {
    if (gameState !== 'playing' || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const norm = (clientX - rect.left) / rect.width;
    stateRef.current.paddleX = Math.max(0.08, Math.min(0.92, norm));
  };

  return (
    <div
      className="glass-panel-strong"
      style={{ maxWidth: 820, margin: '0 auto', padding: '24px 20px' }}
    >
      {/* Top Arcade Telemetry */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          marginBottom: 16
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'var(--font-tech)',
              fontWeight: 700,
              color: '#fde68a'
            }}
          >
            <Sparkles size={16} />
            Score: {score}
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'var(--font-tech)',
              fontSize: '0.88rem',
              color: '#38bdf8'
            }}
          >
            <Timer size={15} />
            {timeLeft}s
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontFamily: 'var(--font-tech)',
              fontSize: '0.82rem',
              color: '#f472b6'
            }}
          >
            <Zap size={14} />
            Wave {wave}/3 • Streak x{combo}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            <Trophy size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            Best: {highScore}
          </span>

          {gameState === 'playing' && (
            <button
              type="button"
              className="cosmic-btn-ghost"
              style={{ minHeight: 36, padding: '5px 12px' }}
              onClick={startGame}
            >
              <RotateCcw size={14} />
              <span>Restart</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Arcade Canvas Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          borderRadius: 20,
          overflow: 'hidden',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          touchAction: 'none'
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ display: 'block', width: '100%', cursor: 'ew-resize' }}
          onMouseMove={(e) => handlePointerMove(e.clientX)}
          onTouchMove={(e) => {
            if (e.touches[0]) handlePointerMove(e.touches[0].clientX);
          }}
          onTouchStart={(e) => {
            if (e.touches[0]) handlePointerMove(e.touches[0].clientX);
          }}
        />

        {gameState !== 'playing' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(5, 8, 22, 0.82)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              textAlign: 'center'
            }}
          >
            {gameState === 'idle' ? (
              <>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.6rem',
                    color: '#ffffff',
                    marginBottom: 10
                  }}
                >
                  Catch The Falling Stars
                </h3>
                <p
                  style={{
                    maxWidth: 460,
                    fontSize: '0.9rem',
                    color: '#cbd5e1',
                    lineHeight: 1.55,
                    marginBottom: 22
                  }}
                >
                  {cfg.instructions}
                </p>
                <button type="button" className="cosmic-btn-primary" onClick={startGame}>
                  <Play size={17} />
                  <span>LAUNCH STAR CATCHER</span>
                </button>
              </>
            ) : (
              <>
                <span className="cosmic-badge" style={{ marginBottom: 10 }}>
                  Time Up!
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem',
                    color: '#fde68a',
                    marginBottom: 6
                  }}
                >
                  {score} Starlight Points
                </h3>
                <p style={{ color: '#cbd5e1', marginBottom: 22, fontSize: '0.94rem' }}>
                  {score >= cfg.winThreshold
                    ? 'Phenomenal reflexes! The galaxy owes you a standing ovation! 🌟'
                    : 'Great run! Think you can beat the hyper-meteor wave next round?'}
                </p>
                <button type="button" className="cosmic-btn-primary" onClick={startGame}>
                  <RotateCcw size={17} />
                  <span>PLAY AGAIN</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
