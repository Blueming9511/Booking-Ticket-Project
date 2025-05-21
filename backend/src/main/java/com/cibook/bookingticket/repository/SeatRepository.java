package com.cibook.bookingticket.repository;

import com.cibook.bookingticket.model.Seat;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface SeatRepository extends MongoRepository<Seat, String> {
    Optional<Seat> findBySeatCode(String id);

    @Query("{'seatCode': ?0, 'screenCode': ?1, 'cinemaCode': ?2}")
    Double getPriceBySeatCode(String seatCode, String screenCode, String cinemaCode);

    void deleteAllByCinemaCodeAndScreenCode(String cinemaCode, String screenCode);
}
