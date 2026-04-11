'use client';

import { ReactLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const disableSmoothScroll = pathname.startsWith('/admin') || pathname.startsWith('/login');

  if (disableSmoothScroll) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
