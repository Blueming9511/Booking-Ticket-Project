package com.cibook.bookingticket.repository;

import com.cibook.bookingticket.model.Showtime;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ShowtimeRepository extends MongoRepository<Showtime, String> {
}
