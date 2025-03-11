package com.cibook.bookingticket.controller;

import com.cibook.bookingticket.model.Seat;
import com.cibook.bookingticket.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/seats")
public class SeatController {

    @Autowired
    private SeatService seatService;

    // Create a new seat
    @PostMapping
    public ResponseEntity<Seat> createSeat(@RequestBody Seat seat) {
        return ResponseEntity.ok(seatService.createSeat(seat));
    }

    // Get all seats
    @GetMapping
    public ResponseEntity<List<Seat>> getAllSeats() {
        return ResponseEntity.ok(seatService.getAllSeats());
    }

    // Get a seat by ID
    @GetMapping("/{id}")
    public ResponseEntity<Seat> getSeatById(@PathVariable String id) {
        Optional<Seat> seat = seatService.getSeatById(id);
        return seat.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update a seat
    @PutMapping("/{id}")
    public ResponseEntity<Seat> updateSeat(@PathVariable String id, @RequestBody Seat updatedSeat) {
        Seat seat = seatService.updateSeat(id, updatedSeat);
        return seat != null ? ResponseEntity.ok(seat) : ResponseEntity.notFound().build();
    }

    // Delete a seat
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeat(@PathVariable String id) {
        seatService.deleteSeat(id);
        return ResponseEntity.noContent().build();
    }

    // Get seats by roomID
    @GetMapping("/room/{roomID}")
    public ResponseEntity<List<Seat>> getSeatsByRoomID(@PathVariable String roomID) {
        List<Seat> seats = seatService.getSeatsByRoomID(roomID);
        return seats.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(seats);
    }
}
