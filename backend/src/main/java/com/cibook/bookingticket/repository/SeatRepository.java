package com.cibook.bookingticket.repository;

import com.cibook.bookingticket.model.Seat;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface SeatRepository extends MongoRepository<Seat, String> {

    List<Seat> findByRoomID(String roomID);
}
