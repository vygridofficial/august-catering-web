'use client';

import { motion } from 'framer-motion';

export function HeroMobileBackdrop() {
  return (
    <>
      <div
        className="absolute inset-0 z-0 md:hidden"
        style={{
          backgroundImage:
            'linear-gradient(148deg, oklch(0.985 0.008 160) 0%, oklch(0.965 0.04 160) 32%, color-mix(in oklch, var(--primary) 45%, transparent) 70%, oklch(0.98 0.012 160) 100%)',
        }}
      />

      <motion.div
        className="absolute inset-0 z-[1] md:hidden"
        style={{
          backgroundImage:
            'linear-gradient(154deg, color-mix(in oklch, var(--primary) 28%, transparent) 0%, oklch(0.99 0.008 160) 36%, color-mix(in oklch, var(--primary) 74%, transparent) 72%, oklch(0.985 0.01 160) 100%)',
          backgroundSize: '220% 220%',
          backgroundPosition: '0% 0%',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 70%', '0% 0%'],
          opacity: [0.55, 0.82, 0.62],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute inset-0 z-[2] md:hidden pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(42% 46% at 18% 22%, color-mix(in oklch, var(--primary) 35%, transparent), transparent 72%), radial-gradient(56% 58% at 86% 12%, rgba(255,255,255,0.72), transparent 74%), radial-gradient(52% 48% at 76% 86%, color-mix(in oklch, var(--primary) 18%, transparent), transparent 72%)',
        }}
        animate={{
          opacity: [0.65, 0.95, 0.72],
          scale: [1, 1.04, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute inset-0 z-[3] md:hidden pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(120deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.02) 44%, rgba(255,255,255,0.22) 100%)',
          mixBlendMode: 'soft-light',
        }}
        animate={{ opacity: [0.35, 0.52, 0.38] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  );
}