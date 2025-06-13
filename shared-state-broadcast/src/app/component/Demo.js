'use client';

import { useEffect, useState } from 'react';

export default function Demo() {
  const [message, setMessage] = useState('');
  const [received, setReceived] = useState('');

  useEffect(() => {
    const channel = new BroadcastChannel('test_bc');
    channel.onmessage = event => setReceived(event.data);
    return () => channel.close();
  }, []);

  const sendMessage = () => {
    const channel = new BroadcastChannel('test_bc');
    channel.postMessage(message);
    channel.close();
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1rem', width:'100%', maxWidth:'400px', margin:'0 auto' }}>
      <h2>BroadcastChannel Demo</h2>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Type a message"
        style={{ padding:'0.5rem', fontSize:'1rem', width: '100%' }}
      />
      <button onClick={sendMessage} style={{ padding:'0.5rem', fontSize:'1rem' }}>
        Send Message
      </button>
      {received && (
        <p>
          <strong>Received message:</strong> {received}
        </p>
      )}
    </div>
  );
}