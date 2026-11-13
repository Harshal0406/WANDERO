package com.stayease.service;

import com.stayease.dto.HotelComparisonResponseDTO;
import com.stayease.dto.HotelDetailDTO;
import com.stayease.dto.HotelSummaryDTO;

import java.time.LocalDate;
import java.util.List;

public interface HotelService {
    List<HotelSummaryDTO> getAllHotels();
    List<HotelSummaryDTO> searchHotels(String query, LocalDate checkIn, LocalDate checkOut);
    HotelDetailDTO getHotelDetails(Long id, LocalDate checkIn, LocalDate checkOut);
    HotelComparisonResponseDTO compareHotels(List<Long> hotelIds, LocalDate checkIn, LocalDate checkOut);
}
