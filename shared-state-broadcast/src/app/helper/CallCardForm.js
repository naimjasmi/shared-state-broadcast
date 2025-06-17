'use client';

import { useState } from 'react';

export default function CallCardForm({ onSubmit }) {
  const [driver, setDriver] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!driver || !lat || !lng) return alert('All fields are required');

    onSubmit({
      driverName: driver,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    });

    setDriver('');
    setLat('');
    setLng('');
  };

  const generateRandomCoordinates = () => {
    // Cyberjaya-Putrajaya range
    const randomLat = 2.92 + Math.random() * 0.06; // ~2.92 to ~2.98
    const randomLng = 101.62 + Math.random() * 0.06; // ~101.62 to ~101.68

    setLat(randomLat.toFixed(6));
    setLng(randomLng.toFixed(6));
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <input
        type="text"
        placeholder="Driver Name"
        value={driver}
        onChange={(e) => setDriver(e.target.value)}
        style={{
          padding: '0.5rem',
          borderRadius: '6px',
          border: '1px solid #d1d5db',
          fontSize: '0.9rem',
          color: '#1f2937'
        }}
      />

      <input
        type="text"
        placeholder="Latitude"
        value={lat}
        onChange={(e) => {
          const value = e.target.value;
          if (/^-?\d*\.?\d*$/.test(value)) setLat(value);
        }}
        style={{
          padding: '0.5rem',
          borderRadius: '6px',
          border: '1px solid #d1d5db',
          fontSize: '0.9rem',
          color: '#1f2937'
        }}
      />

      <input
        type="text"
        placeholder="Longitude"
        value={lng}
        onChange={(e) => {
          const value = e.target.value;
          if (/^-?\d*\.?\d*$/.test(value)) setLng(value);
        }}
        style={{
          padding: '0.5rem',
          borderRadius: '6px',
          border: '1px solid #d1d5db',
          fontSize: '0.9rem',
          color: '#1f2937'
        }}
      />

      <button
        type="button"
        onClick={generateRandomCoordinates}
        style={{
          padding: '0.5rem',
          backgroundColor: '#10b981',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '0.9rem',
          cursor: 'pointer',
        }}
      >
        Generate Random Location
      </button>

      <button
        type="submit"
        style={{
          padding: '0.6rem',
          backgroundColor: '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '0.95rem',
          cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        }}
      >
        Create Call Card
      </button>
    </form>
  );
}