import api from './api';

export const bookingService = {
  createBooking: async (bookingData) => {
    return api.post('/bookings', bookingData);
  },

  lookupBooking: async (reference, email) => {
    return api.get('/bookings/lookup', {
      params: { reference, email },
    });
  },

  getMyBookings: async (email) => {
    return api.get('/bookings/my-bookings', {
      params: { email },
    });
  },

  cancelBooking: async (reference, email) => {
    return api.post('/bookings/cancel', null, {
      params: { reference, email },
    });
  },
};
