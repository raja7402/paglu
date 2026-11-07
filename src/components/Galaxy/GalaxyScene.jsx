import React, { Component, Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { Move, Sparkles } from 'lucide-react';
import pagluConfig from '../../config/pagluConfig';
import soundEngine from '../../utils/soundEngine';
import { detectWebGLSupport, isMobileViewport } from '../../utils/universeStore';
import CosmicCoreAndNebula from './CosmicCoreAndNebula';
import Planet3D from './Planet3D';
import GalaxyFallback2D from './GalaxyFallback2D';
import './GalaxyScene.css';

class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function GalaxyCameraController({ warpTarget, controlsRef }) {
  const { camera } = useThree();
  const introDoneRef = useRef(false);

  // Smooth cinematic camera sweep upon entering the galaxy
  useEffect(() => {
    if (introDoneRef.current) return;
    introDoneRef.current = true;

    const mobile = isMobileViewport();
    camera.position.set(0, 26, mobile ? 44 : 38);
    gsap.to(camera.position, {
      x: 0,
      y: mobile ? 14.5 : 12.5,
      z: mobile ? 31 : 26.5,
      duration: 2.2,
      ease: 'power3.out'
    });
  }, [camera]);

  // Smooth GSAP camera zoom toward selected planet
  useEffect(() => {
    if (!warpTarget) return undefined;
    const { position } = warpTarget;

    if (controlsRef.current) {
      controlsRef.current.enabled = false;
      gsap.to(controlsRef.current.target, {
        x: position.x,
        y: position.y,
        z: position.z,
        duration: 0.82,
        ease: 'power2.inOut'
      });
    }

    const tween = gsap.to(camera.position, {
      x: position.x * 0.72,
      y: position.y + 2.4,
      z: position.z * 0.72 + 4.2,
      duration: 0.85,
      ease: 'power2.inOut'
    });

    return () => {
      tween.kill();
    };
  }, [warpTarget, camera, controlsRef]);

  return null;
}

export default function GalaxyScene({
  visitedPlanets = [],
  isFinalUnlocked = false,
  onSelectPlanet
}) {
  const [webglAvailable] = useState(() => detectWebGLSupport());
  const [useFallback2D, setUseFallback2D] = useState(!webglAvailable);
  const [hoveredPlanet, setHoveredPlanet] = useState(null);
  const [warpingPlanet, setWarpingPlanet] = useState(null);
  const [warpTarget, setWarpTarget] = useState(null);
  const [isMobile, setIsMobile] = useState(() => isMobileViewport());

  const controlsRef = useRef();
  const warpTimerRef = useRef(null);

  useEffect(() => {
    const onResize = () => setIsMobile(isMobileViewport());
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      document.body.style.cursor = 'auto';
      if (warpTimerRef.current) clearTimeout(warpTimerRef.current);
    };
  }, []);

  const handlePlanetClick = (planet, worldPos) => {
    if (warpingPlanet) return;
    soundEngine.unlockAudioFromGesture(false);
    soundEngine.playUnlock();
    setWarpingPlanet(planet);
    setWarpTarget({ planet, position: worldPos });

    warpTimerRef.current = setTimeout(() => {
      onSelectPlanet(planet.id);
    }, 850);
  };

  const fallbackNode = (
    <GalaxyFallback2D
      visitedPlanets={visitedPlanets}
      isFinalUnlocked={isFinalUnlocked}
      onSelectPlanet={onSelectPlanet}
      canSwitchTo3D={webglAvailable}
      onEnable3D={() => setUseFallback2D(false)}
    />
  );

  if (useFallback2D) {
    return fallbackNode;
  }

  return (
    <WebGLErrorBoundary fallback={fallbackNode}>
      <section className="galaxy-root" aria-label="3D Interactive Galaxy">
        <div className="galaxy-gesture-hint">
          <Move size={13} color="#38bdf8" />
          <span>
            {isMobile
              ? 'Drag to orbit • Pinch to zoom • Tap any planet'
              : 'Drag to orbit • Scroll to zoom • Click any planet to warp'}
          </span>
        </div>

        <div className="galaxy-canvas-wrap">
          <Canvas
            dpr={isMobile ? [1, 1.5] : [1, 2]}
            camera={{ position: [0, 14, 28], fov: isMobile ? 56 : 48, near: 0.1, far: 240 }}
            gl={{ antialias: !isMobile, powerPreference: 'high-performance' }}
          >
            <color attach="background" args={['#04040c']} />
            <fog attach="fog" args={['#04040c', 36, 95]} />

            {/* Multi-source Cinematic Cosmic Lighting */}
            <ambientLight intensity={0.48} color="#c7d2fe" />
            <pointLight position={[0, 0, 0]} intensity={3.8} distance={65} decay={1.4} color="#38bdf8" />
            <directionalLight position={[18, 24, 14]} intensity={1.35} color="#e9d5ff" />
            <directionalLight position={[-20, -12, -16]} intensity={0.65} color="#f472b6" />

            <Suspense fallback={null}>
              <CosmicCoreAndNebula isMobile={isMobile} />

              {pagluConfig.planets.map((planet) => (
                <Planet3D
                  key={planet.id}
                  planet={planet}
                  isVisited={visitedPlanets.includes(planet.id)}
                  isFinalUnlocked={isFinalUnlocked}
                  isWarping={Boolean(warpingPlanet)}
                  onPlanetHover={setHoveredPlanet}
                  onPlanetClick={handlePlanetClick}
                />
              ))}
            </Suspense>

            <OrbitControls
              ref={controlsRef}
              enablePan={false}
              enableDamping
              dampingFactor={0.055}
              rotateSpeed={0.65}
              zoomSpeed={0.8}
              minDistance={8}
              maxDistance={46}
              maxPolarAngle={Math.PI * 0.72}
              minPolarAngle={Math.PI * 0.18}
              autoRotate={!hoveredPlanet && !warpingPlanet}
              autoRotateSpeed={0.28}
            />

            <GalaxyCameraController warpTarget={warpTarget} controlsRef={controlsRef} />
          </Canvas>
        </div>

        {/* Hovered Planet Telemetry Briefing */}
        <AnimatePresence>
          {hoveredPlanet && !warpingPlanet && (
            <motion.div
              className="galaxy-telemetry-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Sparkles size={14} color={hoveredPlanet.palette.primary} />
                <span
                  style={{
                    fontFamily: 'var(--font-tech)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.14em',
                    color: hoveredPlanet.palette.primary
                  }}
                >
                  PLANET 0{hoveredPlanet.order} • {hoveredPlanet.subtitle.toUpperCase()}
                </span>
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.1rem',
                  color: '#ffffff',
                  marginBottom: 4
                }}
              >
                {hoveredPlanet.name}
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                {hoveredPlanet.shortDescription}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Smooth Warp Transition Overlay */}
        <AnimatePresence>
          {warpingPlanet && (
            <motion.div
              className="galaxy-warp-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55 }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-tech)',
                  fontSize: '0.78rem',
                  letterSpacing: '0.26em',
                  color: warpingPlanet.palette.primary,
                  marginBottom: 8
                }}
              >
                ENTERING ORBIT
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
                  color: '#ffffff'
                }}
              >
                {warpingPlanet.name}
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </WebGLErrorBoundary>
  );
}
