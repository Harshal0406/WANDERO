import React from 'react';
import { CalendarCheck, Scale, Compass } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, comparisonCount, onOpenComparison }) {
  return (
    <header className="navbar">
      <div className="max-w-7xl nav-container">
        <div className="brand-logo" onClick={() => setActiveTab('explore')}>
          <span className="brand-text">WANDERO</span>
          <span className="brand-dot"></span>
          <span className="brand-tagline-nav">Discover places. Find your stay.</span>
        </div>

        <nav className="nav-menu">
          <button
            className={`nav-link ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
          >
            <Compass size={18} />
            <span>Explore Stays</span>
          </button>

          <button
            className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <CalendarCheck size={18} />
            <span>My Bookings</span>
          </button>

          {comparisonCount > 0 && (
            <button className="compare-badge-btn" onClick={onOpenComparison}>
              <Scale size={16} />
              <span>Compare</span>
              <span className="compare-pill">{comparisonCount}/3</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
