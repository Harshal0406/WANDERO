import api from './api';

export const hotelService = {
  getHotels: async ({ location, query, checkIn, checkOut } = {}) => {
    const params = {};
    if (location) params.location = location;
    if (query) params.query = query;
    if (checkIn) params.checkIn = checkIn;
    if (checkOut) params.checkOut = checkOut;
    return api.get('/hotels', { params });
  },

  getHotelById: async (id, { checkIn, checkOut } = {}) => {
    const params = {};
    if (checkIn) params.checkIn = checkIn;
    if (checkOut) params.checkOut = checkOut;
    return api.get(`/hotels/${id}`, { params });
  },

  compareHotels: async (ids, { checkIn, checkOut } = {}) => {
    const params = { ids: ids.join(',') };
    if (checkIn) params.checkIn = checkIn;
    if (checkOut) params.checkOut = checkOut;
    return api.get('/hotels/compare', { params });
  },

  getRoomsByHotel: async (hotelId, { checkIn, checkOut } = {}) => {
    const params = {};
    if (checkIn) params.checkIn = checkIn;
    if (checkOut) params.checkOut = checkOut;
    return api.get(`/rooms/hotel/${hotelId}`, { params });
  },

  calculateRoomPrice: async (roomId, checkIn, checkOut) => {
    return api.get(`/rooms/${roomId}/calculate-price`, {
      params: { checkIn, checkOut },
    });
  },
};
