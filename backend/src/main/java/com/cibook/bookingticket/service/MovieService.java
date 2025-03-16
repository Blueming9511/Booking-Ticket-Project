package com.cibook.bookingticket.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cibook.bookingticket.model.Movie;
import com.cibook.bookingticket.repository.MovieRepository;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Movie getMovieById(String Id) {
        return movieRepository.findById(Id).orElse(null);
    }

    public List<Movie> getMoviesByGenre(String genre) {
        return movieRepository.findByGenre(genre);
    }

    public Movie addMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    public Movie updateMovie(String id, Movie updatedMovie) {
        return movieRepository.findById(id).map(existingMovie -> {
            BeanUtils.copyProperties(updatedMovie, existingMovie, "movieID"); // Exclude ID
            return movieRepository.save(existingMovie); // Save updated movie
        }).orElse(null);
    }

    public void deleteMovie(String id) {
        movieRepository.deleteById(id);
    }
}
