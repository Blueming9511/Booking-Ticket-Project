package com.cibook.bookingticket.repository;

import java.util.List;
import java.util.Optional;

import org.attoparser.dom.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.cibook.bookingticket.model.Movie;

@Repository
public interface MovieRepository extends MongoRepository<Movie, String> {

    List<Movie> findByGenre(String genre);

    Optional<Movie> findByMovieCode(String id);

    @Query(value = "{'movieCode': ?0}", fields = "{'duration': 1, '_id': 0}")
    Document findDurationByMovieCode(String code);

    Page<Movie> findByOwner(String role, Pageable pageable);
}
