package com.cibook.bookingticket.repository;

import com.cibook.bookingticket.model.Booking;
import com.cibook.bookingticket.model.Booking.BookingStatus;
import com.cibook.bookingticket.model.Coupon;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends MongoRepository<Booking, String> {

    Optional<Booking> findByBookingCode(String code);

    List<Booking> findByStatusAndCreatedAtBefore(BookingStatus pending, LocalDateTime timeoutThreshold);

    Optional<Booking> findByTxnRef(String parameter);

    Page<List<Booking>> findAllByUserId(String id, PageRequest of);

    Page<List<Booking>> findAllByUserIdAndStatus(String id, BookingStatus approved, PageRequest of);
}
