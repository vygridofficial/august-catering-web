'use client';

import { usePathname } from 'next/navigation';
import { ReactiveDots } from '@/components/ui/ReactiveDots';
import { FloatingDock } from '@/components/layout/FloatingDock';
import { SocialSidebar } from '@/components/SocialSidebar';

export function BoutiqueAmbience() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/login');

  if (isAdminRoute) return null;

  return (
    <>
      {/* Global Interactive Texture */}
      <ReactiveDots 
        className="fixed inset-0 z-[200] pointer-events-none" 
        inactiveColor="rgba(255, 255, 255, 0.05)"
        activeColor="rgba(255, 204, 0, 0.4)"
        spacing={30}
        activeRadius={180}
      />
      <FloatingDock />
      <SocialSidebar />
    </>
  );
}
