package com.cibook.bookingticket.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.cibook.bookingticket.model.Movie;

@Repository
public interface MovieRepository extends MongoRepository<Movie, String> {

    List<Movie> findByGenre(String genre);

    Optional<Movie> findByMovieCode(String id);
} 
