import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Compass,
  Lock,
  Music,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Unlock,
  Volume2,
  VolumeX,
  X
} from 'lucide-react';
import pagluConfig from '../../config/pagluConfig';
import soundEngine from '../../utils/soundEngine';
import './UniverseHUD.css';

export default function UniverseHUD({
  currentView, // 'galaxy' | 'memory' | 'mystery' | 'fun' | 'letters' | 'dream' | 'final'
  visitedPlanets = [],
  isFinalUnlocked = false,
  onNavigateGalaxy,
  onSelectPlanet,
  onReplayIntro
}) {
  const [audioState, setAudioState] = useState(soundEngine.getState());
  const [showAudioPopover, setShowAudioPopover] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);

  useEffect(() => {
    const unsub = soundEngine.subscribe(setAudioState);
    return unsub;
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setShowAudioPopover(false);
        setShowMenuModal(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const shortLabels = {
    memory: 'Memory',
    mystery: 'Mystery',
    fun: 'Fun',
    letters: 'Letters',
    dream: 'Dream',
    final: 'Final'
  };

  return (
    <>
      {/* TOP NAVIGATION BAR */}
      <header className="hud-top-bar" aria-label="Universe Navigation Bar">
        <div className="hud-left-group">
          {currentView !== 'galaxy' ? (
            <button
              type="button"
              className="hud-brand-pill"
              onClick={() => {
                soundEngine.playClick();
                onNavigateGalaxy();
              }}
              aria-label="Back to 3D Galaxy"
            >
              <ArrowLeft size={17} color="#38bdf8" />
              <span className="hud-brand-text">BACK TO GALAXY</span>
            </button>
          ) : (
            <button
              type="button"
              className="hud-brand-pill"
              onClick={() => {
                soundEngine.playClick();
                setShowMenuModal(true);
              }}
              aria-label="Open Universe Overview Menu"
            >
              <span className="hud-brand-orb" />
              <span className="hud-brand-text">{pagluConfig.universeTitle}</span>
            </button>
          )}

          <div
            className="hud-icon-btn hud-hide-mobile"
            style={{ pointerEvents: 'none', opacity: 0.9 }}
            title="Worlds Explored"
          >
            <Sparkles size={14} color="#a855f7" />
            <span>{visitedPlanets.length}/6 Worlds</span>
          </div>
        </div>

        <div className="hud-right-group">
          {/* Quick Music Play/Pause */}
          <button
            type="button"
            className={`hud-icon-btn ${audioState.isPlaying && !audioState.isMuted ? 'active' : ''}`}
            onClick={() => {
              soundEngine.togglePlay();
              soundEngine.playClick();
            }}
            aria-label={audioState.isPlaying ? 'Pause background music' : 'Play background music'}
            title={audioState.isPlaying ? 'Pause Music' : 'Play Music'}
          >
            {audioState.isPlaying && !audioState.isMuted ? (
              <Pause size={15} color="#38bdf8" />
            ) : (
              <Play size={15} />
            )}
            <span className="hud-hide-mobile">
              {audioState.isPlaying && !audioState.isMuted ? 'Music ON' : 'Music OFF'}
            </span>
          </button>

          {/* Detailed Sound & Volume Popover Trigger */}
          <button
            type="button"
            className={`hud-icon-btn ${showAudioPopover ? 'active' : ''}`}
            onClick={() => {
              soundEngine.playClick();
              setShowAudioPopover((v) => !v);
              setShowMenuModal(false);
            }}
            aria-label="Audio mixer and volume controls"
            title="Sound Settings"
          >
            {audioState.isMuted ? <VolumeX size={16} color="#fb7185" /> : <Music size={16} />}
          </button>

          {/* All Destinations / Home Menu */}
          <button
            type="button"
            className={`hud-icon-btn ${showMenuModal ? 'active' : ''}`}
            onClick={() => {
              soundEngine.playClick();
              setShowMenuModal((v) => !v);
              setShowAudioPopover(false);
            }}
            aria-label="Open Cosmic Atlas Navigation Menu"
          >
            <Compass size={16} color="#c084fc" />
            <span className="hud-hide-mobile">Atlas</span>
          </button>
        </div>
      </header>

      {/* AUDIO MIXER POPOVER */}
      <AnimatePresence>
        {showAudioPopover && (
          <motion.div
            className="hud-popover"
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p className="hud-popover-title" style={{ marginBottom: 0 }}>
                Cosmic Sound System
              </p>
              <button
                type="button"
                onClick={() => setShowAudioPopover(false)}
                aria-label="Close audio settings"
                style={{ color: '#94a3b8', padding: 4 }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="hud-audio-row" style={{ marginTop: 14 }}>
              <button
                type="button"
                className="cosmic-btn-ghost"
                style={{ flex: 1 }}
                onClick={() => soundEngine.togglePlay()}
              >
                {audioState.isPlaying ? <Pause size={15} /> : <Play size={15} />}
                <span>{audioState.isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                type="button"
                className="cosmic-btn-ghost"
                style={{ flex: 1 }}
                onClick={() => soundEngine.toggleMute()}
              >
                {audioState.isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                <span>{audioState.isMuted ? 'Unmute' : 'Mute'}</span>
              </button>
            </div>

            <div className="hud-audio-row">
              <span style={{ fontSize: '0.8rem', color: '#cbd5e1', minWidth: 58 }}>
                Vol {Math.round(audioState.volume * 100)}%
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={audioState.volume}
                onChange={(e) => soundEngine.setVolume(e.target.value)}
                className="hud-volume-slider"
                aria-label="Music volume"
              />
            </div>

            <div className="hud-audio-row" style={{ marginBottom: 4 }}>
              <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Interactive Sound FX</span>
              <button
                type="button"
                className="cosmic-btn-ghost"
                style={{ minHeight: 34, padding: '5px 12px', fontSize: '0.74rem' }}
                onClick={() => {
                  soundEngine.toggleSfx();
                }}
              >
                {audioState.sfxEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(148,163,184,0.16)' }}>
              <p style={{ fontSize: '0.73rem', color: '#94a3b8', marginBottom: 7 }}>
                Soundtrack Channel:
              </p>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  className="cosmic-btn-ghost"
                  style={{
                    flex: 1,
                    minHeight: 34,
                    padding: '4px 8px',
                    fontSize: '0.72rem',
                    borderColor:
                      audioState.currentTrackKey === 'galaxy'
                        ? '#38bdf8'
                        : 'rgba(148,163,184,0.2)'
                  }}
                  onClick={() => soundEngine.switchTrack('galaxy')}
                >
                  Nebula Drift
                </button>
                <button
                  type="button"
                  className="cosmic-btn-ghost"
                  style={{
                    flex: 1,
                    minHeight: 34,
                    padding: '4px 8px',
                    fontSize: '0.72rem',
                    borderColor:
                      audioState.currentTrackKey === 'final'
                        ? '#f472b6'
                        : 'rgba(148,163,184,0.2)'
                  }}
                  onClick={() => soundEngine.switchTrack('final')}
                >
                  Final Horizon
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM 6-PLANET NAVIGATION PANEL */}
      <nav className="hud-planet-dock-wrap" aria-label="Six Planets Quick Navigation">
        <div className="hud-planet-dock">
          <button
            type="button"
            className={`hud-dock-item ${currentView === 'galaxy' ? 'active' : ''}`}
            onClick={() => {
              soundEngine.playClick();
              onNavigateGalaxy();
            }}
          >
            <Compass size={14} color="#38bdf8" />
            <span>Galaxy</span>
          </button>

          {pagluConfig.planets.map((planet) => {
            const isActive = currentView === planet.id;
            const isVisited = visitedPlanets.includes(planet.id);
            const isLockedFinal = planet.id === 'final' && !isFinalUnlocked;

            return (
              <button
                key={planet.id}
                type="button"
                className={`hud-dock-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  soundEngine.playClick();
                  onSelectPlanet(planet.id);
                }}
                title={`${planet.name} — ${planet.subtitle}`}
              >
                <span
                  className="hud-dock-dot"
                  style={{
                    background: planet.palette.primary,
                    boxShadow: `0 0 8px ${planet.palette.primary}`
                  }}
                />
                <span>{shortLabels[planet.id] || planet.name}</span>
                {planet.id === 'final' ? (
                  isLockedFinal ? (
                    <Lock size={12} color="#fbbf24" />
                  ) : (
                    <Unlock size={12} color="#34d399" />
                  )
                ) : (
                  isVisited && <span className="hud-visited-check" title="Visited" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* FULL COSMIC ATLAS MODAL */}
      <AnimatePresence>
        {showMenuModal && (
          <motion.div
            className="hud-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMenuModal(false)}
          >
            <motion.div
              className="hud-menu-modal"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div>
                  <span className="cosmic-badge">Cosmic Atlas • {visitedPlanets.length}/6 Explored</span>
                  <h2
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.5rem',
                      marginTop: 10,
                      color: '#ffffff'
                    }}
                  >
                    {pagluConfig.universeTitle} – {pagluConfig.universeSubtitle}
                  </h2>
                  <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: 4 }}>
                    Created exclusively for {pagluConfig.recipientName}. Select any world to warp directly.
                  </p>
                </div>

                <button
                  type="button"
                  className="hud-icon-btn"
                  style={{ minWidth: 38, height: 38, padding: 0 }}
                  onClick={() => setShowMenuModal(false)}
                  aria-label="Close Atlas Menu"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="hud-menu-grid">
                {pagluConfig.planets.map((planet) => {
                  const isVisited = visitedPlanets.includes(planet.id);
                  const isLockedFinal = planet.id === 'final' && !isFinalUnlocked;
                  return (
                    <button
                      key={planet.id}
                      type="button"
                      className="hud-menu-planet-card"
                      onClick={() => {
                        soundEngine.playClick();
                        setShowMenuModal(false);
                        onSelectPlanet(planet.id);
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-tech)',
                            fontSize: '0.72rem',
                            color: planet.palette.primary,
                            letterSpacing: '0.12em'
                          }}
                        >
                          0{planet.order} • {isVisited ? 'VISITED' : 'UNEXPLORED'}
                        </span>
                        {planet.id === 'final' && (
                          <span style={{ fontSize: '0.72rem', color: isLockedFinal ? '#fbbf24' : '#34d399' }}>
                            {isLockedFinal ? '🔒 Sealed' : '✨ Awakened'}
                          </span>
                        )}
                      </div>
                      <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.02rem', color: '#f8fafc' }}>
                        {planet.name}
                      </strong>
                      <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{planet.subtitle}</span>
                    </button>
                  );
                })}
              </div>

              <div
                style={{
                  marginTop: 22,
                  paddingTop: 16,
                  borderTop: '1px solid rgba(148, 163, 184, 0.16)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 10,
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <button
                  type="button"
                  className="cosmic-btn-ghost"
                  onClick={() => {
                    soundEngine.playClick();
                    setShowMenuModal(false);
                    onNavigateGalaxy();
                  }}
                >
                  <Compass size={15} />
                  <span>Return to 3D Galaxy Hub</span>
                </button>

                <button
                  type="button"
                  className="cosmic-btn-ghost"
                  onClick={() => {
                    soundEngine.playClick();
                    setShowMenuModal(false);
                    onReplayIntro();
                  }}
                >
                  <RotateCcw size={15} />
                  <span>Replay Intro & Secret Gate</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
