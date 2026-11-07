import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Send, Sparkles, Star } from 'lucide-react';
import pagluConfig from '../../config/pagluConfig';
import soundEngine from '../../utils/soundEngine';
import CosmicBackdrop from '../../components/Navigation/CosmicBackdrop';
import './DreamPlanet.css';

export default function DreamPlanet({ customWishes = [], onAddCustomWish }) {
  const dp = pagluConfig.dreamPlanet;
  const [wishInput, setWishInput] = useState('');
  const [burstKey, setBurstKey] = useState(0);

  const allWishes = [...dp.wishes, ...customWishes];

  const handleLaunchWish = (e) => {
    e.preventDefault();
    const trimmed = wishInput.trim();
    if (!trimmed) return;

    soundEngine.playSuccess();
    setBurstKey((k) => k + 1);
    if (onAddCustomWish) {
      onAddCustomWish({
        id: `custom-wish-${Date.now()}`,
        title: `Paglu’s Shooting Star Wish`,
        tag: 'Launched to the Stars',
        accent: '#fbbf24',
        text: trimmed
      });
    }
    setWishInput('');
  };

  return (
    <div className="planet-page" aria-label="Dream Planet – A World of Wishes">
      <CosmicBackdrop accent="#818cf8" secondary="#38bdf8" density={70} />

      <div className="planet-container">
        <header className="planet-hero">
          <span className="cosmic-badge" style={{ borderColor: 'rgba(165,180,252,0.45)', color: '#c7d2fe' }}>
            <Moon size={13} />
            <span>Planet 05 • A World of Wishes</span>
          </span>
          <h1 className="planet-hero-title">{dp.heroTitle}</h1>
          <p className="planet-hero-subtitle">{dp.heroSubtitle}</p>
        </header>

        {/* Dreamy Moonlit Sanctuary Banner with Animated Moon, Glowing Clouds & Shooting Stars */}
        <section className="dream-sky-stage" aria-label="Moonlit Sky Sanctuary">
          {/* Ambient & Triggered Shooting Stars */}
          <span
            key={`s1-${burstKey}`}
            className="shooting-star-line"
            style={{ top: '18%', right: '8%', animationDelay: '0.3s' }}
          />
          <span
            key={`s2-${burstKey}`}
            className="shooting-star-line"
            style={{ top: '32%', right: '26%', animationDelay: '2.1s' }}
          />

          <div className="dream-cloud dream-cloud-left" />
          <div className="dream-cloud dream-cloud-right" />

          <div className="dream-moon-wrap" aria-hidden="true">
            <div className="dream-moon-halo" />
            <div className="dream-moon-sphere" />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            style={{
              position: 'relative',
              zIndex: 3,
              maxWidth: 640,
              fontFamily: 'var(--font-editorial)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.28rem, 2.8vw, 1.78rem)',
              lineHeight: 1.5,
              color: '#eef2ff',
              textShadow: '0 0 24px rgba(129, 140, 248, 0.5)'
            }}
          >
            “{dp.inspirationalBanner}”
          </motion.p>
        </section>

        {/* Required Section: "Things I Hope Life Gives You." */}
        <section aria-label={dp.wishesSectionTitle}>
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto' }}>
            <span className="cosmic-badge" style={{ marginBottom: 10 }}>
              <Sparkles size={13} />
              <span>Written in Starlight</span>
            </span>
            <h2
              className="section-heading"
              style={{ fontSize: 'clamp(1.6rem, 3.6vw, 2.45rem)' }}
            >
              {dp.wishesSectionTitle}
            </h2>
          </div>

          <div className="wishes-grid">
            {allWishes.map((wish, idx) => (
              <motion.article
                key={wish.id}
                className="wish-card"
                style={{ '--wish-accent': wish.accent }}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: (idx % 6) * 0.06, duration: 0.45 }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 12
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontFamily: 'var(--font-tech)',
                      fontSize: '0.73rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: wish.accent
                    }}
                  >
                    <Star size={13} />
                    <span>{wish.tag}</span>
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.16rem',
                    color: '#ffffff',
                    marginBottom: 10
                  }}
                >
                  {wish.title}
                </h3>

                <p style={{ fontSize: '0.93rem', color: '#cbd5e1', lineHeight: 1.65 }}>
                  {wish.text}
                </p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Interactive Shooting Star Wish Launcher */}
        <section className="wish-maker-box" aria-label="Launch Your Own Wish">
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              color: '#ffffff',
              marginBottom: 6
            }}
          >
            Send a Wish Across Dream Planet
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: 16 }}>
            Type any wish or dream of your own and launch a shooting star across the sky.
          </p>

          <form
            onSubmit={handleLaunchWish}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}
          >
            <input
              type="text"
              value={wishInput}
              onChange={(e) => setWishInput(e.target.value)}
              placeholder="Write a wish under the moon..."
              aria-label="Write a wish"
              style={{
                flex: '1 1 240px',
                minHeight: 46,
                padding: '0 16px',
                borderRadius: 999,
                background: 'rgba(6, 9, 24, 0.85)',
                border: '1px solid rgba(165, 180, 252, 0.34)',
                color: '#f8fafc',
                fontSize: '0.92rem'
              }}
            />
            <button
              type="submit"
              className="cosmic-btn-primary"
              disabled={!wishInput.trim()}
            >
              <Send size={15} />
              <span>Launch Shooting Star</span>
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
