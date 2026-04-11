'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, ContactShadows, MeshTransmissionMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import Image from 'next/image';

function SubtleFloatingObjects() {
  return (
    <group>
        <Float rotationIntensity={1} floatIntensity={2} speed={1}>
          {/* Abstract Centerpiece */}
          <mesh position={[0, 0, 0]} castShadow>
            <torusKnotGeometry args={[1.5, 0.4, 128, 32]} />
            <MeshTransmissionMaterial 
              backside 
              samples={4} 
              thickness={0.5} 
              chromaticAberration={1} 
              anisotropy={0.3} 
              distortion={0.5} 
              distortionScale={0.5} 
              temporalDistortion={0.1} 
              color="#ffcc00"
            />
          </mesh>

          {/* Orbiting Elements */}
          <mesh position={[3, 1, -2]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshPhysicalMaterial color="#ffffff" metalness={0.9} roughness={0.1} envMapIntensity={2} />
          </mesh>
          <mesh position={[-3, -2, 1]}>
            <octahedronGeometry args={[0.8]} />
            <meshPhysicalMaterial color="#ff9900" metalness={1} roughness={0.2} wireframe />
          </mesh>
          <mesh position={[1, -2.5, 2]}>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <MeshTransmissionMaterial thickness={1} roughness={0} transmission={1} ior={1.5} color="#fff" />
          </mesh>
        </Float>
    </group>
  );
}

export function MagneticHero() {
  return (
    <section id="hero-section" className="relative w-full h-[100svh] bg-background overflow-hidden">
      
      {/* High Quality Hero Image Background */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/1.webp" 
          alt="Premium Catering Event" 
          fill 
          className="object-cover opacity-40 mix-blend-luminosity"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
      </div>

      {/* Subtle WebGL Layer - Blends into background */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={2} castShadow />
          <Suspense fallback={null}>
            <SubtleFloatingObjects />
            <Environment preset="city" />
            <ContactShadows position={[0, -4, 0]} opacity={0.3} scale={20} blur={2} far={5} />
          </Suspense>
        </Canvas>
      </div>

      {/* Hero Typography - Fixed visibility using Framer Motion */}
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
        <motion.h1 
          initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
          className="text-[clamp(3.5rem,10vw,12rem)] leading-none font-heading font-black tracking-tighter text-foreground text-center z-20 px-4 drop-shadow-2xl"
        >
          AUGUST
          <br />
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.9, x: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.6 }}
            className="text-primary italic font-serif opacity-90 text-[clamp(2.5rem,6vw,8rem)] drop-shadow-lg"
          >
            CATERING
          </motion.span>
        </motion.h1>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 text-primary text-sm font-sans tracking-[0.3em] uppercase z-20 flex flex-col items-center gap-4"
      >
        <span className="drop-shadow-lg">Discover</span>
        <div className="w-[1px] h-12 bg-primary/30 relative overflow-hidden">
          <motion.div 
            animate={{ y: [0, 48] }} 
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            className="w-full h-1/2 bg-primary absolute top-0"
          />
        </div>
      </motion.div>
    </section>
  );
}
