package com.stayease.controller;

import com.stayease.dto.BookingRequestDTO;
import com.stayease.dto.BookingResponseDTO;
import com.stayease.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(@Valid @RequestBody BookingRequestDTO request) {
        BookingResponseDTO response = bookingService.createBooking(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/lookup")
    public ResponseEntity<BookingResponseDTO> lookupBooking(
            @RequestParam String reference,
            @RequestParam String email
    ) {
        BookingResponseDTO response = bookingService.getBookingByReferenceAndEmail(reference, email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(@RequestParam String email) {
        List<BookingResponseDTO> bookings = bookingService.getBookingsByEmail(email);
        return ResponseEntity.ok(bookings);
    }

    @PostMapping("/cancel")
    public ResponseEntity<BookingResponseDTO> cancelBooking(
            @RequestParam String reference,
            @RequestParam String email
    ) {
        BookingResponseDTO response = bookingService.cancelBooking(reference, email);
        return ResponseEntity.ok(response);
    }
}
