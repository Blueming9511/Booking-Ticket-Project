package com.cibook.bookingticket.repository;

import com.cibook.bookingticket.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BookingRepository extends MongoRepository<Booking, String> {


}
