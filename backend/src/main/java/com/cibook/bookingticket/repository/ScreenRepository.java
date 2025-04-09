package com.cibook.bookingticket.repository;

import com.cibook.bookingticket.model.Screen;
import com.cibook.bookingticket.model.Seat;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ScreenRepository extends MongoRepository<Screen, String> {
    Optional<Screen> findByScreenCode(String id);

    @Query(value = "{}", fields = "{'type':  1, '_id': 0}")
    List<Screen> findAllByType();

    boolean existsByScreenCodeAndCinemaId(String screenCode, String cinemaCode);

    Optional<Screen> findByCinemaIdAndScreenCode(String cinemaCode, String screenCode);

}
