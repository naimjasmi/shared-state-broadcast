'use client';

import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('../helper/MapComponent'), {
  ssr: false,
});

export default function Demo() {
  return <MapComponent />;
}