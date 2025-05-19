package com.cibook.bookingticket.controller;

import com.cibook.bookingticket.model.Movie;
import com.cibook.bookingticket.model.Showtime;
import com.cibook.bookingticket.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/movies")
public class MovieController implements IController<Movie, String>{
    private final MovieService movieService;
    @Autowired
    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @Override
    public ResponseEntity<Movie> add(Movie entity) {
        return ResponseEntity.ok(movieService.add(entity));
    }

    @Override
    public ResponseEntity<Page<Movie>> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Movie> movies = movieService.findAll(pageable);
        return ResponseEntity.ok(movies);
    }

    @Override
    public ResponseEntity<Movie> getById(String id) {
        return movieService.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<Map<String, String>> getAllNames() {
        return ResponseEntity.ok(movieService.findAllNamesWithID());
    }

    @Override
    public ResponseEntity<Movie> update(String id, Movie entity) {
        return ResponseEntity.ok(movieService.update(id, entity));
    }

    @Override
    public ResponseEntity<Void> delete(String id) {
        if (!movieService.existsById(id))
            return ResponseEntity.notFound().build();
        movieService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<Movie> getByCode(@PathVariable("code") String code) {
        return ResponseEntity.ok(movieService.findByCode(code).orElse(null));
    }
}
