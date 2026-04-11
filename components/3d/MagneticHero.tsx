'use client';

import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PresentationControls, ContactShadows, MeshTransmissionMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

function FloatingObjects() {
  const group = useRef<THREE.Group>(null);
  
  // Exploding objects animation bound to scroll
  useEffect(() => {
    if (!group.current) return;
    
    gsap.to(group.current.position, {
      y: 5,
      z: 5,
      ease: 'power3.inOut',
      scrollTrigger: {
        trigger: '#hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      }
    });

    // Make children "explode" outwards on scroll
    group.current.children.forEach((child, index) => {
      const direction = new THREE.Vector3().copy(child.position).normalize();
      gsap.to(child.position, {
        x: child.position.x + direction.x * 5,
        y: child.position.y + direction.y * 5,
        z: child.position.z + direction.z * 5,
        rotationX: Math.PI * 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        }
      });
    });
  }, []);

  return (
    <group ref={group}>
      <PresentationControls
        global
        rotation={[0.13, 0.1, 0]}
        polar={[-0.4, 0.2]}
        azimuth={[-1, 0.75]}
      >
        <Float rotationIntensity={2} floatIntensity={4} speed={2}>
          {/* Abstract Centerpiece */}
          <mesh position={[0, 0, 0]} castShadow>
            <torusKnotGeometry args={[1.2, 0.4, 128, 32]} />
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
          <mesh position={[-2.5, -2, 1.5]}>
            <octahedronGeometry args={[0.8]} />
            <meshPhysicalMaterial color="#ff9900" metalness={1} roughness={0.2} wireframe />
          </mesh>
          <mesh position={[1, -2.5, 2]}>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <MeshTransmissionMaterial thickness={1} roughness={0} transmission={1} ior={1.5} color="#fff" />
          </mesh>
        </Float>
      </PresentationControls>
    </group>
  );
}

export function MagneticHero() {
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Immersive textual scale and reveal
    gsap.fromTo(textRef.current, 
      { opacity: 0, scale: 0.8, filter: 'blur(20px)', y: 100 },
      { opacity: 1, scale: 1, filter: 'blur(0px)', y: 0, duration: 2, ease: 'expo.out' }
    );

    gsap.to(textRef.current, {
      opacity: 0,
      scale: 1.2,
      y: -150,
      filter: 'blur(10px)',
      scrollTrigger: {
        trigger: '#hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      }
    });
  }, []);

  return (
    <section id="hero-section" className="relative w-full h-[120vh] bg-background overflow-hidden cursor-crosshair">
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
        <h1 
          ref={textRef}
          className="text-[clamp(3rem,8vw,10rem)] leading-none font-heading font-black tracking-tighter text-foreground text-center mix-blend-difference z-20 px-4"
        >
          AUGUST
          <br />
          <span className="text-primary italic font-serif opacity-90 text-[clamp(2rem,5vw,7rem)]">CATERING</span>
        </h1>
      </div>
      
      <div className="absolute inset-0 z-0">
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
          <Suspense fallback={null}>
            <FloatingObjects />
            <Environment preset="city" />
            <ContactShadows position={[0, -3, 0]} opacity={0.5} scale={20} blur={2} far={4.5} />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 text-primary text-sm font-sans tracking-[0.3em] uppercase z-20 flex flex-col items-center gap-4"
      >
        <span>Discover</span>
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
