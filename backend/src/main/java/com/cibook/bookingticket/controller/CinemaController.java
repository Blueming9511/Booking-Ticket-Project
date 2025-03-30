package com.cibook.bookingticket.controller;

import com.cibook.bookingticket.model.Cinema;
import com.cibook.bookingticket.service.CinemaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cinemas")
public class CinemaController {

    @Autowired
    private CinemaService cinemaService;

    // Create a new cinema
    @PostMapping
    public ResponseEntity<Cinema> createCinema(@RequestBody Cinema cinema) {
        return ResponseEntity.ok(cinemaService.createCinema(cinema));
    }

    // Get all cinemas
    @GetMapping
    public ResponseEntity<List<Cinema>> getAllCinemas() {
        return ResponseEntity.ok(cinemaService.getAllCinemas());
    }

    // Get a cinema by ID
    @GetMapping("/{id}")
    public ResponseEntity<Cinema> getCinemaById(@PathVariable String id) {
        Optional<Cinema> cinema = cinemaService.getCinemaById(id);
        return cinema.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update a cinema
    @PutMapping("/{id}")
    public ResponseEntity<Cinema> updateCinema(@PathVariable String id, @RequestBody Cinema updatedCinema) {
        Cinema cinema = cinemaService.updateCinema(id, updatedCinema);
        return cinema != null ? ResponseEntity.ok(cinema) : ResponseEntity.notFound().build();
    }

    // Delete a cinema
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCinema(@PathVariable String id) {
        cinemaService.deleteCinema(id);
        return ResponseEntity.noContent().build();
    }
}