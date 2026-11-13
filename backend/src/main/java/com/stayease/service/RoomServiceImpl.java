package com.stayease.service;

import com.stayease.dto.PriceCalculationDTO;
import com.stayease.dto.RoomDTO;
import com.stayease.entity.Room;
import com.stayease.exception.InvalidBookingException;
import com.stayease.exception.ResourceNotFoundException;
import com.stayease.repository.BookingRepository;
import com.stayease.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class RoomServiceImpl implements RoomService {

    public static final BigDecimal TAX_RATE = BigDecimal.valueOf(0.12);

    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;

    public RoomServiceImpl(RoomRepository roomRepository, BookingRepository bookingRepository) {
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public List<RoomDTO> getRoomsByHotel(Long hotelId, LocalDate checkIn, LocalDate checkOut) {
        List<Room> rooms = roomRepository.findByHotelId(hotelId);
        if (rooms.isEmpty()) {
            return Collections.emptyList();
        }

        boolean hasDates = (checkIn != null && checkOut != null);
        int nights = 1;
        Set<Long> bookedRoomIds = new HashSet<>();

        if (hasDates) {
            if (checkOut.isBefore(checkIn) || checkOut.isEqual(checkIn)) {
                throw new InvalidBookingException("Check-out date must be strictly after check-in date.");
            }
            nights = (int) ChronoUnit.DAYS.between(checkIn, checkOut);
            List<Long> allRoomIds = rooms.stream().map(Room::getId).collect(Collectors.toList());
            bookedRoomIds.addAll(bookingRepository.findBookedRoomIdsForDates(allRoomIds, checkIn, checkOut));
        }

        final int stayNights = nights;
        return rooms.stream().map(room -> {
            RoomDTO dto = new RoomDTO();
            dto.setId(room.getId());
            dto.setHotelId(room.getHotel().getId());
            dto.setHotelName(room.getHotel().getName());
            dto.setRoomNumber(room.getRoomNumber());
            dto.setRoomType(room.getRoomType());
            dto.setDescription(room.getDescription());
            dto.setPricePerNight(room.getPricePerNight());
            dto.setCapacity(room.getCapacity());
            dto.setBedType(room.getBedType());
            dto.setRoomSizeSqFt(room.getRoomSizeSqFt());
            dto.setImageUrl(room.getImageUrl());
            dto.setAmenities(room.getAmenities());

            if (hasDates) {
                boolean available = !bookedRoomIds.contains(room.getId());
                dto.setIsAvailable(available);
                dto.setStayNights(stayNights);

                BigDecimal subtotal = room.getPricePerNight().multiply(BigDecimal.valueOf(stayNights));
                BigDecimal tax = subtotal.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
                dto.setSubtotal(subtotal);
                dto.setTaxAmount(tax);
                dto.setTotalStayPrice(subtotal.add(tax));
            } else {
                dto.setIsAvailable(true);
                dto.setStayNights(1);
                BigDecimal subtotal = room.getPricePerNight();
                BigDecimal tax = subtotal.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
                dto.setSubtotal(subtotal);
                dto.setTaxAmount(tax);
                dto.setTotalStayPrice(subtotal.add(tax));
            }

            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public PriceCalculationDTO calculatePrice(Long roomId, LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null) {
            throw new InvalidBookingException("Both check-in and check-out dates are required.");
        }
        if (checkOut.isBefore(checkIn) || checkOut.isEqual(checkIn)) {
            throw new InvalidBookingException("Check-out date must be strictly after check-in date.");
        }

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + roomId));

        int nights = (int) ChronoUnit.DAYS.between(checkIn, checkOut);
        BigDecimal subtotal = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));
        BigDecimal taxAmount = subtotal.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = subtotal.add(taxAmount);

        return new PriceCalculationDTO(
                room.getId(),
                room.getRoomType(),
                room.getPricePerNight(),
                nights,
                subtotal,
                TAX_RATE.multiply(BigDecimal.valueOf(100)),
                taxAmount,
                totalAmount
        );
    }

    @Override
    public boolean isRoomAvailable(Long roomId, LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null || !checkOut.isAfter(checkIn)) {
            return false;
        }
        return bookingRepository.countOverlappingBookings(roomId, checkIn, checkOut) == 0;
    }
}
