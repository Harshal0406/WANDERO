-- =============================================================================
-- WANDERO Hotel Booking Platform - Database Schema (MySQL 8.x / MariaDB)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS stayease CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE stayease;

-- -----------------------------------------------------------------------------
-- Table: hotels
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS room_amenities;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS hotel_amenities;
DROP TABLE IF EXISTS hotels;

CREATE TABLE hotels (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    description TEXT,
    rating DOUBLE NOT NULL,
    image_url TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_hotel_city (city),
    INDEX idx_hotel_location (location)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table: hotel_amenities
-- -----------------------------------------------------------------------------
CREATE TABLE hotel_amenities (
    hotel_id BIGINT NOT NULL,
    amenity VARCHAR(100) NOT NULL,
    PRIMARY KEY (hotel_id, amenity),
    CONSTRAINT fk_hotel_amenity_hotel FOREIGN KEY (hotel_id) REFERENCES hotels (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table: rooms
-- -----------------------------------------------------------------------------
CREATE TABLE rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hotel_id BIGINT NOT NULL,
    room_number VARCHAR(50) NOT NULL,
    room_type VARCHAR(100) NOT NULL,
    description TEXT,
    price_per_night DECIMAL(10, 2) NOT NULL,
    capacity INT NOT NULL,
    bed_type VARCHAR(100),
    room_size_sqft INT,
    image_url TEXT,
    CONSTRAINT fk_room_hotel FOREIGN KEY (hotel_id) REFERENCES hotels (id) ON DELETE CASCADE,
    INDEX idx_room_hotel (hotel_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table: room_amenities
-- -----------------------------------------------------------------------------
CREATE TABLE room_amenities (
    room_id BIGINT NOT NULL,
    amenity VARCHAR(100) NOT NULL,
    PRIMARY KEY (room_id, amenity),
    CONSTRAINT fk_room_amenity_room FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table: bookings
-- -----------------------------------------------------------------------------
CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_reference VARCHAR(32) NOT NULL UNIQUE,
    hotel_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(50),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_nights INT NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED',
    special_requests TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cancelled_at DATETIME NULL,
    CONSTRAINT fk_booking_hotel FOREIGN KEY (hotel_id) REFERENCES hotels (id),
    CONSTRAINT fk_booking_room FOREIGN KEY (room_id) REFERENCES rooms (id),
    INDEX idx_booking_ref (booking_reference),
    INDEX idx_customer_email (customer_email),
    INDEX idx_room_dates (room_id, check_in_date, check_out_date, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
