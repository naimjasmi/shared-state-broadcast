'use client';

export default function DispatchList({ dispatches, setDispatches }) {
  const statusColor = {
    Pending: '#facc15',
    'On Route': '#22c55e',
    Delivered: '#3b82f6',
  };

  const textColor = '#1f2937';

  const deleteDispatch = (id) => {
    const dispatchToDelete = dispatches.find((d) => d.id === id);

    if (dispatchToDelete) {
      const matches = dispatchToDelete.location.match(/Lat:\s*(-?\d+\.\d+),\s*Lng:\s*(-?\d+\.\d+)/);
      if (matches) {
        const lat = parseFloat(matches[1]);
        const lng = parseFloat(matches[2]);

        const channel = new BroadcastChannel('map_channel');
        channel.postMessage({
          type: 'delete_marker',
          payload: { lat, lng },
        });
        channel.close();
      }
    }

    setDispatches((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div
      style={{
        flex: '1 1 350px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        color: textColor,
      }}
    >
      <h2 style={{ fontSize: '1.3rem', fontWeight: '600' }}>Active Dispatches</h2>

      {dispatches.length === 0 && (
        <p style={{ fontStyle: 'italic', color: '#6b7280', fontSize: '0.9rem' }}>
          No dispatches yet. Submit the form to create one.
        </p>
      )}

      <div
        style={{
          maxHeight: '530px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          paddingRight: '4px',
        }}
      >
        {dispatches.map((dispatch) => (
          <div
            key={dispatch.id}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              padding: '0.75rem',
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'pointer',
              color: textColor,
              fontSize: '0.85rem',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.04)';
            }}
          >
            <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>
              {dispatch.id}
            </div>

            {dispatch.alertNo && <div><strong>Alert No:</strong> {dispatch.alertNo}</div>}
            {dispatch.timestamp && <div><strong>Timestamp:</strong> {dispatch.timestamp}</div>}
            {dispatch.driver && <div><strong>Driver:</strong> {dispatch.driver}</div>}
            {dispatch.callerName && <div><strong>Caller Name:</strong> {dispatch.callerName}</div>}
            {dispatch.phone && <div><strong>Phone:</strong> {dispatch.phone}</div>}
            {dispatch.location && <div><strong>Location:</strong> {dispatch.location}</div>}
            {dispatch.locationCode && <div><strong>Location Code:</strong> {dispatch.locationCode}</div>}
            {dispatch.district && <div><strong>District:</strong> {dispatch.district}</div>}
            {dispatch.state && <div><strong>State:</strong> {dispatch.state}</div>}
            {dispatch.locationNote && <div><strong>Location Note:</strong> {dispatch.locationNote}</div>}
            {dispatch.alertNote && <div><strong>Alert Note:</strong> {dispatch.alertNote}</div>}
            {dispatch.eta && <div><strong>ETA:</strong> {dispatch.eta}</div>}

            <div>
              <strong>Status:</strong>{' '}
              <span
                style={{
                  backgroundColor: statusColor[dispatch.status] || '#9ca3af',
                  color: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                }}
              >
                {dispatch.status}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteDispatch(dispatch.id);
              }}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                backgroundColor: '#ef4444',
                border: 'none',
                color: '#fff',
                borderRadius: '4px',
                fontSize: '0.75rem',
                padding: '2px 6px',
                cursor: 'pointer',
              }}
              title="Delete"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}