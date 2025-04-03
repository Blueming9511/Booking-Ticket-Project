package com.cibook.bookingticket.repository;

import com.cibook.bookingticket.model.Cinema;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CinemaRepository extends MongoRepository<Cinema, String> {
    Optional<Cinema> findByCinemaCode(String cinemaCode);

    @Query( value = "{}", fields = "{'cinemaName': 1}")
    List<CinemaNameProjection> findAllProjectedNames();

    public interface CinemaNameProjection {
        @Field("_id")
        String getId();
        String getCinemaName();
    }
}
