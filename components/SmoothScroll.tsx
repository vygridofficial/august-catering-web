'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const disableSmoothScroll = pathname.startsWith('/admin') || pathname.startsWith('/login');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.refresh();
    }
  }, [pathname]);

  if (disableSmoothScroll) {
    return <>{children}</>;
  }

  return (
    <ReactLenis 
      root 
      options={{ 
        lerp: 0.1, 
        duration: 1.5, 
        smoothWheel: true,
        wheelMultiplier: 1.1,
        touchMultiplier: 1.5
      }}
    >
      {children}
    </ReactLenis>
  );
}
