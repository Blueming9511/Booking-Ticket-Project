package com.cibook.bookingticket.repository;

import com.cibook.bookingticket.model.Showtime;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ShowtimeRepository extends MongoRepository<Showtime, String> {
    Optional<Showtime> findByShowTimeCode(String id);
}
