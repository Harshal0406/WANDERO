package com.stayease.service;

import com.stayease.dto.PriceCalculationDTO;
import com.stayease.dto.RoomDTO;

import java.time.LocalDate;
import java.util.List;

public interface RoomService {
    List<RoomDTO> getRoomsByHotel(Long hotelId, LocalDate checkIn, LocalDate checkOut);
    PriceCalculationDTO calculatePrice(Long roomId, LocalDate checkIn, LocalDate checkOut);
    boolean isRoomAvailable(Long roomId, LocalDate checkIn, LocalDate checkOut);
}
