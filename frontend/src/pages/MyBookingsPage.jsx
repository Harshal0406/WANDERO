import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import { Search, Calendar, Building, AlertTriangle, XCircle, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function MyBookingsPage({ initialEmail, initialReference, onAddToast, onBackToExplore }) {
  const [reference, setReference] = useState(initialReference || '');
  const [email, setEmail] = useState(initialEmail || '');

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);

  // Cancellation modal state
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Auto-search if initial parameters provided
  useEffect(() => {
    if (initialReference && initialEmail) {
      handleLookup();
    } else if (initialEmail) {
      handleLookupAllByEmail();
    }
  }, [initialReference, initialEmail]);

  const handleLookup = async (e) => {
    if (e) e.preventDefault();
    setError(null);

    if (!reference.trim() || !email.trim()) {
      setError('Please provide both Booking Reference (e.g. WD-XXXXXX) and your email address.');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const result = await bookingService.lookupBooking(reference.trim(), email.trim());
      setBookings([result]);
    } catch (err) {
      setBookings([]);
      setError(err.message || 'No reservation found matching the provided reference and email.');
    } finally {
      setLoading(false);
    }
  };

  const handleLookupAllByEmail = async () => {
    setError(null);
    if (!email.trim()) {
      setError('Please provide your email address to retrieve all your reservations.');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const results = await bookingService.getMyBookings(email.trim());
      setBookings(results);
      if (results.length === 0) {
        setError('No reservations found associated with this email address.');
      }
    } catch (err) {
      setBookings([]);
      setError(err.message || 'Failed to retrieve bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancellingBooking) return;
    setCancelLoading(true);

    try {
      const updated = await bookingService.cancelBooking(
        cancellingBooking.bookingReference,
        cancellingBooking.customerEmail
      );

      // Update state
      setBookings((prev) =>
        prev.map((b) => (b.bookingReference === updated.bookingReference ? updated : b))
      );
      setCancellingBooking(null);
      onAddToast('success', 'Reservation Cancelled', `Booking #${updated.bookingReference} has been cancelled. Room availability released.`);
    } catch (err) {
      onAddToast('error', 'Cancellation Failed', err.message || 'Failed to cancel reservation.');
    } finally {
      setCancelLoading(false);
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  return (
    <div className="max-w-7xl" style={{ paddingTop: '2.5rem' }}>
      <button
        onClick={onBackToExplore}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'none',
          border: 'none',
          color: '#0f172a',
          fontWeight: 700,
          cursor: 'pointer',
          marginBottom: '1.5rem',
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Explore Stays</span>
      </button>

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
          <ShieldCheck size={16} />
          WANDERO Guest Services
        </div>
        <h1 style={{ fontSize: '2.35rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
          Manage Your Bookings
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>
          Look up reservations, view stay details, and cancel bookings to release room availability.
        </p>
      </div>

      {/* Lookup Card */}
      <div
        style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          marginBottom: '3rem',
        }}
      >
        <form onSubmit={handleLookup}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr auto auto', gap: '1rem', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                Booking Reference #
              </label>
              <input
                type="text"
                placeholder="e.g. WD-8TWP5C"
                value={reference}
                onChange={(e) => setReference(e.target.value.toUpperCase())}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontFamily: 'monospace',
                  letterSpacing: '0.05em',
                  fontWeight: 700,
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                Customer Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. guest@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                }}
              />
            </div>

            <button type="submit" className="btn-search" style={{ height: '2.85rem' }} disabled={loading}>
              <Search size={16} />
              <span>Lookup Reference</span>
            </button>

            <button
              type="button"
              onClick={handleLookupAllByEmail}
              className="btn-reset"
              style={{ height: '2.85rem' }}
              disabled={loading || !email.trim()}
              title="Retrieve all bookings under this email"
            >
              <span>Find All by Email</span>
            </button>
          </div>
        </form>

        {error && (
          <div style={{ marginTop: '1.25rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.75rem 1rem', color: '#b91c1c', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}
      </div>

      {/* Bookings List Section */}
      {loading && (
        <div style={{ padding: '3rem 0', textAlign: 'center' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#0f172a' }} />
          <p style={{ color: '#64748b' }}>Searching for reservations...</p>
        </div>
      )}

      {!loading && searched && bookings.length > 0 && (
        <div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.25rem', color: '#0f172a' }}>
            Found Reservations ({bookings.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {bookings.map((b) => {
              const isConfirmed = b.status === 'CONFIRMED';

              return (
                <div
                  key={b.id || b.bookingReference}
                  style={{
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  {/* Top Bar with Reference & Status */}
                  <div
                    style={{
                      background: isConfirmed ? '#f0fdf4' : '#fff1f2',
                      borderBottom: '1px solid #e2e8f0',
                      padding: '1rem 1.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        WANDERO Reference:
                      </span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.25rem', color: '#0f172a' }}>
                        {b.bookingReference}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span className={`status-badge ${isConfirmed ? 'confirmed' : 'cancelled'}`}>
                        {isConfirmed ? '✓ CONFIRMED' : '✕ CANCELLED'}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '1.75rem', display: 'grid', gridTemplateColumns: '1.5fr 1fr auto', gap: '2rem', alignItems: 'center' }}>
                    {/* Hotel & Room info */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0f172a', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                        <Building size={16} />
                        {b.hotelName}
                      </div>
                      <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
                        {b.roomType} (Room #{b.roomNumber})
                      </h4>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.4rem' }}>
                        <span>Room ID: #{b.roomId}</span>
                        <span>•</span>
                        <span style={{ fontWeight: 700, color: '#2563eb' }}>{formatCurrency(b.pricePerNight)} / night</span>
                      </div>
                      <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{b.hotelAddress || b.hotelLocation}</p>

                      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Check-In</div>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{b.checkInDate}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Check-Out</div>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{b.checkOutDate}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Duration</div>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                            {b.totalNights} {b.totalNights === 1 ? 'night' : 'nights'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Guest info & Amount */}
                    <div style={{ borderLeft: '1px solid #f1f5f9', paddingLeft: '1.5rem' }}>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: 600 }}>Guest Details</div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>{b.customerName}</div>
                      <div style={{ fontSize: '0.85rem', color: '#475569' }}>{b.customerEmail}</div>
                      {b.customerPhone && <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{b.customerPhone}</div>}

                      <div style={{ marginTop: '1rem' }}>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Total Paid</div>
                        <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#059669' }}>
                          {formatCurrency(b.totalAmount)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
                          Base: {formatCurrency((b.pricePerNight || 0) * (b.totalNights || 1))} + {formatCurrency(b.taxAmount)} GST (12%)
                        </div>
                      </div>
                    </div>

                    {/* Action column */}
                    <div style={{ textAlign: 'right' }}>
                      {isConfirmed ? (
                        <button
                          onClick={() => setCancellingBooking(b)}
                          style={{
                            padding: '0.65rem 1.25rem',
                            background: '#ffe4e6',
                            color: '#e11d48',
                            border: '1px solid #fecdd3',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            transition: 'all 0.18s ease',
                          }}
                        >
                          <XCircle size={16} />
                          <span>Cancel Booking</span>
                        </button>
                      ) : (
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
                          Cancelled on {b.cancelledAt ? new Date(b.cancelledAt).toLocaleDateString() : 'N/A'}.<br />
                          Room has been released.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cancellation Confirmation Dialog */}
      {cancellingBooking && (
        <div className="modal-overlay" onClick={() => setCancellingBooking(null)}>
          <div className="modal-card" style={{ maxWidth: '480px', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                width: '3.5rem',
                height: '3.5rem',
                background: '#ffe4e6',
                color: '#e11d48',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              <AlertTriangle size={28} />
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, textAlign: 'center', color: '#0f172a', marginBottom: '0.5rem' }}>
              Cancel Reservation?
            </h3>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Are you sure you want to cancel booking <strong>#{cancellingBooking.bookingReference}</strong> for{' '}
              <strong>{cancellingBooking.hotelName}</strong>? This action will immediately release the room availability back to WANDERO.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setCancellingBooking(null)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                disabled={cancelLoading}
              >
                Keep Booking
              </button>

              <button
                type="button"
                onClick={handleConfirmCancel}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#e11d48',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                }}
                disabled={cancelLoading}
              >
                {cancelLoading ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                <span>Confirm Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
