package com.stayease.controller;

import com.stayease.dto.PriceCalculationDTO;
import com.stayease.dto.RoomDTO;
import com.stayease.service.RoomService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<RoomDTO>> getRoomsByHotel(
            @PathVariable Long hotelId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut
    ) {
        List<RoomDTO> rooms = roomService.getRoomsByHotel(hotelId, checkIn, checkOut);
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/{id}/calculate-price")
    public ResponseEntity<PriceCalculationDTO> calculatePrice(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut
    ) {
        PriceCalculationDTO price = roomService.calculatePrice(id, checkIn, checkOut);
        return ResponseEntity.ok(price);
    }
}
