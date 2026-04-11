'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function AbstractTree() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.3;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* Core Trunk / August Catering Portal */}
        <mesh position={[0, -1, 0]}>
          <cylinderGeometry args={[0.3, 0.6, 4, 32]} />
          <MeshTransmissionMaterial 
            backside
            thickness={2}
            roughness={0.1}
            transmission={0.9}
            ior={1.5}
            chromaticAberration={0.05}
            color="#ecfdf5" 
          />
        </mesh>
        
        {/* Abstract Leaves / Spheres */}
        {[...Array(15)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              (Math.random() - 0.5) * 4, 
              Math.random() * 3 + 1, 
              (Math.random() - 0.5) * 4
            ]}
          >
            <sphereGeometry args={[Math.random() * 0.8 + 0.2, 32, 32]} />
            <MeshTransmissionMaterial 
              backside
              thickness={1.5}
              roughness={0.2}
              transmission={0.95}
              ior={1.2}
              chromaticAberration={0.1}
              color={Math.random() > 0.5 ? "#10b981" : "#ffffff"} 
            />
          </mesh>
        ))}
        
        {/* Glowing floating particles (like fireflies/cicadas) */}
        <Sparkles 
          count={100} 
          scale={8} 
          size={5} 
          speed={0.4} 
          opacity={0.5} 
          color="#34d399" 
        />
      </Float>
      
      {/* Lighting to make the glass pop */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={2} color="#10b981" />
    </group>
  );
}
