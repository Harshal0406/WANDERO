import React from 'react';
import { MapPin, Calendar, Search, RotateCcw } from 'lucide-react';

export default function SearchBar({
  location,
  setLocation,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  onSearch,
  onReset,
  nights,
}) {
  const todayStr = new Date().toISOString().split('T')[0];

  const handleCheckInChange = (e) => {
    const newCheckIn = e.target.value;
    setCheckIn(newCheckIn);
    if (checkOut && newCheckIn >= checkOut) {
      // Auto adjust checkout to next day
      const nextDay = new Date(newCheckIn);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOut(nextDay.toISOString().split('T')[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="search-wrapper">
      <form onSubmit={handleSubmit} className="search-box">
        {/* Location input */}
        <div className="search-field">
          <label>
            <MapPin size={14} color="#2563eb" />
            Where are you going?
          </label>
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Search by city, hotel or state (e.g. Goa, Jaipur)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Check-in date */}
        <div className="search-field">
          <label>
            <Calendar size={14} color="#2563eb" />
            Check-In
          </label>
          <div className="search-input-group">
            <input
              type="date"
              min={todayStr}
              value={checkIn}
              onChange={handleCheckInChange}
            />
          </div>
        </div>

        {/* Check-out date */}
        <div className="search-field">
          <label>
            <Calendar size={14} color="#2563eb" />
            Check-Out
          </label>
          <div className="search-input-group">
            <input
              type="date"
              min={checkIn || todayStr}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="search-actions">
          <button type="submit" className="btn-search">
            <Search size={18} />
            <span>Search</span>
          </button>
          {(location || checkIn || checkOut) && (
            <button type="button" onClick={onReset} className="btn-reset" title="Reset Search">
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      </form>

      {nights > 0 && (
        <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
          <span className="stay-summary-pill">
            <Calendar size={14} />
            {nights} {nights === 1 ? 'night' : 'nights'} stay selected ({checkIn} to {checkOut})
          </span>
        </div>
      )}
    </div>
  );
}
