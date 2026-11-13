package com.stayease.dto;

import java.math.BigDecimal;
import java.util.Set;

public class RoomDTO {
    private Long id;
    private Long hotelId;
    private String hotelName;
    private String roomNumber;
    private String roomType;
    private String description;
    private BigDecimal pricePerNight;
    private Integer capacity;
    private String bedType;
    private Integer roomSizeSqFt;
    private String imageUrl;
    private Set<String> amenities;
    private Boolean isAvailable;
    private Integer stayNights;
    private BigDecimal subtotal;
    private BigDecimal taxAmount;
    private BigDecimal totalStayPrice;

    public RoomDTO() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getHotelId() {
        return hotelId;
    }

    public void setHotelId(Long hotelId) {
        this.hotelId = hotelId;
    }

    public String getHotelName() {
        return hotelName;
    }

    public void setHotelName(String hotelName) {
        this.hotelName = hotelName;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(BigDecimal pricePerNight) {
        this.pricePerNight = pricePerNight;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getBedType() {
        return bedType;
    }

    public void setBedType(String bedType) {
        this.bedType = bedType;
    }

    public Integer getRoomSizeSqFt() {
        return roomSizeSqFt;
    }

    public void setRoomSizeSqFt(Integer roomSizeSqFt) {
        this.roomSizeSqFt = roomSizeSqFt;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Set<String> getAmenities() {
        return amenities;
    }

    public void setAmenities(Set<String> amenities) {
        this.amenities = amenities;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    public Integer getStayNights() {
        return stayNights;
    }

    public void setStayNights(Integer stayNights) {
        this.stayNights = stayNights;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }

    public BigDecimal getTotalStayPrice() {
        return totalStayPrice;
    }

    public void setTotalStayPrice(BigDecimal totalStayPrice) {
        this.totalStayPrice = totalStayPrice;
    }
}
