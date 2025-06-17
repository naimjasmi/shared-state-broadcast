'use client';

import { useSearchParams } from 'next/navigation';
import Demo from './component/Demo';
import DispatchList from './component/DispatchList';
import PhoneCard from './component/PhoneCard';
import CallCardForm from './helper/CallCardForm';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const searchParams = useSearchParams();
  const isMapOnly = searchParams.get('mapOnly') === 'true';

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [dispatches, setDispatches] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('dispatches');
    if (saved) setDispatches(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('dispatches', JSON.stringify(dispatches));
  }, [dispatches]);

  useEffect(() => {
    const popupFlag = sessionStorage.getItem('popup_open');
    if (popupFlag === 'true') {
      setIsPopupOpen(true);
    }

    const statusChannel = new BroadcastChannel('popup_status');
    statusChannel.onmessage = (event) => {
      if (event.data?.type === 'popup_opened') {
        setIsPopupOpen(true);
        sessionStorage.setItem('popup_open', 'true');
      }
      if (event.data?.type === 'popup_closed') {
        setIsPopupOpen(false);
        sessionStorage.removeItem('popup_open');
      }
    };

    return () => statusChannel.close();
  }, []);

  const handleNewDispatch = ({ lat, lng, driverName }) => {
    const newId = `D${(dispatches.length + 1).toString().padStart(3, '0')}`;
    const newDispatch = {
      id: newId,
      driver: driverName || `Driver ${dispatches.length + 1}`,
      location: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
      status: 'Pending',
      eta: 'Awaiting dispatch',
    };

    setDispatches((prev) => [...prev, newDispatch]);

    const channel = new BroadcastChannel('map_channel');
    channel.postMessage({
      type: 'add_marker',
      payload: { lat, lng },
    });
    channel.close();
  };

  if (isMapOnly) {
    return (
      <main style={{ padding: '0', margin: '0', height: '100vh' }}>
        <Demo />
      </main>
    );
  }

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'row',
        padding: '2rem',
        gap: '2rem',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
      }}
    >
      <div style={{ flex: isPopupOpen ? '1 1 100%' : '1 1 400px', minWidth: '300px' }}>
        <PhoneCard />
      </div>

      {!isPopupOpen && (
        <div style={{ flex: '2 1 600px', minWidth: '400px' }}>
          <Demo />
        </div>
      )}
      <div style={{ flex: isPopupOpen ? '1 1 100%' : '1 1 400px', minWidth: '300px' }}>
        <CallCardForm onSubmit={handleNewDispatch} />
      </div>

      <div style={{ flex: isPopupOpen ? '1 1 100%' : '1 1 400px', minWidth: '300px' }}>
        <DispatchList
          dispatches={dispatches}
          setDispatches={setDispatches}
        />
      </div>
    </main>
  );
}