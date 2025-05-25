package com.cibook.bookingticket.repository;

import com.cibook.bookingticket.model.Booking;
import com.cibook.bookingticket.model.Booking.BookingStatus;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends MongoRepository<Booking, String> {

    Optional<Booking> findByBookingCode(String code);

    List<Booking> findByStatusAndCreatedAtBefore(BookingStatus pending, LocalDateTime timeoutThreshold);
}
