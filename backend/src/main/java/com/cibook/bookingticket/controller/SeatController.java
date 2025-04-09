package com.cibook.bookingticket.controller;

import com.cibook.bookingticket.model.Seat;
import com.cibook.bookingticket.service.ScreenLayoutDefinition;
import com.cibook.bookingticket.service.SeatService;

// Import necessary Spring Web annotations
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/seats")
public class SeatController implements IController<Seat, String> {
    private final SeatService seatService;
    private static final Logger log = LoggerFactory.getLogger(SeatController.class); // Add logger if not present

    @Autowired
    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @Override
    public ResponseEntity<Seat> add(Seat entity) {
        return ResponseEntity.ok(seatService.add(entity));
    }

    @Override
    public ResponseEntity<List<Seat>> getAll() {
        return ResponseEntity.ok(seatService.findAll());
    }

    @Override
    public ResponseEntity<Seat> getById(String id) {
        if (!seatService.existsById(id))
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(seatService.findById(id).get());
    }

    @Override
    public ResponseEntity<Map<String, String>> getAllNames() {
        return ResponseEntity.ok(seatService.findAllNamesWithID());
    }

    @Override
    public ResponseEntity<Seat> update(String id, Seat entity) {
        if (!seatService.existsById(id))
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(seatService.update(id, entity));
    }

    @Override
    public ResponseEntity<Void> delete(String id) {
        if (!seatService.existsById(id))
            return ResponseEntity.notFound().build();
        seatService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/all", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Seat>> addAll(@RequestBody List<Seat> seats) {
        return ResponseEntity.ok(seatService.addAll(seats));
    }

    @DeleteMapping("/all")
    public ResponseEntity<Void> deleteAll() {
        seatService.deleteAll();
        return ResponseEntity.ok().build();
    }

    @PutMapping(value = "/layout/screen/{screenCode}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> defineScreenLayout(
            @PathVariable String screenCode, // Removed ("screenCode") assuming -parameters flag is set
            @RequestBody ScreenLayoutDefinition layoutDefinition) {

        // ---> ADD THIS LOGGING <---
        log.info(">>>> ENTERING defineScreenLayout - screenCode: {}", screenCode);
        try {
            // Log the received DTO to check deserialization
            log.debug(">>>> Received layoutDefinition: {}", layoutDefinition);
        } catch (Exception e) {
            // Log even simple logging errors (though unlikely)
            System.err.println("Error logging request body: " + e.getMessage());
        }
        // ---> END LOGGING <---

        try {
            List<Seat> generatedSeats = seatService.defineAndGenerateSeats(screenCode, layoutDefinition);
            log.info("<<<< Exiting defineScreenLayout NORMALLY for screenCode: {}", screenCode); // Log normal exit
            return ResponseEntity.ok().body(Map.of(
                    "message", "Layout defined successfully for screen " + screenCode,
                    "seatsGenerated", generatedSeats.size()));

        } catch (IllegalArgumentException | NoSuchElementException e) {
            log.error("<<<< Exiting defineScreenLayout with KNOWN ERROR for {}: {}", screenCode, e.getMessage()); // Log
                                                                                                                  // known
                                                                                                                  // errors
            HttpStatus status = (e instanceof NoSuchElementException) ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
            return ResponseEntity.status(status).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            // Log the full stack trace for unexpected errors
            log.error("<<<< Exiting defineScreenLayout with UNEXPECTED ERROR for {}: {}", screenCode, e.getMessage(),
                    e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An internal server error occurred."));
        }
    }


      // === CORRECTED ENDPOINT FOR DEFINING SCREEN LAYOUT ===

    /**
     * Defines or replaces the entire seat layout for a specific screen within a specific cinema.
     * Expects a JSON body matching the ScreenLayoutDefinition structure.
     *
     * @param cinemaCode The unique code of the cinema containing the screen.
     * @param screenCode The unique code of the screen (within the cinema) whose layout is being defined.
     * @param layoutDefinition The DTO/Object containing total rows, columns, zones, etc.
     * @return ResponseEntity indicating success or failure.
     */
    @PutMapping(value = "/layout/{cinemaCode}/{screenCode}", consumes = MediaType.APPLICATION_JSON_VALUE) // <-- New path
    public ResponseEntity<?> defineScreenLayoutForCinema(
            @PathVariable String cinemaCode,                 // <-- Get cinemaCode
            @PathVariable String screenCode,                 // <-- Get screenCode
            @RequestBody ScreenLayoutDefinition layoutDefinition) { // Use the DTO/Structure

        log.info(">>>> ENTERING defineScreenLayoutForCinema - Cinema: {}, Screen: {}", cinemaCode, screenCode);
        try {
            log.debug(">>>> Received layoutDefinition: {}", layoutDefinition);

            // Call the CORRECT service method with BOTH codes
            List<Seat> generatedSeats = seatService.defineAndGenerateSeatsForCinema(cinemaCode, screenCode, layoutDefinition);

            log.info("<<<< Exiting defineScreenLayoutForCinema NORMALLY for {}/{}", cinemaCode, screenCode);
            return ResponseEntity.ok().body(Map.of(
                    "message", "Layout defined successfully for Cinema " + cinemaCode + ", Screen " + screenCode,
                    "seatsGenerated", generatedSeats.size()
            ));

        } catch (IllegalArgumentException | NoSuchElementException | IllegalStateException e) {
            // Handle specific known errors (bad input, resource not found, invalid state)
            log.warn("<<<< Exiting defineScreenLayoutForCinema with KNOWN ERROR for {}/{}: {}", cinemaCode, screenCode, e.getMessage());
            HttpStatus status = (e instanceof NoSuchElementException) ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST; // 404 if screen/cinema not found, 400 otherwise
            return ResponseEntity.status(status).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            // Catch unexpected errors
            log.error("<<<< Exiting defineScreenLayoutForCinema with UNEXPECTED ERROR for {}/{}: {}", cinemaCode, screenCode, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An internal server error occurred while processing the layout."));
        }
    }

    @GetMapping("/{cinemaCode}/{screenCode}") // <-- Define the new path structure
    public ResponseEntity<List<Seat>> getSeatsByCinemaAndScreen(
            @PathVariable String cinemaCode, // <-- Map cinemaCode from path
            @PathVariable String screenCode  // <-- Map screenCode from path
            ) {
        log.info("Fetching seats for cinemaCode: {} and screenCode: {}", cinemaCode, screenCode);
        try {
            // Call the service method responsible for fetching by these criteria
            // This assumes seatService has such a method. We might need to add it.
            List<Seat> seats = seatService.findByCinemaCodeAndScreenCode(cinemaCode, screenCode);

            // It's generally okay to return an empty list if no seats are found for a valid screen
            return ResponseEntity.ok(seats);

        } catch (NoSuchElementException e) { // Catch if service throws this for invalid codes
             log.warn("Could not find cinema or screen for combination: {} / {}", cinemaCode, screenCode);
             return ResponseEntity.notFound().build(); // Return 404 if cinema/screen combo doesn't exist
        } catch (Exception e) {
            log.error("Error fetching seats for cinema {} screen {}: {}", cinemaCode, screenCode, e.getMessage(), e);
            // Return 500 for unexpected errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }


}