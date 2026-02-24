import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'VETEA Bubble Tea',
    short_name: 'VETEA',
    description: 'Bubble tea ordering progressive web app',
    start_url: '/',
    display: 'standalone',
    background_color: '#fcf8f1',
    theme_color: '#245741',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
  };
}
