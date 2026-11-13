package com.stayease.service;

import com.stayease.dto.BookingRequestDTO;
import com.stayease.dto.BookingResponseDTO;
import com.stayease.entity.Booking;
import com.stayease.entity.BookingStatus;
import com.stayease.entity.Hotel;
import com.stayease.entity.Room;
import com.stayease.exception.InvalidBookingException;
import com.stayease.exception.ResourceNotFoundException;
import com.stayease.exception.RoomNotAvailableException;
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
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private BookingServiceImpl bookingService;

    private Hotel testHotel;
    private Room testRoom;

    @BeforeEach
    void setUp() {
        testHotel = new Hotel(
                "The Grand Azure",
                "Goa, India",
                "Goa",
                "14 Coastal Hwy",
                "Beach resort",
                4.8,
                "https://example.com/azure.jpg",
                Set.of("Pool", "WiFi")
        );
        testHotel.setId(1L);

        testRoom = new Room(
                testHotel,
                "GA-101",
                "Deluxe Ocean View",
                "Balcony facing ocean",
                new BigDecimal("5000.00"),
                2,
                "King Bed",
                450,
                "https://example.com/room.jpg",
                Set.of("AC", "Minibar")
        );
        testRoom.setId(20L);
    }

    @Test
    @DisplayName("Create Booking: Successfully generates booking with reference, correct nights, and taxes")
    void testCreateBookingSuccess() {
        LocalDate checkIn = LocalDate.now().plusDays(2);
        LocalDate checkOut = LocalDate.now().plusDays(5); // 3 nights

        BookingRequestDTO request = new BookingRequestDTO(
                20L,
                "Rahul Sharma",
                "rahul@example.com",
                "+91 9876543210",
                checkIn,
                checkOut,
                "Late check-in requested"
        );

        when(roomRepository.findByIdForUpdate(20L)).thenReturn(Optional.of(testRoom));
        when(bookingRepository.countOverlappingBookings(20L, checkIn, checkOut)).thenReturn(0L);
        when(bookingRepository.existsByBookingReference(anyString())).thenReturn(false);

        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking b = invocation.getArgument(0);
            b.setId(101L);
            return b;
        });

        BookingResponseDTO response = bookingService.createBooking(request);

        assertNotNull(response);
        assertEquals(101L, response.getId());
        assertTrue(response.getBookingReference().startsWith("WD-"));
        assertEquals("Rahul Sharma", response.getCustomerName());
        assertEquals("rahul@example.com", response.getCustomerEmail());
        assertEquals(3, response.getTotalNights());
        assertEquals(new BigDecimal("5000.00"), response.getPricePerNight());
        assertEquals(new BigDecimal("1800.00"), response.getTaxAmount()); // 15000 * 0.12
        assertEquals(new BigDecimal("16800.00"), response.getTotalAmount()); // 15000 + 1800
        assertEquals(BookingStatus.CONFIRMED, response.getStatus());

        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    @DisplayName("Create Booking: Throws RoomNotAvailableException when overlapping booking exists (Prevents Overbooking)")
    void testCreateBookingOverbookingPrevention() {
        LocalDate checkIn = LocalDate.now().plusDays(2);
        LocalDate checkOut = LocalDate.now().plusDays(5);

        BookingRequestDTO request = new BookingRequestDTO(
                20L,
                "Ananya Gupta",
                "ananya@example.com",
                "+91 9876543211",
                checkIn,
                checkOut,
                null
        );

        when(roomRepository.findByIdForUpdate(20L)).thenReturn(Optional.of(testRoom));
        // Overlap detected!
        when(bookingRepository.countOverlappingBookings(20L, checkIn, checkOut)).thenReturn(1L);

        RoomNotAvailableException ex = assertThrows(RoomNotAvailableException.class, () ->
                bookingService.createBooking(request)
        );

        assertTrue(ex.getMessage().contains("already been booked"));
        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    @DisplayName("Create Booking: Throws InvalidBookingException when check-out date is before check-in date")
    void testCreateBookingInvalidDateRange() {
        LocalDate checkIn = LocalDate.now().plusDays(5);
        LocalDate checkOut = LocalDate.now().plusDays(2); // Invalid

        BookingRequestDTO request = new BookingRequestDTO(
                20L,
                "Rahul Sharma",
                "rahul@example.com",
                null,
                checkIn,
                checkOut,
                null
        );

        assertThrows(InvalidBookingException.class, () ->
                bookingService.createBooking(request)
        );
    }

    @Test
    @DisplayName("Create Booking: Throws InvalidBookingException when check-in date is in the past")
    void testCreateBookingPastDate() {
        LocalDate checkIn = LocalDate.now().minusDays(1);
        LocalDate checkOut = LocalDate.now().plusDays(2);

        BookingRequestDTO request = new BookingRequestDTO(
                20L,
                "Rahul Sharma",
                "rahul@example.com",
                null,
                checkIn,
                checkOut,
                null
        );

        assertThrows(InvalidBookingException.class, () ->
                bookingService.createBooking(request)
        );
    }

    @Test
    @DisplayName("Get Booking: Retrieve booking by reference and email successfully")
    void testGetBookingByReferenceAndEmailSuccess() {
        Booking booking = new Booking(
                "SE-ABC123",
                testHotel,
                testRoom,
                "Rahul Sharma",
                "rahul@example.com",
                "+91 9876543210",
                LocalDate.now().plusDays(3),
                LocalDate.now().plusDays(5),
                2,
                new BigDecimal("5000.00"),
                new BigDecimal("1200.00"),
                new BigDecimal("11200.00"),
                null
        );
        booking.setId(200L);

        when(bookingRepository.findByBookingReferenceIgnoreCaseAndCustomerEmailIgnoreCase("SE-ABC123", "rahul@example.com"))
                .thenReturn(Optional.of(booking));

        BookingResponseDTO response = bookingService.getBookingByReferenceAndEmail("SE-ABC123", "rahul@example.com");

        assertNotNull(response);
        assertEquals("SE-ABC123", response.getBookingReference());
        assertEquals("rahul@example.com", response.getCustomerEmail());
        assertEquals(BookingStatus.CONFIRMED, response.getStatus());
    }

    @Test
    @DisplayName("Get Booking: Throws ResourceNotFoundException when reference or email is wrong")
    void testGetBookingNotFound() {
        when(bookingRepository.findByBookingReferenceIgnoreCaseAndCustomerEmailIgnoreCase("SE-INVALID", "wrong@example.com"))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                bookingService.getBookingByReferenceAndEmail("SE-INVALID", "wrong@example.com")
        );
    }

    @Test
    @DisplayName("Cancel Booking: Releases room and updates status to CANCELLED")
    void testCancelBookingSuccess() {
        Booking booking = new Booking(
                "SE-XYZ789",
                testHotel,
                testRoom,
                "Amit Patel",
                "amit@example.com",
                null,
                LocalDate.now().plusDays(10),
                LocalDate.now().plusDays(12),
                2,
                new BigDecimal("5000.00"),
                new BigDecimal("1200.00"),
                new BigDecimal("11200.00"),
                null
        );
        booking.setId(300L);

        when(bookingRepository.findByBookingReferenceIgnoreCaseAndCustomerEmailIgnoreCase("SE-XYZ789", "amit@example.com"))
                .thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> inv.getArgument(0));

        BookingResponseDTO response = bookingService.cancelBooking("SE-XYZ789", "amit@example.com");

        assertNotNull(response);
        assertEquals(BookingStatus.CANCELLED, response.getStatus());
        assertNotNull(response.getCancelledAt());
    }

    @Test
    @DisplayName("Cancel Booking: Throws InvalidBookingException when booking was already cancelled")
    void testCancelBookingAlreadyCancelled() {
        Booking booking = new Booking(
                "SE-XYZ789",
                testHotel,
                testRoom,
                "Amit Patel",
                "amit@example.com",
                null,
                LocalDate.now().plusDays(10),
                LocalDate.now().plusDays(12),
                2,
                new BigDecimal("5000.00"),
                new BigDecimal("1200.00"),
                new BigDecimal("11200.00"),
                null
        );
        booking.setStatus(BookingStatus.CANCELLED);

        when(bookingRepository.findByBookingReferenceIgnoreCaseAndCustomerEmailIgnoreCase("SE-XYZ789", "amit@example.com"))
                .thenReturn(Optional.of(booking));

        assertThrows(InvalidBookingException.class, () ->
                bookingService.cancelBooking("SE-XYZ789", "amit@example.com")
        );
    }

    @Test
    @DisplayName("Regression Test 1: Room ₹4,800 for 6 nights yields ₹32,256 total (₹28,800 + ₹3,456 tax)")
    void testCreateBookingRoom4800SixNights() {
        Room room4800 = new Room(
                testHotel, "RH-104", "Heritage Deluxe Chamber", "Chamber",
                new BigDecimal("4800.00"), 2, "Queen", 390, null, Set.of("WiFi")
        );
        room4800.setId(4L);

        LocalDate checkIn = LocalDate.now().plusDays(2);
        LocalDate checkOut = LocalDate.now().plusDays(8); // 6 nights

        BookingRequestDTO request = new BookingRequestDTO(
                4L, "Naman Test", "naman.test@example.com", null, checkIn, checkOut, null
        );

        when(roomRepository.findByIdForUpdate(4L)).thenReturn(Optional.of(room4800));
        when(bookingRepository.countOverlappingBookings(4L, checkIn, checkOut)).thenReturn(0L);
        when(bookingRepository.existsByBookingReference(anyString())).thenReturn(false);
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> {
            Booking b = inv.getArgument(0);
            b.setId(401L);
            return b;
        });

        BookingResponseDTO response = bookingService.createBooking(request);

        assertNotNull(response);
        assertEquals(4L, response.getRoomId());
        assertEquals("RH-104", response.getRoomNumber());
        assertEquals("Heritage Deluxe Chamber", response.getRoomType());
        assertEquals(6, response.getTotalNights());
        assertEquals(new BigDecimal("4800.00"), response.getPricePerNight());
        assertEquals(new BigDecimal("3456.00"), response.getTaxAmount()); // 28800 * 0.12
        assertEquals(new BigDecimal("32256.00"), response.getTotalAmount()); // 28800 + 3456
    }

    @Test
    @DisplayName("Regression Test 2: Room ₹9,500 for 6 nights yields ₹63,840 total (₹57,000 + ₹6,840 tax)")
    void testCreateBookingRoom9500SixNights() {
        Room room9500 = new Room(
                testHotel, "RH-202", "Maharaja Heritage Suite", "Suite",
                new BigDecimal("9500.00"), 3, "King", 750, null, Set.of("WiFi")
        );
        room9500.setId(5L);

        LocalDate checkIn = LocalDate.now().plusDays(2);
        LocalDate checkOut = LocalDate.now().plusDays(8); // 6 nights

        BookingRequestDTO request = new BookingRequestDTO(
                5L, "Royal Guest", "royal.guest@example.com", null, checkIn, checkOut, null
        );

        when(roomRepository.findByIdForUpdate(5L)).thenReturn(Optional.of(room9500));
        when(bookingRepository.countOverlappingBookings(5L, checkIn, checkOut)).thenReturn(0L);
        when(bookingRepository.existsByBookingReference(anyString())).thenReturn(false);
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> {
            Booking b = inv.getArgument(0);
            b.setId(501L);
            return b;
        });

        BookingResponseDTO response = bookingService.createBooking(request);

        assertNotNull(response);
        assertEquals(5L, response.getRoomId());
        assertEquals("RH-202", response.getRoomNumber());
        assertEquals("Maharaja Heritage Suite", response.getRoomType());
        assertEquals(6, response.getTotalNights());
        assertEquals(new BigDecimal("9500.00"), response.getPricePerNight());
        assertEquals(new BigDecimal("6840.00"), response.getTaxAmount()); // 57000 * 0.12
        assertEquals(new BigDecimal("63840.00"), response.getTotalAmount()); // 57000 + 6840
    }

    @Test
    @DisplayName("Regression Test 3: Same day check-in and check-out (0 nights) throws InvalidBookingException")
    void testCreateBookingZeroNightsThrowsException() {
        LocalDate sameDay = LocalDate.now().plusDays(3);
        BookingRequestDTO request = new BookingRequestDTO(
                4L, "Zero Night Guest", "guest@example.com", null, sameDay, sameDay, null
        );

        InvalidBookingException ex = assertThrows(InvalidBookingException.class, () ->
                bookingService.createBooking(request)
        );
        assertTrue(ex.getMessage().contains("strictly after check-in date") || ex.getMessage().contains("at least 1 night"));
    }
}

