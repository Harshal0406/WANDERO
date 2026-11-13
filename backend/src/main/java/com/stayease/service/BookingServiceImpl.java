package com.stayease.service;

import com.stayease.dto.BookingRequestDTO;
import com.stayease.dto.BookingResponseDTO;
import com.stayease.entity.Booking;
import com.stayease.entity.BookingStatus;
import com.stayease.entity.Room;
import com.stayease.exception.InvalidBookingException;
import com.stayease.exception.ResourceNotFoundException;
import com.stayease.exception.RoomNotAvailableException;
import com.stayease.repository.BookingRepository;
import com.stayease.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    private static final String REF_CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int REF_LENGTH = 6;
    private final SecureRandom random = new SecureRandom();

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;

    public BookingServiceImpl(BookingRepository bookingRepository, RoomRepository roomRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
    }

    @Override
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public BookingResponseDTO createBooking(BookingRequestDTO request) {
        if (request.getCheckInDate() == null || request.getCheckOutDate() == null) {
            throw new InvalidBookingException("Both check-in and check-out dates are required.");
        }
        if (!request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new InvalidBookingException("Check-out date must be strictly after check-in date.");
        }
        if (request.getCheckInDate().isBefore(LocalDate.now())) {
            throw new InvalidBookingException("Check-in date cannot be in the past.");
        }

        // Concurrency safeguard 1: Pessimistic Lock on the room record
        Room room = roomRepository.findByIdForUpdate(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + request.getRoomId()));

        // Concurrency safeguard 2: Double check overlapping active confirmed bookings
        long overlapping = bookingRepository.countOverlappingBookings(
                room.getId(),
                request.getCheckInDate(),
                request.getCheckOutDate()
        );

        if (overlapping > 0) {
            throw new RoomNotAvailableException("Room " + room.getRoomType() + " (#" + room.getRoomNumber() +
                    ") is not available between " + request.getCheckInDate() + " and " + request.getCheckOutDate() +
                    ". It has already been booked.");
        }

        int nights = (int) ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        if (nights <= 0) {
            throw new InvalidBookingException("Booking duration must be at least 1 night.");
        }
        BigDecimal pricePerNight = room.getPricePerNight();
        BigDecimal subtotal = pricePerNight.multiply(BigDecimal.valueOf(nights));
        BigDecimal taxAmount = subtotal.multiply(RoomServiceImpl.TAX_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = subtotal.add(taxAmount);

        String reference = generateUniqueBookingReference();

        Booking booking = new Booking(
                reference,
                room.getHotel(),
                room,
                request.getCustomerName().trim(),
                request.getCustomerEmail().trim().toLowerCase(),
                request.getCustomerPhone() != null ? request.getCustomerPhone().trim() : null,
                request.getCheckInDate(),
                request.getCheckOutDate(),
                nights,
                pricePerNight,
                taxAmount,
                totalAmount,
                request.getSpecialRequests() != null ? request.getSpecialRequests().trim() : null
        );

        Booking savedBooking = bookingRepository.save(booking);
        return mapToResponseDTO(savedBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponseDTO getBookingByReferenceAndEmail(String reference, String email) {
        if (reference == null || reference.trim().isEmpty() || email == null || email.trim().isEmpty()) {
            throw new InvalidBookingException("Both booking reference and customer email are required.");
        }

        Booking booking = bookingRepository.findByBookingReferenceIgnoreCaseAndCustomerEmailIgnoreCase(
                reference.trim(),
                email.trim().toLowerCase()
        ).orElseThrow(() -> new ResourceNotFoundException("No booking found with reference '" + reference.trim() +
                "' and email '" + email.trim() + "'."));

        return mapToResponseDTO(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getBookingsByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new InvalidBookingException("Customer email is required.");
        }

        return bookingRepository.findByCustomerEmailIgnoreCaseOrderByCreatedAtDesc(email.trim().toLowerCase())
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BookingResponseDTO cancelBooking(String reference, String email) {
        if (reference == null || reference.trim().isEmpty() || email == null || email.trim().isEmpty()) {
            throw new InvalidBookingException("Both booking reference and customer email are required.");
        }

        Booking booking = bookingRepository.findByBookingReferenceIgnoreCaseAndCustomerEmailIgnoreCase(
                reference.trim(),
                email.trim().toLowerCase()
        ).orElseThrow(() -> new ResourceNotFoundException("No booking found with reference '" + reference.trim() +
                "' and email '" + email.trim() + "'."));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new InvalidBookingException("Booking " + reference.trim() + " is already cancelled.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);
        return mapToResponseDTO(savedBooking);
    }

    private String generateUniqueBookingReference() {
        String reference;
        int attempts = 0;
        do {
            StringBuilder sb = new StringBuilder("WD-");
            for (int i = 0; i < REF_LENGTH; i++) {
                int index = random.nextInt(REF_CHARACTERS.length());
                sb.append(REF_CHARACTERS.charAt(index));
            }
            reference = sb.toString();
            attempts++;
            if (attempts > 50) {
                // Fallback to timestamp suffix if collision rate is high
                reference = "WD-" + System.currentTimeMillis() % 10000000;
                break;
            }
        } while (bookingRepository.existsByBookingReference(reference));

        return reference;
    }

    private BookingResponseDTO mapToResponseDTO(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setBookingReference(booking.getBookingReference());
        dto.setHotelId(booking.getHotel().getId());
        dto.setHotelName(booking.getHotel().getName());
        dto.setHotelLocation(booking.getHotel().getLocation());
        dto.setHotelAddress(booking.getHotel().getAddress());
        dto.setHotelImageUrl(booking.getHotel().getImageUrl());
        dto.setRoomId(booking.getRoom().getId());
        dto.setRoomNumber(booking.getRoom().getRoomNumber());
        dto.setRoomType(booking.getRoom().getRoomType());
        dto.setCustomerName(booking.getCustomerName());
        dto.setCustomerEmail(booking.getCustomerEmail());
        dto.setCustomerPhone(booking.getCustomerPhone());
        dto.setCheckInDate(booking.getCheckInDate());
        dto.setCheckOutDate(booking.getCheckOutDate());
        dto.setTotalNights(booking.getTotalNights());
        dto.setPricePerNight(booking.getPricePerNight());
        dto.setTaxAmount(booking.getTaxAmount());
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setStatus(booking.getStatus());
        dto.setSpecialRequests(booking.getSpecialRequests());
        dto.setCreatedAt(booking.getCreatedAt());
        dto.setCancelledAt(booking.getCancelledAt());
        return dto;
    }
}
