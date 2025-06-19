'use client';

import { useEffect, useState } from 'react';
import CTICallInfo from '../helper/CtiCallInfo';
import HangupReasonSection from '../helper/HangUpReason';
import SpeedDialSection from '../helper/SpeedDial';

export default function PhoneCard() {
  const [timestamp, setTimestamp] = useState('');
  const [selectedReason, setSelectedReason] = useState(null);

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

  const handleReasonSelect = (reason) => {
    setSelectedReason(reason);
    console.log('Hangup Reason selected:', reason);
  };

  return (
    <div>
      <CTICallInfo ctiInfo={ctiInfo} />
      <HangupReasonSection onSelect={handleReasonSelect} />
      <SpeedDialSection onSelect={(val) => console.log('Speed Dial:', val)} />
    </div>
  );
}