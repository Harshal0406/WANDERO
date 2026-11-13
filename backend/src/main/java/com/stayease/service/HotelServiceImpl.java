package com.stayease.service;

import com.stayease.dto.HotelComparisonItemDTO;
import com.stayease.dto.HotelComparisonResponseDTO;
import com.stayease.dto.HotelDetailDTO;
import com.stayease.dto.HotelSummaryDTO;
import com.stayease.dto.RoomDTO;
import com.stayease.entity.Hotel;
import com.stayease.entity.Room;
import com.stayease.exception.InvalidBookingException;
import com.stayease.exception.ResourceNotFoundException;
import com.stayease.repository.HotelRepository;
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
public class HotelServiceImpl implements HotelService {

    private final HotelRepository hotelRepository;
    private final RoomService roomService;

    public HotelServiceImpl(HotelRepository hotelRepository, RoomService roomService) {
        this.hotelRepository = hotelRepository;
        this.roomService = roomService;
    }

    @Override
    public List<HotelSummaryDTO> getAllHotels() {
        return hotelRepository.findAll()
                .stream()
                .map(this::mapToSummaryDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<HotelSummaryDTO> searchHotels(String query, LocalDate checkIn, LocalDate checkOut) {
        String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;

        if (checkIn != null && checkOut != null) {
            if (checkOut.isBefore(checkIn) || checkOut.isEqual(checkIn)) {
                throw new InvalidBookingException("Check-out date must be after check-in date.");
            }
            return hotelRepository.searchAvailableHotels(cleanQuery, checkIn, checkOut)
                    .stream()
                    .map(this::mapToSummaryDTO)
                    .collect(Collectors.toList());
        }

        if (cleanQuery != null) {
            return hotelRepository.searchByLocationOrName(cleanQuery)
                    .stream()
                    .map(this::mapToSummaryDTO)
                    .collect(Collectors.toList());
        }

        return getAllHotels();
    }

    @Override
    public HotelDetailDTO getHotelDetails(Long id, LocalDate checkIn, LocalDate checkOut) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));

        HotelDetailDTO dto = new HotelDetailDTO();
        dto.setId(hotel.getId());
        dto.setName(hotel.getName());
        dto.setLocation(hotel.getLocation());
        dto.setCity(hotel.getCity());
        dto.setAddress(hotel.getAddress());
        dto.setDescription(hotel.getDescription());
        dto.setRating(hotel.getRating());
        dto.setImageUrl(hotel.getImageUrl());
        dto.setAmenities(hotel.getAmenities());

        List<RoomDTO> roomDTOs = roomService.getRoomsByHotel(id, checkIn, checkOut);
        dto.setRooms(roomDTOs);

        BigDecimal startingPrice = roomDTOs.stream()
                .map(RoomDTO::getPricePerNight)
                .filter(Objects::nonNull)
                .min(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);
        dto.setStartingPrice(startingPrice);

        return dto;
    }

    @Override
    public HotelComparisonResponseDTO compareHotels(List<Long> hotelIds, LocalDate checkIn, LocalDate checkOut) {
        if (hotelIds == null || hotelIds.isEmpty()) {
            throw new IllegalArgumentException("At least one hotel ID must be provided for comparison.");
        }
        if (hotelIds.size() > 3) {
            throw new IllegalArgumentException("You can compare a maximum of 3 hotels at a time.");
        }

        int nights = 1;
        if (checkIn != null && checkOut != null) {
            if (checkOut.isBefore(checkIn) || checkOut.isEqual(checkIn)) {
                throw new InvalidBookingException("Check-out date must be after check-in date.");
            }
            nights = (int) ChronoUnit.DAYS.between(checkIn, checkOut);
        }

        List<Hotel> hotels = hotelRepository.findAllById(hotelIds);
        HotelComparisonResponseDTO response = new HotelComparisonResponseDTO();
        response.setCheckInDate(checkIn);
        response.setCheckOutDate(checkOut);
        response.setNights(nights);

        Set<String> allAmenities = new TreeSet<>();
        List<HotelComparisonItemDTO> items = new ArrayList<>();

        for (Hotel hotel : hotels) {
            HotelComparisonItemDTO item = new HotelComparisonItemDTO();
            item.setId(hotel.getId());
            item.setName(hotel.getName());
            item.setLocation(hotel.getLocation());
            item.setCity(hotel.getCity());
            item.setAddress(hotel.getAddress());
            item.setDescription(hotel.getDescription());
            item.setRating(hotel.getRating());
            item.setImageUrl(hotel.getImageUrl());
            item.setAmenities(hotel.getAmenities());
            if (hotel.getAmenities() != null) {
                allAmenities.addAll(hotel.getAmenities());
            }

            List<RoomDTO> rooms = roomService.getRoomsByHotel(hotel.getId(), checkIn, checkOut);
            item.setRooms(rooms);
            item.setTotalRooms(rooms.size());

            BigDecimal startingPrice = rooms.stream()
                    .map(RoomDTO::getPricePerNight)
                    .filter(Objects::nonNull)
                    .min(BigDecimal::compareTo)
                    .orElse(BigDecimal.ZERO);
            item.setStartingPrice(startingPrice);
            item.setNights(nights);

            // Estimated stay cost = startingPrice * nights + 12% tax
            BigDecimal subtotal = startingPrice.multiply(BigDecimal.valueOf(nights));
            BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.12)).setScale(2, RoundingMode.HALF_UP);
            item.setEstimatedTotalStayCost(subtotal.add(tax));

            items.add(item);
        }

        response.setHotels(items);
        response.setAllAmenities(allAmenities);

        items.stream()
                .min(Comparator.comparing(HotelComparisonItemDTO::getStartingPrice))
                .ifPresent(minHotel -> response.setLowestPriceHotelId(minHotel.getId()));

        items.stream()
                .max(Comparator.comparing(HotelComparisonItemDTO::getRating))
                .ifPresent(maxHotel -> response.setHighestRatedHotelId(maxHotel.getId()));

        return response;
    }

    private HotelSummaryDTO mapToSummaryDTO(Hotel hotel) {
        HotelSummaryDTO dto = new HotelSummaryDTO();
        dto.setId(hotel.getId());
        dto.setName(hotel.getName());
        dto.setLocation(hotel.getLocation());
        dto.setCity(hotel.getCity());
        dto.setAddress(hotel.getAddress());
        dto.setDescription(hotel.getDescription());
        dto.setRating(hotel.getRating());
        dto.setImageUrl(hotel.getImageUrl());
        dto.setAmenities(hotel.getAmenities());
        dto.setTotalRooms(hotel.getRooms() != null ? hotel.getRooms().size() : 0);

        BigDecimal minPrice = hotel.getRooms() != null ?
                hotel.getRooms().stream()
                        .map(Room::getPricePerNight)
                        .filter(Objects::nonNull)
                        .min(BigDecimal::compareTo)
                        .orElse(BigDecimal.ZERO)
                : BigDecimal.ZERO;
        dto.setStartingPrice(minPrice);

        return dto;
    }
}
