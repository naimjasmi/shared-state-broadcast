'use client';

import { useEffect, useState } from 'react';
import Demo from './component/Demo';
import DispatchList from './component/DispatchList';
import PhoneCard from './component/PhoneCard';
import CallCardForm from './helper/CallCardForm';

export default function HomePage() {
  const [dispatches, setDispatches] = useState([]);
  const [isMapPopupOpen, setIsMapPopupOpen] = useState(false);
  const [isFormPopupOpen, setIsFormPopupOpen] = useState(false);
  const [mode, setMode] = useState('loading');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('formOnly') === 'true') {
      setMode('formOnly');
    } else if (params.get('mapOnly') === 'true') {
      setMode('mapOnly');
    } else {
      setMode('normal');
    }
  }, []);

  //load dispatches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dispatches');
    if (saved) setDispatches(JSON.parse(saved));
  }, []);

  //save dispatches to localStorage
  useEffect(() => {
    localStorage.setItem('dispatches', JSON.stringify(dispatches));
  }, [dispatches]);

  //handle popup status communication
  useEffect(() => {
    const mapChannel = new BroadcastChannel('popup_status_map');
    const formChannel = new BroadcastChannel('popup_status_form');

    mapChannel.onmessage = (event) => {
      if (event.data?.type === 'popup_opened') {
        setIsMapPopupOpen(true);
        sessionStorage.setItem('map_popup', 'true');
      }
      if (event.data?.type === 'popup_closed') {
        setIsMapPopupOpen(false);
        sessionStorage.removeItem('map_popup');
      }
    };

    formChannel.onmessage = (event) => {
      if (event.data?.type === 'popup_opened') {
        setIsFormPopupOpen(true);
        sessionStorage.setItem('form_popup', 'true');
      }
      if (event.data?.type === 'popup_closed') {
        setIsFormPopupOpen(false);
        sessionStorage.removeItem('form_popup');
      }
    };

    if (sessionStorage.getItem('map_popup') === 'true') {
      setIsMapPopupOpen(true);
    }
    if (sessionStorage.getItem('form_popup') === 'true') {
      setIsFormPopupOpen(true);
    }

    return () => {
      mapChannel.close();
      formChannel.close();
    };
  }, []);

  //receive new dispatch from popup form
  useEffect(() => {
    const formChannel = new BroadcastChannel('form_channel');
    formChannel.onmessage = (event) => {
      if (event.data?.type === 'new_dispatch') {
        const { lat, lng, driverName, ...rest } = event.data.payload;
        handleNewDispatch({ lat, lng, driverName, ...rest });
      }
    };
    return () => formChannel.close();
  }, [dispatches]);

  //sync deletion from map popup
  useEffect(() => {
    const mapChannel = new BroadcastChannel('map_channel');

    mapChannel.onmessage = (event) => {
      if (event.data?.type === 'delete_marker') {
        const { lat, lng } = event.data.payload;

        setDispatches((prev) =>
          prev.filter((d) => {
            const match = d.location.match(/Lat:\s*(-?\d+\.\d+),\s*Lng:\s*(-?\d+\.\d+)/);
            if (!match) return true;
            const dLat = parseFloat(match[1]);
            const dLng = parseFloat(match[2]);
            return dLat.toFixed(4) !== lat.toFixed(4) || dLng.toFixed(4) !== lng.toFixed(4);
          })
        );
      }
    };

    return () => mapChannel.close();
  }, []);

  //create new dispatch and broadcast to map
  const handleNewDispatch = (data) => {
    const newId = `D${(dispatches.length + 1).toString().padStart(3, '0')}`;

    const newDispatch = {
      id: newId,
      driver: data.driverName || `Driver ${dispatches.length + 1}`,
      location: `Lat: ${data.lat.toFixed(4)}, Lng: ${data.lng.toFixed(4)}`,
      status: 'Pending',
      eta: 'Awaiting dispatch',
      alertNo: data.alertNo || '',
      timestamp: data.timestamp || new Date().toLocaleString(),
      callerName: data.callerName || '',
      phone: data.phone || '',
      locationCode: data.locationCode || '',
      district: data.district || '',
      state: data.state || '',
      locationNote: data.locationNote || '',
      alertNote: data.alertNote || '',
    };

    setDispatches((prev) => [...prev, newDispatch]);

    const mapChannel = new BroadcastChannel('map_channel');
    mapChannel.postMessage({
      type: 'add_marker',
      payload: {
        lat: data.lat,
        lng: data.lng,
        driverName: newDispatch.driver,
        status: newDispatch.status,
        dispatchId: newId,
      },
    });
    mapChannel.close();
  };

  //open form popup
  const openFormInNewWindow = () => {
    if (sessionStorage.getItem('form_popup') === 'true') return;

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

  if (mode === 'formOnly') {
    return (
      <main style={{ padding: '2rem', height: '100vh' }}>
        <CallCardForm isPopup />
      </main>
    );
  }

  if (mode === 'mapOnly') {
    return (
      <main style={{ padding: 0, margin: 0, height: '100vh' }}>
        <Demo />
      </main>
    );
  }

  if (mode === 'loading') return null;

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
      <div style={{ flex: '1 1 400px', minWidth: '300px' }}>
        <PhoneCard />
      </div>

      {!isMapPopupOpen && (
        <div style={{ flex: '2 1 600px', minWidth: '400px' }}>
          <Demo />
        </div>
      )}

      {!isFormPopupOpen && (
        <div style={{ flex: '1 1 400px', minWidth: '300px' }}>
          <CallCardForm onSubmit={handleNewDispatch} />
        </div>
      )}

      <div style={{ flex: '1 1 400px', minWidth: '300px' }}>
        <DispatchList dispatches={dispatches} setDispatches={setDispatches} />
      </div>
    </main>
  );
}