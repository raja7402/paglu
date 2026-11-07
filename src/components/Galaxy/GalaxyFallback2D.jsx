import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles, Unlock } from 'lucide-react';
import pagluConfig from '../../config/pagluConfig';
import soundEngine from '../../utils/soundEngine';
import CosmicBackdrop from '../Navigation/CosmicBackdrop';

export default function GalaxyFallback2D({
  visitedPlanets = [],
  isFinalUnlocked = false,
  onSelectPlanet,
  canSwitchTo3D = false,
  onEnable3D
}) {
  return (
    <section className="galaxy-fallback-root" aria-label="Interactive Star Map">
      <CosmicBackdrop accent="#38bdf8" secondary="#a855f7" density={70} />

      <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', maxWidth: 680 }}>
        <span className="cosmic-badge">
          <Sparkles size={13} />
          <span>Interactive Celestial Atlas</span>
        </span>
        <h1 className="planet-hero-title" style={{ marginBottom: 8 }}>
          {pagluConfig.universeTitle} – {pagluConfig.universeSubtitle}
        </h1>
        <p className="planet-hero-subtitle">
          Six worlds orbiting in dark cosmic space, created for {pagluConfig.recipientName}. Tap any
          planet below to begin your exploration.
        </p>

        {canSwitchTo3D && onEnable3D && (
          <button
            type="button"
            className="cosmic-btn-ghost"
            style={{ marginTop: 14 }}
            onClick={onEnable3D}
          >
            Switch to Full 3D WebGL Galaxy
          </button>
        )}
      </div>

      <div className="galaxy-fallback-grid">
        {pagluConfig.planets.map((planet, index) => {
          const isVisited = visitedPlanets.includes(planet.id);
          const isLockedFinal = planet.id === 'final' && !isFinalUnlocked;

          return (
            <motion.button
              key={planet.id}
              type="button"
              className="galaxy-fallback-card"
              style={{ '--p-color': planet.palette.primary }}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07, duration: 0.45 }}
              onClick={() => {
                soundEngine.playUnlock();
                onSelectPlanet(planet.id);
              }}
            >
              <div
                className="galaxy-fallback-orb animate-float"
                style={{
                  animationDelay: `${index * 0.4}s`,
                  background: `radial-gradient(circle at 32% 30%, #ffffff 0%, ${planet.palette.primary} 38%, ${planet.palette.secondary} 75%, ${planet.palette.deep} 100%)`,
                  boxShadow: `0 0 26px ${planet.palette.glow}88`
                }}
              />

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 4
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-tech)',
                      fontSize: '0.72rem',
                      color: planet.palette.primary,
                      letterSpacing: '0.12em'
                    }}
                  >
                    PLANET 0{planet.order}
                  </span>
                  {planet.id === 'final' ? (
                    isLockedFinal ? (
                      <Lock size={14} color="#fbbf24" />
                    ) : (
                      <Unlock size={14} color="#34d399" />
                    )
                  ) : (
                    isVisited && (
                      <span style={{ fontSize: '0.72rem', color: '#34d399' }}>Visited ✓</span>
                    )
                  )}
                </div>

                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.08rem',
                    color: '#ffffff',
                    marginBottom: 4
                  }}
                >
                  {planet.name}
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                  {planet.shortDescription}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
