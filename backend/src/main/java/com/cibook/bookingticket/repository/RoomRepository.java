package com.cibook.bookingticket.repository;

import com.cibook.bookingticket.model.Room;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoomRepository extends MongoRepository<Room, String> {

    List<Room> findByCinemaID(String cinemaID);
}
