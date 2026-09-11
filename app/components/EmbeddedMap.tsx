'use client';

import dynamic from 'next/dynamic';

// Dynamically import MapInner with SSR disabled
const MapInner = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => <div style={{ height: '300px', width: '100%', backgroundColor: '#f0f0f0' }}>Loading Map...</div>,
});

interface MapProps {
  latitude: number;
  longitude: number;
  placeName?: string;
}

export default function EmbeddedMap(props: MapProps) {
  return <MapInner {...props} />;
} 