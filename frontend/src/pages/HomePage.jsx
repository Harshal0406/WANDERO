import React, { useState, useEffect } from 'react';
import { hotelService } from '../services/hotelService';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import HotelDetailModal from '../components/HotelDetailModal';
import BookingModal from '../components/BookingModal';
import BookingSuccessModal from '../components/BookingSuccessModal';
import ComparisonModal from '../components/ComparisonModal';
import ComparisonBar from '../components/ComparisonBar';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';

export default function HomePage({
  onAddToast,
  onNavigateToBookings,
  comparedHotels,
  setComparedHotels,
  isComparisonOpen,
  setIsComparisonOpen,
}) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filters state
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [sortBy, setSortBy] = useState('FEATURED');

  // Selected hotel for detail modal
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [selectedHotelDetail, setSelectedHotelDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Selected room for booking modal
  const [bookingHotel, setBookingHotel] = useState(null);
  const [bookingRoom, setBookingRoom] = useState(null);

  // Confirmed booking for success voucher
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Compute nights
  let nights = 0;
  if (checkIn && checkOut && new Date(checkOut) > new Date(checkIn)) {
    const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn));
    nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Fetch hotels
  const fetchHotels = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await hotelService.getHotels({
        location: location.trim() || undefined,
        checkIn: checkIn || undefined,
        checkOut: checkOut || undefined,
      });
      setHotels(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to the WANDERO service. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleSearch = () => {
    fetchHotels();
  };

  const handleReset = () => {
    setLocation('');
    setCheckIn('');
    setCheckOut('');
    setSelectedCity('ALL');
    setSortBy('FEATURED');
    hotelService.getHotels().then(setHotels).catch(console.error);
  };

  // Open Hotel Detail Modal
  const handleOpenHotelDetails = async (id) => {
    setSelectedHotelId(id);
    setDetailLoading(true);
    try {
      const detail = await hotelService.getHotelById(id, { checkIn, checkOut });
      setSelectedHotelDetail(detail);
    } catch (err) {
      onAddToast('error', 'Error', err.message || 'Failed to load property details');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseHotelDetails = () => {
    setSelectedHotelId(null);
    setSelectedHotelDetail(null);
  };

  // Trigger Booking Modal
  const handleStartBooking = (hotel, room) => {
    setSelectedHotelId(null);
    setSelectedHotelDetail(null);
    setBookingHotel(hotel);
    setBookingRoom(room);
  };

  // On successful booking
  const handleBookingSuccess = (booking) => {
    setBookingHotel(null);
    setBookingRoom(null);
    setConfirmedBooking(booking);
    onAddToast('success', 'Reservation Confirmed!', `WANDERO booking voucher #${booking.bookingReference} issued.`);
    fetchHotels(); // Refresh availability
  };

  // Compare handlers
  const handleToggleCompare = (hotel) => {
    const isAlready = comparedHotels.some((h) => h.id === hotel.id);
    if (isAlready) {
      setComparedHotels((prev) => prev.filter((h) => h.id !== hotel.id));
      onAddToast('info', 'Comparison Updated', `Removed ${hotel.name} from comparison.`);
    } else {
      if (comparedHotels.length >= 3) {
        onAddToast('error', 'Limit Reached', 'You can compare a maximum of 3 hotels simultaneously.');
        return;
      }
      setComparedHotels((prev) => [...prev, hotel]);
      onAddToast('success', 'Added to Comparison', `${hotel.name} added. (${comparedHotels.length + 1}/3)`);
    }
  };

  const handleRemoveCompare = (id) => {
    setComparedHotels((prev) => prev.filter((h) => h.id !== id));
  };

  const handleClearCompare = () => {
    setComparedHotels([]);
  };

  // Filter & Sort
  const cities = ['ALL', 'Goa', 'Jaipur', 'Mumbai', 'Manali', 'Bengaluru', 'Kerala'];

  const filteredHotels = hotels
    .filter((h) => {
      if (selectedCity === 'ALL') return true;
      return h.city && h.city.toLowerCase() === selectedCity.toLowerCase();
    })
    .sort((a, b) => {
      if (sortBy === 'PRICE_LOW') return (a.startingPrice || 0) - (b.startingPrice || 0);
      if (sortBy === 'PRICE_HIGH') return (b.startingPrice || 0) - (a.startingPrice || 0);
      if (sortBy === 'RATING') return (b.rating || 0) - (a.rating || 0);
      return 0; // FEATURED
    });

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="max-w-7xl">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={14} />
              <span>WANDERO Curated Stays</span>
            </div>
            <h1 className="hero-title">
              Discover places. <span>Find your stay.</span>
            </h1>
            <p className="hero-subtitle">
              A modern hotel discovery, comparison and booking platform that makes finding and reserving the perfect stay simple.
            </p>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <div className="max-w-7xl">
        <SearchBar
          location={location}
          setLocation={setLocation}
          checkIn={checkIn}
          setCheckIn={setCheckIn}
          checkOut={checkOut}
          setCheckOut={setCheckOut}
          onSearch={handleSearch}
          onReset={handleReset}
          nights={nights}
        />

        {/* Filter Controls Bar */}
        <div className="controls-bar">
          <div className="results-count">
            Showing <span>{filteredHotels.length}</span> curated properties
          </div>

          <div className="filter-controls">
            {/* Quick City Filter */}
            <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: selectedCity === city ? '#0f172a' : '#e2e8f0',
                    background: selectedCity === city ? '#0f172a' : 'white',
                    color: selectedCity === city ? 'white' : '#475569',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {city === 'ALL' ? 'All Destinations' : city}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select-filter"
            >
              <option value="FEATURED">Featured</option>
              <option value="PRICE_LOW">Price: Low to High</option>
              <option value="PRICE_HIGH">Price: High to Low</option>
              <option value="RATING">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Loading / Error / Empty States */}
        {loading && (
          <div style={{ padding: '5rem 0', textAlign: 'center' }}>
            <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#0f172a' }} />
            <p style={{ color: '#64748b', fontWeight: 600 }}>Discovering available stays across WANDERO...</p>
          </div>
        )}

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '2rem', textAlign: 'center', margin: '2rem 0' }}>
            <AlertCircle size={32} color="#dc2626" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ color: '#991b1b', marginBottom: '0.5rem' }}>Unable to load properties</h3>
            <p style={{ color: '#b91c1c', fontSize: '0.95rem', marginBottom: '1.25rem' }}>{error}</p>
            <button className="btn-search" style={{ margin: '0 auto' }} onClick={fetchHotels}>
              Retry Connection
            </button>
          </div>
        )}

        {!loading && !error && filteredHotels.length === 0 && (
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '4rem 2rem', textAlign: 'center', margin: '2rem 0' }}>
            <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>No properties found matching your search</p>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Try searching another destination or resetting date filters to view all curated stays.
            </p>
            <button className="btn-search" style={{ margin: '0 auto' }} onClick={handleReset}>
              Reset Filters
            </button>
          </div>
        )}

        {/* Hotel Cards Grid */}
        {!loading && !error && filteredHotels.length > 0 && (
          <div className="hotels-grid">
            {filteredHotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onSelect={handleOpenHotelDetails}
                isCompared={comparedHotels.some((h) => h.id === hotel.id)}
                onToggleCompare={handleToggleCompare}
                canAddCompare={comparedHotels.length < 3}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Comparison Dock */}
      <ComparisonBar
        comparedHotels={comparedHotels}
        onOpenComparison={() => setIsComparisonOpen(true)}
        onRemoveHotel={handleRemoveCompare}
        onClearAll={handleClearCompare}
      />

      {/* Hotel Detail Modal */}
      {selectedHotelDetail && (
        <HotelDetailModal
          hotel={selectedHotelDetail}
          onClose={handleCloseHotelDetails}
          checkIn={checkIn}
          checkOut={checkOut}
          nights={nights}
          onBookRoom={handleStartBooking}
        />
      )}

      {/* Booking Form Modal */}
      {bookingHotel && bookingRoom && (
        <BookingModal
          hotel={bookingHotel}
          room={bookingRoom}
          checkIn={checkIn}
          checkOut={checkOut}
          onClose={() => {
            setBookingHotel(null);
            setBookingRoom(null);
          }}
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* Booking Success Confirmation Voucher */}
      {confirmedBooking && (
        <BookingSuccessModal
          booking={confirmedBooking}
          onClose={() => setConfirmedBooking(null)}
          onViewBookings={(email, ref) => onNavigateToBookings(email, ref)}
        />
      )}

      {/* Surprise Feature: Comparison Modal */}
      {isComparisonOpen && comparedHotels.length > 0 && (
        <ComparisonModal
          hotelIds={comparedHotels.map((h) => h.id)}
          checkIn={checkIn}
          checkOut={checkOut}
          nights={nights}
          onClose={() => setIsComparisonOpen(false)}
          onSelectHotel={(id) => {
            setIsComparisonOpen(false);
            handleOpenHotelDetails(id);
          }}
          onRemoveHotel={handleRemoveCompare}
        />
      )}
    </div>
  );
}
