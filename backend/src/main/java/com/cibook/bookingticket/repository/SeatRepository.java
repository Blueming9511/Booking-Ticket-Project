package com.cibook.bookingticket.repository;

import com.cibook.bookingticket.model.Seat;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface SeatRepository extends MongoRepository<Seat, String> {
    Optional<Seat> findBySeatCode(String id);
}
