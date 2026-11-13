import React from 'react';
import { Star, MapPin, Scale, Check, ChevronRight } from 'lucide-react';

export default function HotelCard({
  hotel,
  onSelect,
  isCompared,
  onToggleCompare,
  canAddCompare,
}) {
  const formattedPrice = hotel.startingPrice
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(hotel.startingPrice)
    : 'N/A';

  return (
    <div className="hotel-card">
      <div className="card-image-wrap">
        <img
          src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}
          alt={hotel.name}
          className="card-image"
          loading="lazy"
        />
        <div className="card-rating-badge">
          <Star size={14} fill="#fbbf24" color="#fbbf24" />
          <span>{hotel.rating ? hotel.rating.toFixed(1) : '4.5'}</span>
        </div>

        <div className="card-compare-checkbox">
          <button
            type="button"
            className={`compare-btn-toggle ${isCompared ? 'selected' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(hotel);
            }}
            disabled={!isCompared && !canAddCompare}
            title={
              isCompared
                ? 'Remove from comparison'
                : canAddCompare
                ? 'Compare this hotel'
                : 'Max 3 hotels can be compared'
            }
          >
            {isCompared ? <Check size={13} /> : <Scale size={13} />}
            <span>{isCompared ? 'Comparing' : 'Compare'}</span>
          </button>
        </div>
      </div>

      <div className="card-body">
        <div className="hotel-location-tag">
          <MapPin size={14} color="#64748b" />
          <span>{hotel.city || hotel.location}</span>
        </div>

        <h3 className="hotel-name">{hotel.name}</h3>

        <p className="hotel-desc">{hotel.description}</p>

        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="amenities-pills">
            {hotel.amenities.slice(0, 4).map((amenity, idx) => (
              <span key={idx} className="amenity-pill">
                {amenity}
              </span>
            ))}
            {hotel.amenities.length > 4 && (
              <span className="amenity-pill" style={{ color: '#2563eb' }}>
                +{hotel.amenities.length - 4} more
              </span>
            )}
          </div>
        )}

        <div className="card-footer">
          <div className="price-box">
            <span className="price-label">Starts from</span>
            <div>
              <span className="price-amount">{formattedPrice}</span>
              <span className="price-unit"> / night</span>
            </div>
          </div>

          <button
            className="btn-view-hotel"
            onClick={() => onSelect(hotel.id)}
          >
            <span>View Rooms</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
