import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  Maximize2,
  Sparkles,
  X
} from 'lucide-react';
import pagluConfig from '../../config/pagluConfig';
import soundEngine from '../../utils/soundEngine';
import CosmicBackdrop from '../../components/Navigation/CosmicBackdrop';
import './MemoryPlanet.css';

export default function MemoryPlanet() {
  const mem = pagluConfig.memoryPlanet;
  const photos = mem.photoGallery;

  const [activeWing, setActiveWing] = useState('all'); // 'all' | 'gallery' | 'timeline' | 'cards'
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [expandedTimelineId, setExpandedTimelineId] = useState(mem.timeline[0]?.id || null);

  const featuredPhoto = photos[featuredIndex] || photos[0];

  // Keyboard navigation when Lightbox is open
  useEffect(() => {
    if (lightboxIndex === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((i) => (i + 1) % photos.length);
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((i) => (i - 1 + photos.length) % photos.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, photos.length]);

  const nextFeatured = () => {
    soundEngine.playClick();
    setFeaturedIndex((i) => (i + 1) % photos.length);
  };

  const prevFeatured = () => {
    soundEngine.playClick();
    setFeaturedIndex((i) => (i - 1 + photos.length) % photos.length);
  };

  return (
    <div className="planet-page" aria-label="Memory Planet – Our Little History">
      <CosmicBackdrop accent="#38bdf8" secondary="#f472b6" density={60} />

      <div className="planet-container">
        <header className="planet-hero">
          <span className="cosmic-badge">
            <Sparkles size={13} />
            <span>Planet 01 • Our Little History</span>
          </span>
          <h1 className="planet-hero-title">{mem.heroTitle}</h1>
          <p className="planet-hero-subtitle">{mem.heroSubtitle}</p>
          <div className="editable-notice">
            <span>✨ {mem.ownerNote}</span>
          </div>
        </header>

        {/* Wing Filter Navigation */}
        <div className="memory-tabs" role="tablist" aria-label="Memory Museum Sections">
          {[
            { id: 'all', label: 'Complete Museum', icon: Sparkles },
            { id: 'gallery', label: 'Photo Gallery', icon: Camera },
            { id: 'timeline', label: '2023+ Timeline', icon: Clock },
            { id: 'cards', label: 'Memory Cards', icon: BookOpen }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeWing === tab.id}
                className={`memory-tab-btn ${activeWing === tab.id ? 'active' : ''}`}
                onClick={() => {
                  soundEngine.playClick();
                  setActiveWing(tab.id);
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ================================================================
            A. PHOTO GALLERY
            ================================================================ */}
        {(activeWing === 'all' || activeWing === 'gallery') && (
          <section className="memory-section" aria-label="Photo Gallery">
            <div style={{ marginBottom: 20 }}>
              <h2 className="section-heading">A. Celestial Photo Gallery</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
                Click any photograph to expand in full-screen starlight view, or step through the
                featured frame below.
              </p>
            </div>

            {/* Large Featured Photograph Frame */}
            <div className="memory-featured-frame">
              <div
                className="memory-featured-img-wrap"
                onClick={() => {
                  soundEngine.playClick();
                  setLightboxIndex(featuredIndex);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setLightboxIndex(featuredIndex);
                }}
                aria-label={`Expand ${featuredPhoto.title}`}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={featuredPhoto.id}
                    src={featuredPhoto.src}
                    alt={featuredPhoto.title}
                    className="memory-featured-img"
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.45 }}
                  />
                </AnimatePresence>

                <span className="memory-expand-pill">
                  <Maximize2 size={13} />
                  <span>Click to Expand</span>
                </span>
              </div>

              <div className="memory-featured-caption-bar">
                <div style={{ maxWidth: 680 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-tech)',
                        fontSize: '0.75rem',
                        color: '#38bdf8',
                        letterSpacing: '0.1em'
                      }}
                    >
                      {featuredPhoto.date} • {featuredPhoto.frameStyle}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: 4 }}>
                    {featuredPhoto.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                    {featuredPhoto.caption}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    type="button"
                    className="cosmic-btn-ghost"
                    onClick={prevFeatured}
                    aria-label="Previous featured photograph"
                  >
                    <ChevronLeft size={17} />
                    <span>Prev</span>
                  </button>
                  <span
                    style={{
                      fontFamily: 'var(--font-tech)',
                      fontSize: '0.8rem',
                      color: '#94a3b8',
                      padding: '0 6px'
                    }}
                  >
                    {featuredIndex + 1} / {photos.length}
                  </span>
                  <button
                    type="button"
                    className="cosmic-btn-ghost"
                    onClick={nextFeatured}
                    aria-label="Next featured photograph"
                  >
                    <span>Next</span>
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            </div>

            {/* Thumbnail Frames Grid */}
            <div className="memory-gallery-grid">
              {photos.map((photo, idx) => (
                <button
                  key={photo.id}
                  type="button"
                  className={`memory-frame-card ${idx === featuredIndex ? 'selected' : ''}`}
                  onClick={() => {
                    soundEngine.playClick();
                    setFeaturedIndex(idx);
                    setLightboxIndex(idx);
                  }}
                >
                  <div className="memory-thumb-wrap">
                    <img src={photo.src} alt={photo.title} loading="lazy" />
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-tech)',
                      fontSize: '0.71rem',
                      color: '#38bdf8'
                    }}
                  >
                    {photo.date}
                  </span>
                  <h4
                    style={{
                      fontSize: '0.95rem',
                      color: '#f8fafc',
                      margin: '4px 0',
                      fontWeight: 600
                    }}
                  >
                    {photo.title}
                  </h4>
                  <p
                    style={{
                      fontSize: '0.8rem',
                      color: '#94a3b8',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {photo.caption}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ================================================================
            B. FRIENDSHIP TIMELINE (Starting 2023)
            ================================================================ */}
        {(activeWing === 'all' || activeWing === 'timeline') && (
          <section className="memory-section" aria-label="Friendship Timeline">
            <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto' }}>
              <h2 className="section-heading">B. Friendship Timeline (2023 – Present)</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
                Every constellation starts with a single spark in 2023. Tap any milestone node to
                reveal its story note.
              </p>
            </div>

            <div className="timeline-track">
              {mem.timeline.map((item) => {
                const isExpanded = expandedTimelineId === item.id;
                return (
                  <div
                    key={item.id}
                    className="timeline-node"
                    style={{ '--node-color': item.accent }}
                  >
                    <span className="timeline-dot" />
                    <button
                      type="button"
                      className={`timeline-card ${isExpanded ? 'expanded' : ''}`}
                      onClick={() => {
                        soundEngine.playClick();
                        setExpandedTimelineId(isExpanded ? null : item.id);
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 8,
                          marginBottom: 8
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-tech)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            letterSpacing: '0.12em',
                            color: item.accent
                          }}
                        >
                          {item.year} • {item.category.toUpperCase()}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          {isExpanded ? 'Collapse −' : 'Expand +'}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: 6 }}>
                        {item.title}
                      </h3>
                      <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                        {item.summary}
                      </p>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{
                              marginTop: 14,
                              paddingTop: 12,
                              borderTop: '1px solid rgba(148, 163, 184, 0.16)',
                              fontSize: '0.85rem',
                              color: '#e9d5ff',
                              lineHeight: 1.55
                            }}
                          >
                            {item.detail}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ================================================================
            C. MEMORY CARDS
            ================================================================ */}
        {(activeWing === 'all' || activeWing === 'cards') && (
          <section className="memory-section" aria-label="Memory Cards">
            <div>
              <h2 className="section-heading">C. Keepsake Memory Cards</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
                Collected moments framed in cosmic glass—each ready to hold your personal snapshots
                and stories.
              </p>
            </div>

            <div className="memory-cards-grid">
              {mem.memoryCards.map((card, idx) => (
                <motion.article
                  key={card.id}
                  className="memory-scrapbook-card"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ delay: idx * 0.05, duration: 0.45 }}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="memory-scrapbook-img"
                    loading="lazy"
                    onClick={() => {
                      soundEngine.playClick();
                      setLightboxIndex(idx % photos.length);
                    }}
                  />
                  <div className="memory-scrapbook-body">
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 8
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          fontFamily: 'var(--font-tech)',
                          fontSize: '0.73rem',
                          color: '#f472b6'
                        }}
                      >
                        <Calendar size={12} />
                        {card.date}
                      </span>
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: 999,
                          fontSize: '0.68rem',
                          background: 'rgba(168, 85, 247, 0.16)',
                          color: '#d8b4fe'
                        }}
                      >
                        {card.tag}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.08rem', color: '#ffffff' }}>{card.title}</h3>
                    <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.58 }}>
                      {card.description}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ================================================================
          FULL-SCREEN PHOTOGRAPH LIGHTBOX
          ================================================================ */}
      <AnimatePresence>
        {lightboxIndex !== null && photos[lightboxIndex] && (
          <motion.div
            className="memory-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
          >
            <motion.div
              className="memory-lightbox-content"
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-tech)',
                    fontSize: '0.78rem',
                    color: '#38bdf8'
                  }}
                >
                  {photos[lightboxIndex].date} • Frame {lightboxIndex + 1} of {photos.length}
                </span>

                <button
                  type="button"
                  className="cosmic-btn-ghost"
                  style={{ minHeight: 36, padding: '6px 12px' }}
                  onClick={() => setLightboxIndex(null)}
                  aria-label="Close photograph lightbox"
                >
                  <X size={16} />
                  <span>Close</span>
                </button>
              </div>

              <img
                src={photos[lightboxIndex].src}
                alt={photos[lightboxIndex].title}
                className="memory-lightbox-img"
              />

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 14,
                  marginTop: 14
                }}
              >
                <div style={{ maxWidth: 650 }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: 4 }}>
                    {photos[lightboxIndex].title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                    {photos[lightboxIndex].caption}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    className="cosmic-btn-ghost"
                    onClick={() =>
                      setLightboxIndex((i) => (i - 1 + photos.length) % photos.length)
                    }
                  >
                    <ChevronLeft size={16} />
                    <span>Prev</span>
                  </button>
                  <button
                    type="button"
                    className="cosmic-btn-ghost"
                    onClick={() => setLightboxIndex((i) => (i + 1) % photos.length)}
                  >
                    <span>Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
