'use client';

const reasons = [
    'PDRM',
    'Private',
    'Mental(M)',
    'Mental(F)',
    'JBPM',
    'Obscene(M)',
    'Obscene(F)',
    'KKM',
    'For Fun(M)',
    'For Fun(F)',
    'JPAM',
    'For Fun(C)',
    'Silent',
    'APMM',
    'Drop Call',
];

export default function HangupReasonSection({ onSelect }) {
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
                Hangup Reason
            </h3>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.5rem',
                }}
            >
                {reasons.map((reason) => (
                    <button
                        key={reason}
                        onClick={() => onSelect?.(reason)}
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
                        {reason}
                    </button>
                ))}
            </div>
        </div>
    );
}