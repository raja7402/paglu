import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Disc3, Gamepad2, HelpCircle, Sparkles } from 'lucide-react';
import pagluConfig from '../../config/pagluConfig';
import soundEngine from '../../utils/soundEngine';
import CosmicBackdrop from '../../components/Navigation/CosmicBackdrop';
import FriendshipQuiz from '../../games/FriendshipQuiz/FriendshipQuiz';
import CatchTheStars from '../../games/CatchTheStars/CatchTheStars';
import LuckyWheel from '../../games/LuckyWheel/LuckyWheel';

export default function FunPlanet({ quizBestScore = 0, starsHighScore = 0 }) {
  const [activeGame, setActiveGame] = useState('quiz'); // 'quiz' | 'stars' | 'wheel'

  const games = [
    {
      id: 'quiz',
      title: '1. How Well Do You Know Me?',
      subtitle: '15 Personalised Questions',
      icon: HelpCircle,
      accent: '#38bdf8'
    },
    {
      id: 'stars',
      title: '2. Catch The Stars',
      subtitle: 'Arcade Reflex Challenge',
      icon: Sparkles,
      accent: '#fbbf24'
    },
    {
      id: 'wheel',
      title: '3. The Lucky Wheel',
      subtitle: 'Spin for Surprises & Dares',
      icon: Disc3,
      accent: '#f472b6'
    }
  ];

  return (
    <div className="planet-page" aria-label="Fun Planet – The Playground">
      <CosmicBackdrop accent="#22d3ee" secondary="#ec4899" density={65} />

      <div className="planet-container">
        <header className="planet-hero">
          <span className="cosmic-badge">
            <Gamepad2 size={14} />
            <span>Planet 03 • The Playground</span>
          </span>
          <h1 className="planet-hero-title">{pagluConfig.funPlanet.heroTitle}</h1>
          <p className="planet-hero-subtitle">{pagluConfig.funPlanet.heroSubtitle}</p>
        </header>

        {/* 3 Mini-Game Selector Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: 14,
            maxWidth: 880,
            margin: '0 auto 34px'
          }}
          role="tablist"
          aria-label="Fun Planet Mini Games"
        >
          {games.map((g) => {
            const Icon = g.icon;
            const isActive = activeGame === g.id;
            return (
              <button
                key={g.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  soundEngine.playClick();
                  setActiveGame(g.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '16px 18px',
                  borderRadius: 20,
                  textAlign: 'left',
                  background: isActive ? 'rgba(22, 28, 68, 0.88)' : 'rgba(12, 16, 40, 0.65)',
                  border: `1.5px solid ${isActive ? g.accent : 'rgba(148, 163, 184, 0.2)'}`,
                  boxShadow: isActive ? `0 0 26px ${g.accent}33` : 'none',
                  transition: 'all 0.22s ease'
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `${g.accent}22`,
                    color: g.accent,
                    flexShrink: 0
                  }}
                >
                  <Icon size={22} />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.94rem', color: '#ffffff' }}>
                    {g.title}
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{g.subtitle}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Game Stage */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeGame}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {activeGame === 'quiz' && <FriendshipQuiz initialBestScore={quizBestScore} />}
            {activeGame === 'stars' && <CatchTheStars initialHighScore={starsHighScore} />}
            {activeGame === 'wheel' && <LuckyWheel />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
