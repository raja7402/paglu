import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { getPlanetTexture } from './planetTextures';
import soundEngine from '../../utils/soundEngine';

export default function Planet3D({
  planet,
  isVisited,
  isFinalUnlocked,
  isWarping,
  onPlanetClick,
  onPlanetHover
}) {
  const orbitGroupRef = useRef();
  const sphereRef = useRef();
  const haloRef = useRef();
  const moonGroupRef = useRef();
  const astrolabeRef = useRef();
  const angleRef = useRef(planet.orbitAngle);

  const [hovered, setHovered] = useState(false);

  const surfaceTexture = useMemo(
    () => getPlanetTexture(planet.textureType, planet.palette),
    [planet.textureType, planet.palette]
  );

  const isLockedFinal = planet.id === 'final' && !isFinalUnlocked;

  useFrame((state, delta) => {
    // Gentle orbital motion (slows down when hovered so clicking/tapping is effortless!)
    const speedFactor = hovered ? 0.12 : 0.45;
    angleRef.current += delta * planet.orbitSpeed * speedFactor;

    const x = Math.cos(angleRef.current) * planet.orbitRadius;
    const z = Math.sin(angleRef.current) * planet.orbitRadius;
    const y =
      planet.verticalOffset +
      Math.sin(state.clock.elapsedTime * 0.9 + planet.order) * 0.24;

    if (orbitGroupRef.current) {
      orbitGroupRef.current.position.set(x, y, z);
    }

    // Slow axial rotation
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.28;
    }

    // Smooth hover glow & scale interpolation
    if (haloRef.current) {
      const targetScale = hovered ? 1.38 : 1.18;
      haloRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.12
      );
    }

    if (moonGroupRef.current) {
      moonGroupRef.current.rotation.y += delta * 0.65;
      moonGroupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }

    if (astrolabeRef.current) {
      astrolabeRef.current.rotation.x += delta * 0.45;
      astrolabeRef.current.rotation.y -= delta * 0.35;
    }
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    if (isWarping) return;
    setHovered(true);
    document.body.style.cursor = 'pointer';
    soundEngine.playHover();
    if (onPlanetHover) onPlanetHover(planet);
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = 'auto';
    if (onPlanetHover) onPlanetHover(null);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (isWarping) return;
    document.body.style.cursor = 'auto';
    const worldPos = new THREE.Vector3();
    if (orbitGroupRef.current) {
      orbitGroupRef.current.getWorldPosition(worldPos);
    }
    onPlanetClick(planet, worldPos);
  };

  return (
    <group ref={orbitGroupRef}>
      {/* Hover point light */}
      {hovered && (
        <pointLight
          color={planet.palette.glow}
          intensity={4.5}
          distance={9}
          decay={2}
        />
      )}

      {/* Main Planet Sphere */}
      <mesh
        ref={sphereRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[planet.size, 48, 48]} />
        <meshStandardMaterial
          map={surfaceTexture}
          roughness={0.52}
          metalness={0.18}
          emissive={planet.palette.primary}
          emissiveIntensity={hovered ? 0.52 : 0.18}
        />
      </mesh>

      {/* Atmospheric Glow Halo */}
      <mesh ref={haloRef} scale={1.18}>
        <sphereGeometry args={[planet.size, 32, 32]} />
        <meshBasicMaterial
          color={hovered ? '#ffffff' : planet.palette.glow}
          transparent
          opacity={hovered ? 0.34 : 0.16}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Planetary Rings */}
      {planet.hasRings && (
        <mesh rotation={planet.ringTilt}>
          <ringGeometry args={[planet.size * 1.42, planet.size * 2.05, 64]} />
          <meshBasicMaterial
            color={planet.palette.ring}
            transparent
            opacity={hovered ? 0.65 : 0.38}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Special Interlocking Portal Astrolabe Rings for Final Destination */}
      {planet.id === 'final' && (
        <group ref={astrolabeRef}>
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[planet.size * 1.65, 0.032, 16, 72]} />
            <meshBasicMaterial
              color={isLockedFinal ? '#a855f7' : '#fbbf24'}
              transparent
              opacity={0.78}
            />
          </mesh>
          <mesh rotation={[0, Math.PI / 3, Math.PI / 4]}>
            <torusGeometry args={[planet.size * 1.88, 0.025, 16, 72]} />
            <meshBasicMaterial
              color={isLockedFinal ? '#38bdf8' : '#f472b6'}
              transparent
              opacity={0.65}
            />
          </mesh>
        </group>
      )}

      {/* Orbiting Mini Moons */}
      <group ref={moonGroupRef}>
        {Array.from({ length: planet.moons || 1 }, (_, idx) => {
          const mAngle = (idx / (planet.moons || 1)) * Math.PI * 2;
          const mDist = planet.size * 1.75 + idx * 0.45;
          return (
            <mesh
              key={idx}
              position={[Math.cos(mAngle) * mDist, (idx - 0.5) * 0.25, Math.sin(mAngle) * mDist]}
            >
              <sphereGeometry args={[0.13 + idx * 0.03, 16, 16]} />
              <meshStandardMaterial
                color="#e2e8f0"
                emissive={planet.palette.secondary}
                emissiveIntensity={0.4}
              />
            </mesh>
          );
        })}
      </group>

      {/* Floating Planet Name Tag (HTML Overlay anchored in 3D space) */}
      <Html
        position={[0, planet.size + 0.95, 0]}
        center
        distanceFactor={18}
        zIndexRange={[20, 0]}
      >
        <button
          type="button"
          className={`galaxy-planet-label ${hovered ? 'hovered' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (isWarping) return;
            const worldPos = new THREE.Vector3();
            if (orbitGroupRef.current) {
              orbitGroupRef.current.getWorldPosition(worldPos);
            }
            onPlanetClick(planet, worldPos);
          }}
          style={{
            '--planet-color': planet.palette.primary
          }}
        >
          <span className="galaxy-planet-order">0{planet.order}</span>
          <span className="galaxy-planet-name">{planet.name}</span>
          {planet.id === 'final' ? (
            <span className="galaxy-planet-lock">
              {isLockedFinal ? '🔒' : '✨'}
            </span>
          ) : (
            isVisited && <span className="galaxy-planet-visited">✓</span>
          )}
        </button>
      </Html>
    </group>
  );
}
