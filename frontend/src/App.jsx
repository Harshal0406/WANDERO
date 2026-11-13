import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MyBookingsPage from './pages/MyBookingsPage';
import Toast from './components/Toast';

export default function App() {
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'bookings'
  const [toasts, setToasts] = useState([]);

  // Comparison State (global so user can open comparison anywhere)
  const [comparedHotels, setComparedHotels] = useState([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // My bookings prefilled state
  const [bookingLookupParams, setBookingLookupParams] = useState({ email: '', reference: '' });

  const addToast = (type, title, message) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleNavigateToBookings = (email = '', reference = '') => {
    setBookingLookupParams({ email, reference });
    setActiveTab('bookings');
  };

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        comparisonCount={comparedHotels.length}
        onOpenComparison={() => setIsComparisonOpen(true)}
      />

      <main className="main-content">
        {activeTab === 'explore' ? (
          <HomePage
            onAddToast={addToast}
            onNavigateToBookings={handleNavigateToBookings}
            comparedHotels={comparedHotels}
            setComparedHotels={setComparedHotels}
            isComparisonOpen={isComparisonOpen}
            setIsComparisonOpen={setIsComparisonOpen}
          />
        ) : (
          <MyBookingsPage
            initialEmail={bookingLookupParams.email}
            initialReference={bookingLookupParams.reference}
            onAddToast={addToast}
            onBackToExplore={() => setActiveTab('explore')}
          />
        )}
      </main>

      <Footer onNavigate={setActiveTab} />
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
