import React from 'react';
import { Scale, X, ArrowRight } from 'lucide-react';

export default function ComparisonBar({
  comparedHotels,
  onOpenComparison,
  onRemoveHotel,
  onClearAll,
}) {
  if (!comparedHotels || comparedHotels.length === 0) return null;

  return (
    <div className="comparison-dock">
      <div className="dock-thumbnails">
        {comparedHotels.map((hotel) => (
          <div key={hotel.id} style={{ position: 'relative' }}>
            <img
              src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=100&q=80'}
              alt={hotel.name}
              className="dock-thumb"
              title={hotel.name}
            />
            <button
              onClick={() => onRemoveHotel(hotel.id)}
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Remove hotel"
            >
              <X size={10} />
            </button>
          </div>
        ))}
      </div>

      <div className="dock-info">
        <span className="dock-title">
          {comparedHotels.length} of 3 Hotels Selected
        </span>
        <span className="dock-subtitle">
          {comparedHotels.length === 1 ? 'Add at least 1 more hotel to compare side-by-side' : 'Ready for side-by-side comparison'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
        <button
          onClick={onClearAll}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            fontSize: '0.8rem',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Clear
        </button>

        <button
          onClick={onOpenComparison}
          className="btn-search"
          style={{
            height: '2.5rem',
            padding: '0 1.25rem',
            fontSize: '0.85rem',
            borderRadius: '9999px',
          }}
        >
          <Scale size={15} />
          <span>Compare Now</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
