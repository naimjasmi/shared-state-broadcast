'use client';

import { useEffect, useState } from 'react';

export default function CallCardForm({ onSubmit, isPopup = false }) {
  const [driver, setDriver] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [isDone, setIsDone] = useState(false);

  const generateRandomCoordinates = () => {
    const randomLat = 2.92 + Math.random() * 0.06;
    const randomLng = 101.62 + Math.random() * 0.06;
    setLat(randomLat.toFixed(6));
    setLng(randomLng.toFixed(6));
  };

  useEffect(() => {
    generateRandomCoordinates();
  }, []);

  const handleDispatch = () => {
    if (!driver || !lat || !lng) {
      alert('All fields are required');
      return;
    }

    const payload = {
      driverName: driver,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };

    if (isPopup) {
      const formChannel = new BroadcastChannel('form_channel');
      formChannel.postMessage({ type: 'new_dispatch', payload });
      formChannel.close();

    } else {
      onSubmit(payload);
      setDriver('');
      generateRandomCoordinates();
    }
  };

  const openFormInNewWindow = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('formOnly', 'true');
    const popup = window.open(url.toString(), 'FormPopup', 'width=600,height=800');

    const formChannel = new BroadcastChannel('popup_status_form');
    formChannel.postMessage({ type: 'popup_opened' });

    const interval = setInterval(() => {
      if (popup?.closed) {
        formChannel.postMessage({ type: 'popup_closed' });
        clearInterval(interval);
        formChannel.close();
      }
    }, 500);
  };

  if (isPopup && isDone) return null;

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2 style={{ color: '#111827' }}>Create Dispatch</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <input
          type="text"
          placeholder="Driver Name"
          value={driver}
          onChange={(e) => setDriver(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Latitude"
          value={lat}
          onChange={(e) => {
            const value = e.target.value;
            if (/^-?\d*\.?\d*$/.test(value)) setLat(value);
          }}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Longitude"
          value={lng}
          onChange={(e) => {
            const value = e.target.value;
            if (/^-?\d*\.?\d*$/.test(value)) setLng(value);
          }}
          style={inputStyle}
        />
        <button type="button" onClick={generateRandomCoordinates} style={buttonStyleGreen}>
          Generate Random Location
        </button>
        <button type="button" onClick={handleDispatch} style={buttonStyleBlue}>
          Submit Dispatch
        </button>

        {!isPopup && (
          <button
            type="button"
            onClick={openFormInNewWindow}
            style={buttonStyleOpenPopup}
          >
            Open CallCardForm in New Window
          </button>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '0.5rem',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  fontSize: '0.9rem',
  color: '#1f2937',
};

const buttonStyleGreen = {
  padding: '0.5rem',
  backgroundColor: '#10b981',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '0.9rem',
  cursor: 'pointer',
};

const buttonStyleBlue = {
  padding: '0.6rem',
  backgroundColor: '#3b82f6',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '1rem',
  cursor: 'pointer',
};

const buttonStyleOpenPopup = {
  padding: '0.6rem 1rem',
  backgroundColor: '#10b981',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '0.95rem',
  cursor: 'pointer',
};