package com.cibook.bookingticket.repository;

import com.cibook.bookingticket.model.Cinema;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CinemaRepository extends MongoRepository<Cinema, String> {
}
