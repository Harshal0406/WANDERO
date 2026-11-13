package com.stayease.repository;

import com.stayease.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT COUNT(b) FROM Booking b " +
           "WHERE b.room.id = :roomId " +
           "  AND b.status = com.stayease.entity.BookingStatus.CONFIRMED " +
           "  AND b.checkInDate < :checkOutDate " +
           "  AND b.checkOutDate > :checkInDate")
    long countOverlappingBookings(
            @Param("roomId") Long roomId,
            @Param("checkInDate") LocalDate checkInDate,
            @Param("checkOutDate") LocalDate checkOutDate
    );

    @Query("SELECT b.room.id FROM Booking b " +
           "WHERE b.room.id IN :roomIds " +
           "  AND b.status = com.stayease.entity.BookingStatus.CONFIRMED " +
           "  AND b.checkInDate < :checkOutDate " +
           "  AND b.checkOutDate > :checkInDate")
    List<Long> findBookedRoomIdsForDates(
            @Param("roomIds") Collection<Long> roomIds,
            @Param("checkInDate") LocalDate checkInDate,
            @Param("checkOutDate") LocalDate checkOutDate
    );

    Optional<Booking> findByBookingReferenceIgnoreCaseAndCustomerEmailIgnoreCase(
            String bookingReference,
            String customerEmail
    );

    Optional<Booking> findByBookingReferenceIgnoreCase(String bookingReference);

    List<Booking> findByCustomerEmailIgnoreCaseOrderByCreatedAtDesc(String customerEmail);

    boolean existsByBookingReference(String bookingReference);
}
