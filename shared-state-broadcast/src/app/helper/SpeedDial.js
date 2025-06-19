'use client';

const speedDials = [
  'MERS 999',
  'PDRM',
  'KKM',
  'JBPM',
  'JPAM',
  'North RC',
  'East Coast RC',
  'Central A RC',
  'Central B RC',
  'Central C RC',
  'West Coast RC',
  'South RC',
];

export default function SpeedDialSection({ onSelect }) {
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
        marginBottom: '1rem',
      }}
    >
      <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.75rem' }}>
        Speed Dial
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.5rem',
        }}
      >
        {speedDials.map((label) => (
          <button
            key={label}
            onClick={() => onSelect?.(label)}
            style={{
              padding: '0.4rem 0.6rem',
              fontSize: '0.8rem',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = '#e5e7eb')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = '#f3f4f6')
            }
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}