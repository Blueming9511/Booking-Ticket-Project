package com.cibook.bookingticket.repository;

import com.cibook.bookingticket.model.Showtime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ShowtimeRepository extends MongoRepository<Showtime, String> {
    Optional<Showtime> findByShowTimeCode(String id);

    Page<Showtime> findByOwner(String owner, Pageable pageable);

    List<Showtime> findByCinemaCode(String id);
}
