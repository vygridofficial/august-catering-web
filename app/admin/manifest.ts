import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/admin',
    name: 'Gateway Kitchen Admin',
    short_name: 'GK Admin',
    description: 'Installable admin panel for Gateway Kitchen',
    start_url: '/admin',
    scope: '/admin',
    display: 'standalone',
    display_override: ['standalone'],
    background_color: '#0f0f0f',
    theme_color: '#0f0f0f',
    icons: [
      {
        src: '/logo-nobg.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo-1.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}