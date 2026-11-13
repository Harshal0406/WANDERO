import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, Calendar, Building, User, Bed, Tag, Mail } from 'lucide-react';

export default function BookingSuccessModal({ booking, onClose, onViewBookings }) {
  const [copied, setCopied] = useState(false);

  if (!booking) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(booking.bookingReference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  const pricePerNight = booking.pricePerNight || 0;
  const totalNights = booking.totalNights || 1;
  const baseAmount = pricePerNight * totalNights;
  const taxAmount = booking.taxAmount || 0;
  const totalAmount = booking.totalAmount || 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '600px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '2.5rem 2rem 1.5rem', background: 'linear-gradient(180deg, #ecfdf5 0%, #ffffff 100%)' }}>
          <div
            style={{
              width: '4rem',
              height: '4rem',
              background: '#059669',
              color: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 10px 20px rgba(5, 150, 105, 0.25)',
            }}
          >
            <CheckCircle2 size={36} />
          </div>

          <div style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.12em', color: '#047857', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            WANDERO Verified Stay
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#064e3b', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
            Reservation Confirmed!
          </h2>
          <p style={{ color: '#047857', fontSize: '0.95rem' }}>
            Your room has been reserved with real-time room lock protection.
          </p>

          {/* Reference Card Box */}
          <div
            style={{
              marginTop: '1.5rem',
              background: 'white',
              border: '2px dashed #059669',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 800, letterSpacing: '0.05em' }}>
                Booking Reference
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', letterSpacing: '0.06em', fontFamily: 'monospace' }}>
                {booking.bookingReference}
              </div>
            </div>

            <button
              onClick={handleCopy}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.65rem 1.1rem',
                background: copied ? '#059669' : '#0f172a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Voucher summary details - STRICTLY from persisted backend response */}
        <div style={{ padding: '1.5rem 2rem 2rem', textAlign: 'left' }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
            {/* Hotel info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <Building size={18} color="#0f172a" />
              <div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem' }}>{booking.hotelName}</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{booking.hotelAddress || booking.hotelLocation}</div>
              </div>
            </div>

            {/* Room info from persisted booking */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
              <Bed size={18} color="#2563eb" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                  {booking.roomType} (Room #{booking.roomNumber})
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', gap: '0.75rem', marginTop: '0.15rem' }}>
                  <span>Room ID: #{booking.roomId}</span>
                  <span>•</span>
                  <span style={{ fontWeight: 700, color: '#2563eb' }}>{formatCurrency(pricePerNight)} / night</span>
                </div>
              </div>
            </div>

            {/* Dates & Guest */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', margin: '0.75rem 0' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <Calendar size={16} color="#64748b" style={{ marginTop: '0.2rem' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Stay Duration</div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    {booking.checkInDate} to {booking.checkOutDate} ({totalNights} {totalNights === 1 ? 'night' : 'nights'})
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <User size={16} color="#64748b" style={{ marginTop: '0.2rem' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Primary Guest</div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{booking.customerName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{booking.customerEmail}</div>
                </div>
              </div>
            </div>

            {/* Pricing breakdown strictly from DB values */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#475569', marginBottom: '0.35rem' }}>
                <span>Base Stay ({formatCurrency(pricePerNight)} × {totalNights} {totalNights === 1 ? 'night' : 'nights'})</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(baseAmount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#475569', marginBottom: '0.5rem' }}>
                <span>Taxes & Service Fees (12% GST)</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(taxAmount)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '0.6rem',
                  borderTop: '1px dashed #cbd5e1',
                  fontSize: '1rem',
                  fontWeight: 700,
                }}
              >
                <span>Total Paid</span>
                <span style={{ color: '#059669', fontSize: '1.25rem', fontWeight: 800 }}>{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.75rem' }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Done
            </button>
            <button
              onClick={() => {
                onClose();
                if (onViewBookings) onViewBookings(booking.customerEmail, booking.bookingReference);
              }}
              className="btn-search"
              style={{ flex: 1 }}
            >
              View in My Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
