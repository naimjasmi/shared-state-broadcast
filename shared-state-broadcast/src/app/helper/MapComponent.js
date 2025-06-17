'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function MapComponent() {
    const [markers, setMarkers] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const mapRef = useRef(null);

    const isMapOnly =
        typeof window !== 'undefined' &&
        new URLSearchParams(window.location.search).get('mapOnly') === 'true';

    useEffect(() => {
        const saved = localStorage.getItem('map_markers');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setMarkers(parsed);
            } catch (e) {
                console.error('Error parsing markers:', e);
            }
        }
        setLoaded(true); 
    }, []);

    useEffect(() => {
        if (loaded) {
            localStorage.setItem('map_markers', JSON.stringify(markers));
        }
    }, [markers, loaded]);

    //Broadcast popup open/close
    useEffect(() => {
        const statusChannel = new BroadcastChannel('popup_status');

        statusChannel.onmessage = (event) => {
            if (event.data?.type === 'popup_opened') setIsPopupOpen(true);
            if (event.data?.type === 'popup_closed') setIsPopupOpen(false);
        };

        if (isMapOnly) {
            statusChannel.postMessage({ type: 'popup_opened' });

            const handleUnload = () => {
                statusChannel.postMessage({ type: 'popup_closed' });
                sessionStorage.removeItem('popup_open');
            };

            window.addEventListener('beforeunload', handleUnload);

            return () => {
                window.removeEventListener('beforeunload', handleUnload);
                statusChannel.close();
            };
        }

        return () => statusChannel.close();
    }, [isMapOnly]);

    useEffect(() => {
        const mapChannel = new BroadcastChannel('map_channel');

        mapChannel.onmessage = (event) => {
            const { type, payload } = event.data || {};

            if (type === 'add_marker') {
                setMarkers((prev) => {
                    const updated = [...prev, payload];
                    localStorage.setItem('map_markers', JSON.stringify(updated));
                    return updated;
                });
            }

            if (type === 'delete_marker') {
                const { lat, lng } = payload;
                setMarkers((prev) => {
                    const updated = prev.filter(
                        (m) =>
                            m.lat.toFixed(4) !== lat.toFixed(4) ||
                            m.lng.toFixed(4) !== lng.toFixed(4)
                    );
                    localStorage.setItem('map_markers', JSON.stringify(updated));
                    return updated;
                });
            }

            if (type === 'request_marker_sync') {
                mapChannel.postMessage({
                    type: 'sync_marker_data',
                    payload: markers,
                });
            }

            if (type === 'sync_marker_data' && Array.isArray(payload)) {
                setMarkers(payload);
                localStorage.setItem('map_markers', JSON.stringify(payload));
            }
        };

        const syncTimeout = setTimeout(() => {
            mapChannel.postMessage({ type: 'request_marker_sync' });
        }, 500);

        return () => {
            clearTimeout(syncTimeout);
            mapChannel.close();
        };
    }, [markers]);

    const openInNewWindow = () => {
        const url = new URL(window.location.href);
        url.searchParams.set('mapOnly', 'true');
        sessionStorage.setItem('popup_open', 'true');

        const popup = window.open(
            url.toString(),
            'MapPopupWindow',
            'width=800,height=600,toolbar=no,menubar=no,scrollbars=no,resizable=yes'
        );

        const checkClosed = setInterval(() => {
            if (popup?.closed) {
                sessionStorage.removeItem('popup_open');
                clearInterval(checkClosed);
            }
        }, 500);
    };

    //Delay rendering if still loading from localStorage
    if (!loaded) return null;

    //Hide main map if popup already open
    if (!isMapOnly && isPopupOpen) return null;

    return (
        <div style={{ position: 'relative', padding: isMapOnly ? 0 : '1rem' }}>
            <div style={{ position: 'relative', height: isMapOnly ? '100vh' : '500px' }}>
                <MapContainer
                    center={[2.946003, 101.661825]}
                    zoom={13}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                    whenCreated={(mapInstance) => {
                        mapRef.current = mapInstance;
                    }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {markers.map((pos, i) => (
                        <Marker key={i} position={[pos.lat, pos.lng]} />
                    ))}
                </MapContainer>

                {!isMapOnly && (
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '1rem',
                            right: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            zIndex: 1000,
                        }}
                    >
                        <button
                            onClick={openInNewWindow}
                            style={{
                                padding: '0.6rem 1.2rem',
                                backgroundColor: '#10b981',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                            }}
                        >
                            Open Map in New Window
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}