package com.stayease.controller;

import com.stayease.dto.HotelComparisonResponseDTO;
import com.stayease.dto.HotelDetailDTO;
import com.stayease.dto.HotelSummaryDTO;
import com.stayease.service.HotelService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = "*")
public class HotelController {

    private final HotelService hotelService;

    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    @GetMapping
    public ResponseEntity<List<HotelSummaryDTO>> getHotels(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut
    ) {
        String effectiveQuery = (location != null && !location.isBlank()) ? location : query;
        List<HotelSummaryDTO> hotels = hotelService.searchHotels(effectiveQuery, checkIn, checkOut);
        return ResponseEntity.ok(hotels);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HotelDetailDTO> getHotelById(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut
    ) {
        HotelDetailDTO hotel = hotelService.getHotelDetails(id, checkIn, checkOut);
        return ResponseEntity.ok(hotel);
    }

    @GetMapping("/compare")
    public ResponseEntity<HotelComparisonResponseDTO> compareHotels(
            @RequestParam List<Long> ids,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut
    ) {
        HotelComparisonResponseDTO comparison = hotelService.compareHotels(ids, checkIn, checkOut);
        return ResponseEntity.ok(comparison);
    }
}
