package com.cibook.bookingticket.controller;

import com.cibook.bookingticket.model.Seat;
import com.cibook.bookingticket.service.SeatService;

// Import necessary Spring Web annotations
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seats")
// Removed 'implements IController<Seat, String>' to avoid annotation conflicts from interface
public class SeatController {
    private final SeatService seatService;

    @Autowired
    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    // --- Explicitly Defined CRUD Endpoints ---

    @PostMapping
    // Add @RequestBody to bind JSON body to the Seat object
    public ResponseEntity<?> add(@RequestBody Seat entity) {
        try {
            Seat savedSeat = seatService.add(entity);
            // Return 201 Created for new resource
            return ResponseEntity.status(HttpStatus.CREATED).body(savedSeat);
        } catch (Exception e) {
            // Consider more specific exception handling based on what seatService.add might throw
            // Log the error: log.error("Error adding seat: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding seat: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Seat>> getAll() {
        // WARNING: Review seatService.findAll() logic - it currently modifies data!
        List<Seat> seats = seatService.findAll();
        return ResponseEntity.ok(seats);
    }

    @GetMapping("/{id}")
    // Add @PathVariable to bind URL part to the id parameter
    public ResponseEntity<Seat> getById(@PathVariable String id) {
        return seatService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/names") // Assuming this convention was intended for getAllNames
    public ResponseEntity<Map<String, String>> getAllNames() {
        // Service returns null, handle it
        Map<String, String> namesMap = seatService.findAllNamesWithID();
        if (namesMap == null) {
            // Return an empty map or Not Found depending on API contract
            return ResponseEntity.ok(Collections.emptyMap());
            // Or return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(namesMap);
    }

    @PutMapping("/{id}")
    // Add @PathVariable for id and @RequestBody for entity
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Seat entity) {
        // Service returns null if ID doesn't exist for update
        Seat updatedSeat = seatService.update(id, entity);
        if (updatedSeat == null) {
            // ID likely not found
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedSeat);
    }

    @DeleteMapping("/{id}")
    // Add @PathVariable for id
    public ResponseEntity<Void> delete(@PathVariable String id) {
        // Check existence before attempting delete
        if (!seatService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        try {
            seatService.deleteById(id);
            // Return 204 No Content for successful deletion (standard practice)
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            // Handle potential errors during delete (e.g., constraints)
            // Log the error: log.error("Error deleting seat {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // --- Custom Bulk Endpoints (Keep as they were correctly annotated) ---

    @PostMapping("/all")
    public ResponseEntity<?> addAll(@RequestBody List<Seat> seats) {
        if (seats == null || seats.isEmpty()) {
            return ResponseEntity.badRequest().body("Seat list cannot be null or empty.");
        }
        try {
            List<Seat> savedSeats = seatService.addAll(seats);
            // Return 201 Created for bulk creation
            return ResponseEntity.status(HttpStatus.CREATED).body(savedSeats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding seats: " + e.getMessage());
        }
    }

    @DeleteMapping("/all")
    public ResponseEntity<Void> deleteAll() {
        try {
            seatService.deleteAll();
            // Return 204 No Content for successful bulk deletion
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            // Log the error: log.error("Error deleting all seats: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}