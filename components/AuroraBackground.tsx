"use client";
import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export const AuroraBackground = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      className={`relative flex flex-col items-center justify-center bg-background text-foreground transition-bg overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`
            absolute -inset-[10px] opacity-40
            [--white-gradient:repeating-linear-gradient(100deg,var(--background)_0%,var(--background)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--background)_16%)]
            [--aurora:repeating-linear-gradient(100deg,var(--primary)_10%,var(--secondary)_15%,var(--background)_20%,var(--primary)_25%,var(--secondary)_30%)]
            [background-image:var(--white-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[20px] mix-blend-screen
            pointer-events-none absolute -inset-[10px] opacity-40
          `}
          style={{
            animation: shouldReduceMotion ? "none" : isMobile ? "aurora 120s linear infinite" : "aurora 60s linear infinite",
            willChange: "transform",
            opacity: isMobile ? 0.2 : 0.3,
          }}
        ></div>
        {!shouldReduceMotion && (
          <div className={`absolute inset-0 bg-transparent mix-blend-overlay ${isMobile ? 'opacity-10' : 'opacity-20'}`}>
            <svg className={`absolute w-full h-full ${isMobile ? 'opacity-[0.01]' : 'opacity-[0.02]'} pointer-events-none`}>
               <filter id="noise">
                  <feTurbulence 
                    type="fractalNoise" 
                    baseFrequency="0.9" 
                    numOctaves={isMobile ? 1 : 2} 
                    stitchTiles="stitch"
                  />
               </filter>
               <rect width="100%" height="100%" filter="url(#noise)" />
            </svg>
          </div>
        )}
      </div>
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full"
      >
        {children}
      </motion.div>
      {!shouldReduceMotion && (
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes aurora {
            from {
              background-position: 50% 50%, 50% 50%;
            }
            to {
              background-position: 350% 50%, 350% 50%;
            }
          }
        `}} />
      )}
    </div>
  );
};
