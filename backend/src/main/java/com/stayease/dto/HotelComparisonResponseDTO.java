package com.stayease.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class HotelComparisonResponseDTO {
    private List<HotelComparisonItemDTO> hotels = new ArrayList<>();
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer nights;
    private Set<String> allAmenities = new HashSet<>();
    private Long lowestPriceHotelId;
    private Long highestRatedHotelId;

    public HotelComparisonResponseDTO() {}

    public List<HotelComparisonItemDTO> getHotels() {
        return hotels;
    }

    public void setHotels(List<HotelComparisonItemDTO> hotels) {
        this.hotels = hotels;
    }

    public LocalDate getCheckInDate() {
        return checkInDate;
    }

    public void setCheckInDate(LocalDate checkInDate) {
        this.checkInDate = checkInDate;
    }

    public LocalDate getCheckOutDate() {
        return checkOutDate;
    }

    public void setCheckOutDate(LocalDate checkOutDate) {
        this.checkOutDate = checkOutDate;
    }

    public Integer getNights() {
        return nights;
    }

    public void setNights(Integer nights) {
        this.nights = nights;
    }

    public Set<String> getAllAmenities() {
        return allAmenities;
    }

    public void setAllAmenities(Set<String> allAmenities) {
        this.allAmenities = allAmenities;
    }

    public Long getLowestPriceHotelId() {
        return lowestPriceHotelId;
    }

    public void setLowestPriceHotelId(Long lowestPriceHotelId) {
        this.lowestPriceHotelId = lowestPriceHotelId;
    }

    public Long getHighestRatedHotelId() {
        return highestRatedHotelId;
    }

    public void setHighestRatedHotelId(Long highestRatedHotelId) {
        this.highestRatedHotelId = highestRatedHotelId;
    }
}
