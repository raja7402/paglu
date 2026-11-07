import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import IntroSequence from './components/Intro/IntroSequence';
import PasswordGate from './components/PasswordGate/PasswordGate';
import UniverseHUD from './components/Navigation/UniverseHUD';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import soundEngine from './utils/soundEngine';
import {
  loadSessionState,
  persistCustomWishes,
  persistMysteryProgress,
  persistOpenedLetters,
  persistUnlocked,
  persistVisitedPlanets
} from './utils/universeStore';

// Lazy-loaded 3D Galaxy & Planet Destinations for fast mobile boot performance
const GalaxyScene = lazy(() => import('./components/Galaxy/GalaxyScene'));
const MemoryPlanet = lazy(() => import('./planets/MemoryPlanet/MemoryPlanet'));
const MysteryPlanet = lazy(() => import('./planets/MysteryPlanet/MysteryPlanet'));
const FunPlanet = lazy(() => import('./planets/FunPlanet/FunPlanet'));
const LettersPlanet = lazy(() => import('./planets/LettersPlanet/LettersPlanet'));
const DreamPlanet = lazy(() => import('./planets/DreamPlanet/DreamPlanet'));
const FinalDestination = lazy(() => import('./planets/FinalDestination/FinalDestination'));

const VALID_PLANETS = ['memory', 'mystery', 'fun', 'letters', 'dream', 'final'];

