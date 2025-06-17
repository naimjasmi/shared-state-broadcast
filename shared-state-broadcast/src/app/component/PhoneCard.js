'use client';

import { useEffect, useState } from 'react';

export default function PhoneCard() {
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    setTimestamp(new Date().toLocaleString());
  }, []);

  const ctiInfo = {
    callerId: '+60123456789',
    callType: 'Inbound',
    duration: '00:02:45',
    status: 'Connected',
    timestamp,
  };

  if (!timestamp) return null; 

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '1rem',
        backgroundColor: '#f9fafb',
        boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
        fontSize: '0.9rem',
        color: '#111827',
      }}
    >
      <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.75rem' }}>
        📞 CTI Call Info
      </h3>
      <div><strong>Caller ID:</strong> {ctiInfo.callerId}</div>
      <div><strong>Call Type:</strong> {ctiInfo.callType}</div>
      <div><strong>Duration:</strong> {ctiInfo.duration}</div>
      <div><strong>Status:</strong> {ctiInfo.status}</div>
      <div><strong>Timestamp:</strong> {ctiInfo.timestamp}</div>
    </div>
  );
}