package com.stayease.service;

import com.stayease.dto.BookingRequestDTO;
import com.stayease.dto.BookingResponseDTO;

import java.util.List;

public interface BookingService {
    BookingResponseDTO createBooking(BookingRequestDTO request);
    BookingResponseDTO getBookingByReferenceAndEmail(String reference, String email);
    List<BookingResponseDTO> getBookingsByEmail(String email);
    BookingResponseDTO cancelBooking(String reference, String email);
}