function parseHashRoute() {
  if (typeof window === 'undefined') return 'galaxy';
  const hash = window.location.hash.replace(/^#\/?/, '').trim();
  if (hash.startsWith('planet/')) {
    const id = hash.split('/')[1];
    if (VALID_PLANETS.includes(id)) return id;
  }
  if (VALID_PLANETS.includes(hash)) return hash;
  return 'galaxy';
}

export default function App() {
  const initialSession = loadSessionState();

  // Stage when locked: 'intro' -> 'gate'
  const [gateStage, setGateStage] = useState('intro');
  const [isUnlocked, setIsUnlocked] = useState(initialSession.isUnlocked);

  // Active unlocked view: 'galaxy' | 'memory' | 'mystery' | 'fun' | 'letters' | 'dream' | 'final'
  const [currentView, setCurrentView] = useState(() =>
    initialSession.isUnlocked ? parseHashRoute() : 'galaxy'
  );

  const [visitedPlanets, setVisitedPlanets] = useState(initialSession.visitedPlanets);
  const [mysteryLevels, setMysteryLevels] = useState(initialSession.mysteryCompletedLevels);
  const [isFinalUnlocked, setIsFinalUnlocked] = useState(initialSession.isFinalUnlocked);
  const [openedLetters, setOpenedLetters] = useState(initialSession.openedLetters);
  const [customWishes, setCustomWishes] = useState(initialSession.customWishes);
  const [unlockToast, setUnlockToast] = useState(false);

  // Sync browser Back/Forward hash navigation once unlocked
  useEffect(() => {
    if (!isUnlocked) return undefined;
    const onHashChange = () => {
      const target = parseHashRoute();
      setCurrentView(target);
      if (VALID_PLANETS.includes(target)) {
        setVisitedPlanets((prev) => {
          if (prev.includes(target)) return prev;
          const updated = [...prev, target];
          persistVisitedPlanets(updated);
          return updated;
        });
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [isUnlocked]);

  const navigateToGalaxy = useCallback(() => {
    setCurrentView('galaxy');
    window.location.hash = 'galaxy';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (soundEngine.getState().currentTrackKey === 'final') {
      soundEngine.switchTrack('galaxy');
    }
  }, []);

  const navigateToPlanet = useCallback((planetId) => {
    if (!VALID_PLANETS.includes(planetId)) return;
    setCurrentView(planetId);
    window.location.hash = `planet/${planetId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (planetId !== 'final' && soundEngine.getState().currentTrackKey === 'final') {
      soundEngine.switchTrack('galaxy');
    }

    setVisitedPlanets((prev) => {
      if (prev.includes(planetId)) return prev;
      const updated = [...prev, planetId];
      persistVisitedPlanets(updated);
      return updated;
    });
  }, []);

  const handleGateUnlocked = () => {
    setIsUnlocked(true);
    persistUnlocked(true);
    setCurrentView('galaxy');
    window.location.hash = 'galaxy';
  };

  const handleReplayIntro = () => {
    setIsUnlocked(false);
    persistUnlocked(false);
    setGateStage('intro');
    window.location.hash = '';
  };

  const handleCompleteMysteryLevel = (levelNum) => {
    setMysteryLevels((prev) => {
      const next = prev.includes(levelNum) ? prev : [...prev, levelNum];
      const allThreeDone = [1, 2, 3].every((n) => next.includes(n));
      if (allThreeDone && !isFinalUnlocked) {
        setIsFinalUnlocked(true);
        setUnlockToast(true);
        setTimeout(() => setUnlockToast(false), 5000);
      }
      persistMysteryProgress(next, allThreeDone || isFinalUnlocked);
      return next;
    });
  };

  const handleMarkLetterOpened = (letterId) => {
    setOpenedLetters((prev) => {
      if (prev.includes(letterId)) return prev;
      const next = [...prev, letterId];
      persistOpenedLetters(next);
      return next;
    });
  };

  const handleAddCustomWish = (wishObj) => {
    setCustomWishes((prev) => {
      const next = [wishObj, ...prev];
      persistCustomWishes(next);
      return next;
    });
  };

  // ==========================================================================
  // PRE-UNLOCK FLOW: INTRO SEQUENCE -> PASSWORD SECRET GATE
  // ==========================================================================
  if (!isUnlocked) {
    return gateStage === 'intro' ? (
      <IntroSequence onEnterUnknown={() => setGateStage('gate')} />
    ) : (
      <PasswordGate onUnlocked={handleGateUnlocked} />
    );
  }

  // ==========================================================================
  // UNLOCKED UNIVERSE: HUD + 3D GALAXY + 6 INTERACTIVE PLANETS
  // ==========================================================================
  const sessionScores = loadSessionState();

  return (
    <div style={{ position: 'relative', minHeight: '100dvh', width: '100%' }}>
      <UniverseHUD
        currentView={currentView}
        visitedPlanets={visitedPlanets}
        isFinalUnlocked={isFinalUnlocked}
        onNavigateGalaxy={navigateToGalaxy}
        onSelectPlanet={navigateToPlanet}
        onReplayIntro={handleReplayIntro}
      />

      {/* Celebratory Notification Toast when Final Destination Awakens */}
      <AnimatePresence>
        {unlockToast && (
          <motion.div
            initial={{ opacity: 0, y: -24, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            style={{
              position: 'fixed',
              top: 72,
              left: '50%',
              zIndex: 110,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 22px',
              borderRadius: 999,
              background: 'rgba(16, 185, 129, 0.22)',
              backdropFilter: 'blur(16px)',
              border: '1px solid #34d399',
              color: '#ecfdf5',
              fontFamily: 'var(--font-tech)',
              fontSize: '0.82rem',
              fontWeight: 600,
              boxShadow: '0 14px 40px rgba(0,0,0,0.65)'
            }}
          >
            <Sparkles size={16} color="#fde68a" />
            <span>Final Destination Portal Awakened!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Suspense fallback={<LoadingScreen message="Opening Celestial Sector..." />}>
        <motion.main
          key={currentView}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {currentView === 'galaxy' && (
            <GalaxyScene
              visitedPlanets={visitedPlanets}
              isFinalUnlocked={isFinalUnlocked}
              onSelectPlanet={navigateToPlanet}
            />
          )}

          {currentView === 'memory' && <MemoryPlanet />}

          {currentView === 'mystery' && (
            <MysteryPlanet
              completedLevels={mysteryLevels}
              onCompleteLevel={handleCompleteMysteryLevel}
              onNavigateFinalDestination={() => navigateToPlanet('final')}
            />
          )}

          {currentView === 'fun' && (
            <FunPlanet
              quizBestScore={sessionScores.quizBestScore}
              starsHighScore={sessionScores.starsHighScore}
            />
          )}

          {currentView === 'letters' && (
            <LettersPlanet
              openedLetters={openedLetters}
              onMarkLetterOpened={handleMarkLetterOpened}
            />
          )}

          {currentView === 'dream' && (
            <DreamPlanet
              customWishes={customWishes}
              onAddCustomWish={handleAddCustomWish}
            />
          )}

          {currentView === 'final' && (
            <FinalDestination
              isUnlocked={isFinalUnlocked}
              completedMysteryLevels={mysteryLevels}
              onNavigateMystery={() => navigateToPlanet('mystery')}
            />
          )}
        </motion.main>
      </Suspense>
    </div>
  );
}
