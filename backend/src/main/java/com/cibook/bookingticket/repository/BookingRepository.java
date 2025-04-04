package com.cibook.bookingticket.repository;

import com.cibook.bookingticket.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface BookingRepository extends MongoRepository<Booking, String> {

    Optional<Booking> findByBookingCode(String code);
}
