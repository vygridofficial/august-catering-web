'use client';

import { useEffect } from 'react';

export function ScrollSafety() {
  useEffect(() => {
    const clearLock = () => {
      if (typeof window === 'undefined') return;
      
      // Force remove the specific antigravity lock if it exists
      document.body.classList.remove('antigravity-scroll-lock');
      
      // Force allow overflow if no modal/dialog is detected
      const hasModal = !!document.querySelector('[role="dialog"]') || 
                      !!document.querySelector('[aria-modal="true"]');
                      
      if (!hasModal && (document.body.style.overflow === 'hidden' || document.documentElement.style.overflow === 'hidden')) {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
    };

    // Run immediately and then on a short delay to catch late injections
    clearLock();
    const timer = setTimeout(clearLock, 1000);
    const timer2 = setTimeout(clearLock, 3000); // Super safety

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  return null;
}
