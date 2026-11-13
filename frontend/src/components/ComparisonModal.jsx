import React, { useState, useEffect } from 'react';
import { X, Scale, Star, MapPin, Check, Minus, Sparkles, Trophy, Loader2, ArrowRight } from 'lucide-react';
import { hotelService } from '../services/hotelService';

export default function ComparisonModal({
  hotelIds,
  checkIn,
  checkOut,
  nights,
  onClose,
  onSelectHotel,
  onRemoveHotel,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!hotelIds || hotelIds.length === 0) return;

    const fetchComparison = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await hotelService.compareHotels(hotelIds, { checkIn, checkOut });
        setData(res);
      } catch (err) {
        setError(err.message || 'Failed to load comparison data');
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [hotelIds, checkIn, checkOut]);

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '1050px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ padding: '2rem 2.5rem 1.25rem', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
            <Scale size={18} />
            WANDERO Stay Comparison Engine
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a' }}>Compare Selected Stays</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Compare price, location, amenities, and total stay cost side-by-side
            {nights > 0 ? ` for ${nights} ${nights === 1 ? 'night' : 'nights'} stay (${checkIn} to ${checkOut})` : ''}
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem 2.5rem 2.5rem' }}>
          {loading && (
            <div style={{ padding: '4rem 0', textAlign: 'center' }}>
              <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#2563eb' }} />
              <p style={{ color: '#64748b', fontWeight: 500 }}>Generating side-by-side comparison matrix...</p>
            </div>
          )}

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: '8px', color: '#b91c1c' }}>
              {error}
            </div>
          )}

          {!loading && !error && data && data.hotels && (
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th style={{ verticalAlign: 'middle', fontSize: '0.9rem', color: '#475569' }}>
                      Comparison Feature
                    </th>
                    {data.hotels.map((hotel) => {
                      const isCheapest = hotel.id === data.lowestPriceHotelId;
                      const isHighestRated = hotel.id === data.highestRatedHotelId;

                      return (
                        <th key={hotel.id} style={{ minWidth: '240px', background: 'white' }}>
                          <div style={{ position: 'relative', height: '140px', borderRadius: '8px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                            <img
                              src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'}
                              alt={hotel.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <button
                              onClick={() => onRemoveHotel(hotel.id)}
                              style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                background: 'rgba(15, 23, 42, 0.7)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '22px',
                                height: '22px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                              }}
                              title="Remove hotel from comparison"
                            >
                              <X size={12} />
                            </button>
                            {isCheapest && (
                              <span
                                style={{
                                  position: 'absolute',
                                  bottom: '8px',
                                  left: '8px',
                                  background: '#10b981',
                                  color: 'white',
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  padding: '0.2rem 0.5rem',
                                  borderRadius: '9999px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                }}
                              >
                                <Sparkles size={11} /> Best Price
                              </span>
                            )}
                            {isHighestRated && (
                              <span
                                style={{
                                  position: 'absolute',
                                  top: '8px',
                                  left: '8px',
                                  background: '#f59e0b',
                                  color: 'white',
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  padding: '0.2rem 0.5rem',
                                  borderRadius: '9999px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                }}
                              >
                                <Trophy size={11} /> Top Rated
                              </span>
                            )}
                          </div>

                          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', marginBottom: '0.25rem' }}>
                            {hotel.name}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                            <MapPin size={12} />
                            <span>{hotel.city}</span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody>
                  {/* Rating */}
                  <tr>
                    <td>Guest Rating</td>
                    {data.hotels.map((hotel) => (
                      <td key={hotel.id}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#b45309' }}>
                          <Star size={16} fill="#fbbf24" color="#fbbf24" />
                          <span>{hotel.rating.toFixed(2)} / 5.0</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Starting Price */}
                  <tr>
                    <td>Starting Nightly Rate</td>
                    {data.hotels.map((hotel) => (
                      <td key={hotel.id}>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#2563eb' }}>
                          {formatCurrency(hotel.startingPrice)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>per night</div>
                      </td>
                    ))}
                  </tr>

                  {/* Total Stay Cost (Surprise Feature Requirement) */}
                  <tr style={{ background: '#f8fafc' }}>
                    <td>
                      <div>Total Stay Cost</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 400 }}>
                        ({data.nights} {data.nights === 1 ? 'night' : 'nights'} + 12% GST)
                      </div>
                    </td>
                    {data.hotels.map((hotel) => (
                      <td key={hotel.id}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>
                          {formatCurrency(hotel.estimatedTotalStayCost)}
                        </div>
                        {hotel.id === data.lowestPriceHotelId && (
                          <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>
                            ★ Most Affordable Stay
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Location Address */}
                  <tr>
                    <td>Full Location</td>
                    {data.hotels.map((hotel) => (
                      <td key={hotel.id} style={{ fontSize: '0.85rem', color: '#475569' }}>
                        {hotel.address}
                      </td>
                    ))}
                  </tr>

                  {/* Room Options */}
                  <tr>
                    <td>Available Room Options</td>
                    {data.hotels.map((hotel) => (
                      <td key={hotel.id} style={{ fontSize: '0.85rem' }}>
                        {hotel.rooms && hotel.rooms.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            {hotel.rooms.map((r) => (
                              <div key={r.id} style={{ background: '#f1f5f9', padding: '0.35rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                                <div style={{ fontWeight: 600 }}>{r.roomType}</div>
                                <div style={{ color: '#2563eb' }}>{formatCurrency(r.pricePerNight)}/nt</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>None listed</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Amenities Matrix Rows */}
                  {Array.from(data.allAmenities || []).map((amenity) => (
                    <tr key={amenity}>
                      <td>{amenity}</td>
                      {data.hotels.map((hotel) => {
                        const hasAmenity = hotel.amenities && hotel.amenities.includes(amenity);
                        return (
                          <td key={hotel.id}>
                            {hasAmenity ? (
                              <span style={{ color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                                <Check size={18} /> Included
                              </span>
                            ) : (
                              <span style={{ color: '#cbd5e1' }}>
                                <Minus size={18} />
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Booking / Details Action */}
                  <tr>
                    <td>Direct Action</td>
                    {data.hotels.map((hotel) => (
                      <td key={hotel.id}>
                        <button
                          className="btn-search"
                          style={{
                            width: '100%',
                            height: '2.5rem',
                            fontSize: '0.85rem',
                            borderRadius: '8px',
                          }}
                          onClick={() => {
                            onClose();
                            onSelectHotel(hotel.id);
                          }}
                        >
                          <span>Select & Book</span>
                          <ArrowRight size={14} />
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
