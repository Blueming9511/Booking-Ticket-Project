package com.cibook.bookingticket.controller;

import com.cibook.bookingticket.service.CinemaService;
import com.cibook.bookingticket.service.MovieService;
import com.cibook.bookingticket.service.ShowtimeService;
import com.cibook.bookingticket.service.UserService;

import java.text.ParseException;

import org.apache.catalina.connector.Response;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/guest")
public class GuestController {

    private final ShowtimeService showtimeService;

    private final UserService userService;

    private final CinemaService cinemaService;

    private final MovieService movieService;

    GuestController(MovieService movieService, CinemaService cinemaService, UserService userService,
            ShowtimeService showtimeService) {
        this.movieService = movieService;
        this.cinemaService = cinemaService;
        this.userService = userService;
        this.showtimeService = showtimeService;
    }

    @GetMapping("/movies-carousel")
    public ResponseEntity<?> getMoviesCarousel() {
        return ResponseEntity.ok(movieService.getMoviesCarousel());
    }

    @GetMapping("/movies-up-comming")
    public ResponseEntity<?> getMoviesUpComming() {
        return ResponseEntity.ok(movieService.getMoviesUpComming());
    }

    @GetMapping("/all-cinemas")
    public ResponseEntity<?> getAllCinemas(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "brand", required = false) String brand) {
        return ResponseEntity.ok(cinemaService.findAllWithOwner(PageRequest.of(page, size), brand, null, null));
    }

    @GetMapping("/all-brands")
    public ResponseEntity<?> getAllBrands() {
        return ResponseEntity.ok(userService.getAllBrands());
    }

    @GetMapping("/cinema/{id}/showtimes")
    public ResponseEntity<?> getCinemas(@PathVariable String id) {
        try {
            return ResponseEntity.ok(showtimeService.findAllShowtimes(PageRequest.of(0, 100), null, null, null, null, null, null, null, id));
        } catch (ParseException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
