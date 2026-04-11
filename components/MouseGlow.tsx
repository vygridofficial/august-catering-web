'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export function MouseGlow() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(0, springConfig);
  const smoothY = useSpring(0, springConfig);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    smoothX.set(mousePosition.x);
    smoothY.set(mousePosition.y);
  }, [mousePosition, smoothX, smoothY]);

  if (isMobile) return null; // Or return a much lighter version

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* The glowing orb that follows the mouse */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-primary/40 blur-[120px] mix-blend-screen"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      {/* The glass layer that sits ON TOP of the orb to create the 'behind frosted glass' effect */}
      <div className="absolute inset-0 backdrop-blur-[80px] bg-background/30 mask-image-fade" />
    </div>
  );
}
