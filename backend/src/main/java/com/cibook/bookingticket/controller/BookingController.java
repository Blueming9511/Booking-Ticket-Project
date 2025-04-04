package com.cibook.bookingticket.controller;

import com.cibook.bookingticket.model.Booking;
import com.cibook.bookingticket.model.BookingDetail;
import com.cibook.bookingticket.service.BookingDetailService;
import com.cibook.bookingticket.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/bookings")
public class BookingController implements IController<Booking, String> {

    private final BookingService bookingService;
    private final BookingDetailService bookingDetailService;

    @Autowired
    public BookingController(BookingService bookingService, BookingDetailService bookingDetailService) {
        this.bookingService = bookingService;
        this.bookingDetailService = bookingDetailService;
    }

    @Override
    public ResponseEntity<Booking> add(Booking entity) {
        Booking saved = bookingService.add(entity);
        return ResponseEntity.ok(saved);
    }

    @Override
    public ResponseEntity<List<Booking>> getAll() {
        return ResponseEntity.ok(bookingService.findAll());
    }

    @Override
    public ResponseEntity<Booking> getById(String id) {
        return bookingService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<Map<String, String>> getAllNames() {
        return ResponseEntity.ok(bookingService.findAllNamesWithID());
    }

    @Override
    public ResponseEntity<Booking> update(String id, Booking entity) {
        try {
            Booking updated = bookingService.update(id, entity);
            return ResponseEntity.ok(updated);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    public ResponseEntity<Void> delete(String id) {
        try {
            bookingService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // booking details
    @GetMapping("/{bookingId}/details")
    public ResponseEntity<List<BookingDetail>> getAllDetailsForBooking(@PathVariable String bookingId) {
        List<BookingDetail> details = bookingDetailService.findByBookingId(bookingId);
        return ResponseEntity.ok(details);
    }

    @GetMapping("/{bookingId}/details/{detailId}")
    public ResponseEntity<BookingDetail> getSpecificDetailForBooking(
            @PathVariable String bookingId,
            @PathVariable String detailId) {

        // Use the service method that checks both IDs and the relationship
        return bookingDetailService.findDetailByIdAndBookingId(detailId, bookingId)
                .map(ResponseEntity::ok) // If found and relationship is correct, return 200 OK
                .orElse(ResponseEntity.notFound().build()); // Otherwise (not found or wrong booking), return 404 Not Found
    }

    /**
     * UPDATE: Updates a specific Booking Detail associated with a specific Booking.
     * Handles PUT requests to /api/bookings/{bookingId}/details/{detailId}
     */
    @PutMapping("/{bookingId}/details/{detailId}")
    public ResponseEntity<?> updateDetailInBooking(
            @PathVariable String bookingId,
            @PathVariable String detailId,
            @RequestBody BookingDetail updatedDetailData) {

        try {
            // 1. Verify the detail exists AND belongs to the specified booking *before* attempting update
            BookingDetail existingDetail = bookingDetailService.findDetailByIdAndBookingId(detailId, bookingId)
                    .orElseThrow(() -> new NoSuchElementException("BookingDetail with ID " + detailId +
                            " not found or does not belong to Booking ID " + bookingId));

            // 2. Prevent changing the parent booking via this endpoint (optional but recommended)
            if (updatedDetailData.getBooking() != null &&
                    !updatedDetailData.getBooking().getId().equals(bookingId)) {
                return ResponseEntity.badRequest()
                        .body("Cannot change the parent Booking reference via this nested endpoint.");
            }
            // Ensure the booking reference remains correct or is set from the path variable if null in body
            if (updatedDetailData.getBooking() == null){
                updatedDetailData.setBooking(existingDetail.getBooking()); // Keep original booking reference
            }


            // 3. Perform the update using the detail service
            // The service's update method should handle merging/saving logic
            BookingDetail savedDetail = bookingDetailService.update(detailId, updatedDetailData);
            return ResponseEntity.ok(savedDetail);

        } catch (NoSuchElementException e) {
            // Detail not found for the given bookingId/detailId combo OR validation in update failed
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            // Validation error within bookingDetailService.update
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // Catch unexpected errors
            return ResponseEntity.internalServerError().body("Error updating booking detail: " + e.getMessage());
        }
    }

    /**
     * DELETE: Deletes a specific Booking Detail associated with a specific Booking.
     * Handles DELETE requests to /api/bookings/{bookingId}/details/{detailId}
     */
    @DeleteMapping("/{bookingId}/details/{detailId}")
    public ResponseEntity<Void> deleteDetailFromBooking(
            @PathVariable String bookingId,
            @PathVariable String detailId) {

        try {
            // 1. Verify the detail exists AND belongs to the specified booking *before* attempting delete
            bookingDetailService.findDetailByIdAndBookingId(detailId, bookingId)
                    .orElseThrow(() -> new NoSuchElementException("BookingDetail with ID " + detailId +
                            " not found or does not belong to Booking ID " + bookingId));

            // 2. Perform the delete using the detail service
            bookingDetailService.deleteById(detailId);

            return ResponseEntity.noContent().build(); // HTTP 204 No Content on successful deletion

        } catch (NoSuchElementException e) {
            // Detail not found for the given bookingId/detailId combo
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Return 404
        } catch (Exception e) {
            // Catch unexpected errors during delete
            return ResponseEntity.internalServerError().build(); // Return 500
        }
    }
}
