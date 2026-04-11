'use client';

import dynamic from 'next/dynamic';

const GradientBackground = dynamic(
  () => import('@/components/GradientBackground').then((mod) => mod.GradientBackground),
  { ssr: false }
);

export function DynamicGradient() {
  return <GradientBackground />;
}
