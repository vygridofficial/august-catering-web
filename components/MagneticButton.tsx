'use client';

import { useRef, useState } from 'react';
import { motion, Transition } from 'framer-motion';
import Link from 'next/link';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
}

export function MagneticButton({ children, className = '', onClick, href, target }: MagneticButtonProps) {
  const ref = useRef<any>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    if (!ref.current) return;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 z-0 bg-primary opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-full blur-md mix-blend-screen scale-150 pointer-events-none" />
    </>
  );

  const transition: Transition = { type: 'spring', stiffness: 150, damping: 15, mass: 0.1 };

  const sharedProps = {
    ref,
    onMouseMove: handleMouse,
    onMouseLeave: reset,
    onClick,
    animate: { x, y },
    transition,
    className: `relative inline-flex items-center justify-center overflow-hidden rounded-full ${className}`
  };

  if (href) {
    const isExternal = href.startsWith('http') || href.startsWith('https') || href.startsWith('wa.me');
    if (isExternal) {
      return (
        <motion.a 
          href={href} 
          target={target || '_blank'} 
          rel="noopener noreferrer" 
          {...sharedProps}
        >
          {content}
        </motion.a>
      );
    }
    return (
      <Link href={href} passHref legacyBehavior>
        <motion.a {...sharedProps}>
          {content}
        </motion.a>
      </Link>
    );
  }

  return (
    <motion.button type="button" {...sharedProps}>
      {content}
    </motion.button>
  );
}
