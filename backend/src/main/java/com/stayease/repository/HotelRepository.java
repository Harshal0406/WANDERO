package com.stayease.repository;

import com.stayease.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {

    @Query("SELECT h FROM Hotel h WHERE " +
           "LOWER(h.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(h.location) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(h.city) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(h.address) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Hotel> searchByLocationOrName(@Param("query") String query);

    @Query("SELECT DISTINCT h FROM Hotel h " +
           "JOIN h.rooms r " +
           "WHERE (:query IS NULL OR :query = '' OR " +
           "       LOWER(h.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "       LOWER(h.location) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "       LOWER(h.city) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "  AND r.id NOT IN (" +
           "      SELECT b.room.id FROM Booking b " +
           "      WHERE b.status = com.stayease.entity.BookingStatus.CONFIRMED " +
           "        AND b.checkInDate < :checkOutDate " +
           "        AND b.checkOutDate > :checkInDate" +
           "  )")
    List<Hotel> searchAvailableHotels(
            @Param("query") String query,
            @Param("checkInDate") LocalDate checkInDate,
            @Param("checkOutDate") LocalDate checkOutDate
    );
}
