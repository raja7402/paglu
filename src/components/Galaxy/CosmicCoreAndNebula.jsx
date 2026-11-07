import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import pagluConfig from '../../config/pagluConfig';

export default function CosmicCoreAndNebula({ isMobile = false }) {
  const spiralRef = useRef();
  const coreGroupRef = useRef();
  const asteroidGroupRef = useRef();

  // Procedural spiral galaxy particle cloud
  const spiralData = useMemo(() => {
    const count = isMobile ? 1400 : 3400;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorInside = new THREE.Color('#38bdf8');
    const colorMid = new THREE.Color('#8b5cf6');
    const colorOutside = new THREE.Color('#f472b6');

    const branches = 4;
    const maxRadius = 34;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = Math.pow(Math.random(), 1.45) * maxRadius + 2.2;
      const spinAngle = radius * 0.34;
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;

      const spread = (isMobile ? 0.9 : 1.15) * (0.25 + radius * 0.05);
      const randomX = (Math.random() - 0.5) * spread * 2;
      const randomY = (Math.random() - 0.5) * spread * 0.85;
      const randomZ = (Math.random() - 0.5) * spread * 2;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      const ratio = radius / maxRadius;
      const mixed = colorInside.clone();
      if (ratio < 0.5) {
        mixed.lerp(colorMid, ratio * 2);
      } else {
        mixed.copy(colorMid).lerp(colorOutside, (ratio - 0.5) * 2);
      }

      colors[i3] = mixed.r;
      colors[i3 + 1] = mixed.g;
      colors[i3 + 2] = mixed.b;
    }

    return { positions, colors, count };
  }, [isMobile]);

  // Floating cosmic crystal asteroids along outer rim
  const asteroids = useMemo(() => {
    const count = isMobile ? 14 : 28;
    return Array.from({ length: count }, (_, idx) => {
      const angle = (idx / count) * Math.PI * 2 + (idx % 3) * 0.2;
      const radius = 6 + (idx * 7.3) % 23;
      const y = ((idx % 5) - 2) * 1.4;
      return {
        id: idx,
        position: [Math.cos(angle) * radius, y, Math.sin(angle) * radius],
        scale: 0.08 + (idx % 4) * 0.055,
        rotSpeed: 0.2 + (idx % 5) * 0.12
      };
    });
  }, [isMobile]);

  useFrame((state, delta) => {
    if (spiralRef.current) {
      spiralRef.current.rotation.y += delta * 0.022;
    }
    if (coreGroupRef.current) {
      coreGroupRef.current.rotation.y -= delta * 0.18;
      coreGroupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6) * 0.12;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.8) * 0.045;
      coreGroupRef.current.scale.setScalar(pulse);
    }
    if (asteroidGroupRef.current) {
      asteroidGroupRef.current.rotation.y += delta * 0.015;
    }
  });

  return (
    <group>
      {/* Multi-depth background starfield */}
      <Stars
        radius={95}
        depth={55}
        count={isMobile ? 1800 : 4200}
        factor={4.2}
        saturation={0.35}
        fade
        speed={0.8}
      />

      {/* Ambient floating cosmic sparkles */}
      <Sparkles
        count={isMobile ? 65 : 140}
        scale={[42, 16, 42]}
        size={isMobile ? 2.4 : 3.2}
        speed={0.35}
        opacity={0.7}
        color="#a855f7"
      />

      {/* Swirling Spiral Galaxy Dust */}
      <points ref={spiralRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={spiralData.count}
            array={spiralData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={spiralData.count}
            array={spiralData.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.14 : 0.11}
          vertexColors
          transparent
          opacity={0.78}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Central Luminous Paglu Galactic Core */}
      <group ref={coreGroupRef}>
        <mesh>
          <sphereGeometry args={[1.55, 32, 32]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh>
          <sphereGeometry args={[2.35, 32, 32]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.34}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[3.6, 32, 32]} />
          <meshBasicMaterial
            color="#a855f7"
            transparent
            opacity={0.18}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2.2, 0.2, 0]}>
          <torusGeometry args={[2.9, 0.035, 16, 96]} />
          <meshBasicMaterial
            color="#f472b6"
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Delicate Orbital Guide Rings for all 6 Planets */}
      {pagluConfig.planets.map((planet) => (
        <mesh key={`orbit-${planet.id}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <ringGeometry args={[planet.orbitRadius - 0.025, planet.orbitRadius + 0.025, 128]} />
          <meshBasicMaterial
            color={planet.palette.primary}
            transparent
            opacity={0.14}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Floating Crystalline Cosmic Objects */}
      <group ref={asteroidGroupRef}>
        {asteroids.map((ast) => (
          <mesh key={ast.id} position={ast.position} scale={ast.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color="#93c5fd"
              emissive="#6d28d9"
              emissiveIntensity={0.65}
              roughness={0.25}
              metalness={0.8}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
