package com.stayease.service;

import com.stayease.dto.PriceCalculationDTO;
import com.stayease.dto.RoomDTO;
import com.stayease.entity.Hotel;
import com.stayease.entity.Room;
import com.stayease.exception.InvalidBookingException;
import com.stayease.exception.ResourceNotFoundException;
import com.stayease.repository.BookingRepository;
import com.stayease.repository.RoomRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoomServiceTest {

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private RoomServiceImpl roomService;

    private Hotel testHotel;
    private Room testRoom;

    @BeforeEach
    void setUp() {
        testHotel = new Hotel(
                "Goa Grand Azure",
                "Calangute, Goa",
                "Goa",
                "14 Beach Rd",
                "Luxury Beachfront",
                4.8,
                "https://example.com/hotel.jpg",
                Set.of("Free Wi-Fi", "Pool")
        );
        testHotel.setId(1L);

        testRoom = new Room(
                testHotel,
                "GA-101",
                "Deluxe Ocean View",
                "Sea facing room",
                new BigDecimal("5000.00"),
                2,
                "King Bed",
                400,
                "https://example.com/room.jpg",
                Set.of("Air Conditioning", "Balcony")
        );
        testRoom.setId(10L);
    }

    @Test
    @DisplayName("Calculate Price: Accurate stay nights, 12% tax and total calculation")
    void testCalculatePriceSuccess() {
        when(roomRepository.findById(10L)).thenReturn(Optional.of(testRoom));

        LocalDate checkIn = LocalDate.now().plusDays(2);
        LocalDate checkOut = LocalDate.now().plusDays(5); // 3 nights

        PriceCalculationDTO price = roomService.calculatePrice(10L, checkIn, checkOut);

        assertNotNull(price);
        assertEquals(3, price.getNights());
        assertEquals(new BigDecimal("5000.00"), price.getPricePerNight());
        assertEquals(new BigDecimal("15000.00"), price.getSubtotal()); // 5000 * 3
        assertEquals(new BigDecimal("1800.00"), price.getTaxAmount()); // 15000 * 0.12
        assertEquals(new BigDecimal("16800.00"), price.getTotalAmount()); // 15000 + 1800
    }

    @Test
    @DisplayName("Calculate Price: Throws InvalidBookingException when check-out is before check-in")
    void testCalculatePriceInvalidDates() {
        LocalDate checkIn = LocalDate.now().plusDays(5);
        LocalDate checkOut = LocalDate.now().plusDays(2);

        assertThrows(InvalidBookingException.class, () ->
                roomService.calculatePrice(10L, checkIn, checkOut)
        );
    }

    @Test
    @DisplayName("Calculate Price: Throws ResourceNotFoundException when room does not exist")
    void testCalculatePriceRoomNotFound() {
        when(roomRepository.findById(999L)).thenReturn(Optional.empty());

        LocalDate checkIn = LocalDate.now().plusDays(1);
        LocalDate checkOut = LocalDate.now().plusDays(3);

        assertThrows(ResourceNotFoundException.class, () ->
                roomService.calculatePrice(999L, checkIn, checkOut)
        );
    }

    @Test
    @DisplayName("Room Availability: Returns true when zero overlapping bookings exist")
    void testIsRoomAvailableTrue() {
        LocalDate checkIn = LocalDate.now().plusDays(10);
        LocalDate checkOut = LocalDate.now().plusDays(14);

        when(bookingRepository.countOverlappingBookings(10L, checkIn, checkOut)).thenReturn(0L);

        boolean available = roomService.isRoomAvailable(10L, checkIn, checkOut);
        assertTrue(available);
    }

    @Test
    @DisplayName("Room Availability: Returns false when overlapping bookings exist")
    void testIsRoomAvailableFalse() {
        LocalDate checkIn = LocalDate.now().plusDays(10);
        LocalDate checkOut = LocalDate.now().plusDays(14);

        when(bookingRepository.countOverlappingBookings(10L, checkIn, checkOut)).thenReturn(1L);

        boolean available = roomService.isRoomAvailable(10L, checkIn, checkOut);
        assertFalse(available);
    }

    @Test
    @DisplayName("Get Rooms By Hotel: Flags unavailable rooms correctly based on dates")
    void testGetRoomsByHotelWithAvailability() {
        when(roomRepository.findByHotelId(1L)).thenReturn(List.of(testRoom));

        LocalDate checkIn = LocalDate.now().plusDays(3);
        LocalDate checkOut = LocalDate.now().plusDays(5);

        // Room 10 is booked
        when(bookingRepository.findBookedRoomIdsForDates(anyCollection(), eq(checkIn), eq(checkOut)))
                .thenReturn(List.of(10L));

        List<RoomDTO> rooms = roomService.getRoomsByHotel(1L, checkIn, checkOut);

        assertEquals(1, rooms.size());
        RoomDTO roomDTO = rooms.get(0);
        assertFalse(roomDTO.getIsAvailable());
        assertEquals(2, roomDTO.getStayNights());
    }
}
