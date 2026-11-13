import React from 'react';
import { X, Star, MapPin, Users, Bed, Maximize2, CheckCircle2, XCircle, Calendar, Sparkles } from 'lucide-react';

export default function HotelDetailModal({
  hotel,
  onClose,
  checkIn,
  checkOut,
  nights,
  onBookRoom,
}) {
  if (!hotel) return null;

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Hero Banner */}
        <div className="modal-hero">
          <img
            src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'}
            alt={hotel.name}
          />
          <div className="modal-hero-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="card-rating-badge" style={{ position: 'static' }}>
                <Star size={14} fill="#fbbf24" color="#fbbf24" />
                <span>{hotel.rating ? hotel.rating.toFixed(2) : '4.8'}</span>
              </span>
              <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>• WANDERO Verified Stay</span>
            </div>
            <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '0.4rem' }}>{hotel.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem', opacity: 0.95 }}>
              <MapPin size={16} />
              <span>{hotel.address || hotel.location}</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* About Hotel */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>About this Property</h4>
            <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem' }}>{hotel.description}</p>
          </div>

          {/* Hotel Amenities */}
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Popular Amenities</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {hotel.amenities.map((item, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '0.4rem 0.85rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#334155',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <Sparkles size={14} color="#2563eb" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Selected Stay Information */}
          <div
            style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Calendar size={22} color="#2563eb" />
              <div>
                <div style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '0.95rem' }}>
                  {checkIn && checkOut
                    ? `Stay: ${checkIn} to ${checkOut} (${nights} ${nights === 1 ? 'night' : 'nights'})`
                    : 'Select dates to check live room availability'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#3b82f6' }}>
                  {nights > 0 ? 'Live room pricing & availability calculated for your stay' : 'Showing standard nightly rates'}
                </div>
              </div>
            </div>
          </div>

          {/* Available Rooms Section */}
          <h3 className="rooms-section-title">Available Rooms & Suites</h3>
          <div className="rooms-list">
            {hotel.rooms && hotel.rooms.length > 0 ? (
              hotel.rooms.map((room) => {
                const isAvailable = room.isAvailable !== false;
                const pricePerNight = room.pricePerNight || 0;
                const totalStay = room.totalStayPrice || pricePerNight * (nights || 1) * 1.12;

                return (
                  <div key={room.id} className="room-card">
                    {/* Room Image */}
                    <div className="room-thumb-wrap">
                      <img
                        src={room.imageUrl || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80'}
                        alt={room.roomType}
                        className="room-thumb"
                      />
                    </div>

                    {/* Room Info */}
                    <div className="room-info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', background: '#f1f5f9', padding: '0.15rem 0.5rem', borderRadus: '4px' }}>
                          Room #{room.roomNumber}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>{room.roomType}</h4>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.35rem 0 0.75rem' }}>{room.description}</p>

                      <div className="room-meta">
                        {room.bedType && (
                          <div className="room-meta-item">
                            <Bed size={15} color="#64748b" />
                            <span>{room.bedType}</span>
                          </div>
                        )}
                        {room.capacity && (
                          <div className="room-meta-item">
                            <Users size={15} color="#64748b" />
                            <span>Up to {room.capacity} Guests</span>
                          </div>
                        )}
                        {room.roomSizeSqFt && (
                          <div className="room-meta-item">
                            <Maximize2 size={15} color="#64748b" />
                            <span>{room.roomSizeSqFt} sq ft</span>
                          </div>
                        )}
                      </div>

                      {/* Room Amenities */}
                      {room.amenities && room.amenities.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: 'auto' }}>
                          {room.amenities.map((am, i) => (
                            <span key={i} className="amenity-pill">
                              {am}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Room Pricing & Action */}
                    <div className="room-action-col">
                      <span className={`status-badge ${isAvailable ? 'available' : 'unavailable'}`}>
                        {isAvailable ? '✓ Available' : '✕ Booked for dates'}
                      </span>

                      <div style={{ textAlign: 'right', margin: '0.5rem 0 0.75rem' }}>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Rate per night</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                          {formatCurrency(pricePerNight)}
                        </div>
                        {nights > 0 && (
                          <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600, marginTop: '0.2rem' }}>
                            Total: {formatCurrency(totalStay)}
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 400 }}>
                              ({nights} {nights === 1 ? 'night' : 'nights'} incl. 12% GST)
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        className="btn-search"
                        style={{
                          height: '2.5rem',
                          padding: '0 1.25rem',
                          fontSize: '0.85rem',
                          opacity: isAvailable ? 1 : 0.4,
                          cursor: isAvailable ? 'pointer' : 'not-allowed',
                          width: '100%',
                        }}
                        disabled={!isAvailable}
                        onClick={() => onBookRoom(hotel, room)}
                      >
                        {isAvailable ? 'Book This Room' : 'Sold Out'}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ color: '#64748b' }}>No rooms currently listed for this hotel.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
