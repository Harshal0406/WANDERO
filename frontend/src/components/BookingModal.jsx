import React, { useState } from 'react';
import { X, Calendar, User, Mail, Phone, FileText, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { bookingService } from '../services/bookingService';

export default function BookingModal({
  hotel,
  room,
  checkIn: initialCheckIn,
  checkOut: initialCheckOut,
  onClose,
  onSuccess,
}) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const [checkIn, setCheckIn] = useState(initialCheckIn || '');
  const [checkOut, setCheckOut] = useState(initialCheckOut || '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate nights safely using date components
  let nights = 0;
  if (checkIn && checkOut) {
    const partsIn = checkIn.split('-').map(Number);
    const partsOut = checkOut.split('-').map(Number);
    if (partsIn.length === 3 && partsOut.length === 3) {
      const dIn = new Date(partsIn[0], partsIn[1] - 1, partsIn[2]);
      const dOut = new Date(partsOut[0], partsOut[1] - 1, partsOut[2]);
      const diffMs = dOut.getTime() - dIn.getTime();
      if (diffMs > 0) {
        nights = Math.round(diffMs / (1000 * 60 * 60 * 24));
      }
    }
  }

  const hasValidDates = Boolean(checkIn && checkOut && nights > 0);
  const pricePerNight = room?.pricePerNight || 0;
  // ISSUE 2 FIX: Never calculate totals when nights <= 0
  const subtotal = hasValidDates ? pricePerNight * nights : 0;
  const taxAmount = hasValidDates ? Math.round(subtotal * 0.12 * 100) / 100 : 0;
  const totalAmount = hasValidDates ? Math.round((subtotal + taxAmount) * 100) / 100 : 0;

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const getMinCheckOutDate = () => {
    if (!checkIn) return todayStr;
    const parts = checkIn.split('-').map(Number);
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      d.setDate(d.getDate() + 1);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
    return checkIn;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!room || !room.id) {
      setError('Room details are missing. Please re-select a room.');
      return;
    }

    if (!hasValidDates) {
      setError('Please select valid check-in and check-out dates (minimum 1 night required).');
      return;
    }

    if (!customerName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!customerEmail.trim() || !/\S+@\S+\.\S+/.test(customerEmail)) {
      setError('Please provide a valid email address for your booking reference.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        roomId: room.id,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim() || null,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        specialRequests: specialRequests.trim() || null,
      };

      const response = await bookingService.createBooking(payload);
      onSuccess(response);
    } catch (err) {
      setError(err.message || 'Booking failed. This room might already have been reserved for these dates.');
    } finally {
      setLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div style={{ padding: '2rem 2rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
            <ShieldCheck size={18} />
            WANDERO Verified Reservation
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>Reserve Your Stay</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            {hotel.name} • {room.roomType} (#{room.roomNumber})
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem 2rem 2rem' }}>
          {error && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                color: '#b91c1c',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                marginBottom: '1.25rem',
              }}
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Date Selection */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>
                Check-In Date *
              </label>
              <input
                type="date"
                min={todayStr}
                value={checkIn}
                onChange={(e) => {
                  const newCheckIn = e.target.value;
                  setCheckIn(newCheckIn);
                  if (checkOut && checkOut <= newCheckIn) {
                    setCheckOut('');
                  }
                }}
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  background: '#f8fafc',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>
                Check-Out Date *
              </label>
              <input
                type="date"
                min={getMinCheckOutDate()}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  background: '#f8fafc',
                }}
              />
            </div>
          </div>

          {/* Guest Name & Email */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>
              Guest Full Name *
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.65rem 0.75rem' }}>
              <User size={16} color="#64748b" />
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.95rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>
                Email Address * (for booking voucher)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.65rem 0.75rem' }}>
                <Mail size={16} color="#64748b" />
                <input
                  type="email"
                  placeholder="e.g. guest@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                  style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.95rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>
                Phone Number (optional)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.65rem 0.75rem' }}>
                <Phone size={16} color="#64748b" />
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.95rem' }}
                />
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>
              Special Requests (optional)
            </label>
            <textarea
              placeholder="e.g. Quiet room requested, early check-in preference, airport transfer assistance"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={2}
              style={{
                width: '100%',
                padding: '0.65rem 0.75rem',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.9rem',
                background: '#f8fafc',
                resize: 'none',
              }}
            />
          </div>

          {/* Booking Summary & Calculation Breakdown */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                Payment & Price Breakdown
              </h4>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Room ID: #{room?.id}
              </span>
            </div>

            {hasValidDates ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem', color: '#475569' }}>
                  <span>
                    {formatCurrency(pricePerNight)} × {nights} {nights === 1 ? 'night' : 'nights'}
                  </span>
                  <span style={{ fontWeight: 600 }}>{formatCurrency(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.75rem', color: '#475569' }}>
                  <span>Taxes & Service Fees (12% GST)</span>
                  <span style={{ fontWeight: 600 }}>{formatCurrency(taxAmount)}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    paddingTop: '0.75rem',
                    borderTop: '1px solid #e2e8f0',
                    color: '#0f172a',
                  }}
                >
                  <span>Total Booking Amount</span>
                  <span style={{ color: '#2563eb' }}>{formatCurrency(totalAmount)}</span>
                </div>
              </>
            ) : (
              <div
                style={{
                  background: '#f1f5f9',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '8px',
                  padding: '1.1rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                  Select your dates to see the total
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  Standard rate: <strong style={{ color: '#0f172a' }}>{formatCurrency(pricePerNight)}</strong> / night • Taxes calculated dynamically at 12% GST
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1.25rem',
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-search"
              style={{
                minWidth: '180px',
                opacity: (loading || !hasValidDates) ? 0.6 : 1,
                cursor: (loading || !hasValidDates) ? 'not-allowed' : 'pointer',
              }}
              disabled={loading || !hasValidDates}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Reserving Room...</span>
                </>
              ) : !hasValidDates ? (
                <span>Select Dates to Reserve</span>
              ) : (
                <span>Confirm Booking</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
