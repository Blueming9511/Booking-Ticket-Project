package com.cibook.bookingticket.controller;

import com.cibook.bookingticket.model.Booking;
import com.cibook.bookingticket.model.BookingDetail;
import com.cibook.bookingticket.service.BookingDetailService;
import com.cibook.bookingticket.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
        return ResponseEntity.ok(bookingService.add(entity));
    }

    @Override
    public ResponseEntity<List<Booking>> getAll() {
        return ResponseEntity.ok(bookingService.findAll());
    }

    @Override
    public ResponseEntity<Booking> getById(String id) {
        return bookingService.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<Map<String, String>> getAllNames() {
        return null;
    }

    @Override
    public ResponseEntity<Booking> update(String id, Booking entity) {
        return ResponseEntity.ok(bookingService.update(id, entity));
    }

    @Override
    public ResponseEntity<Void> delete(String id) {
        if (!bookingService.existsById(id)) return ResponseEntity.notFound().build();
        bookingService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<List<BookingDetail>> getBookingDetails(@PathVariable("id") String id) {
        return ResponseEntity.ok(bookingService.getDetailsById(id));
    }

    @PostMapping("/all")
    public ResponseEntity<List<Booking>> addAll(@RequestBody List<Booking> entity) {
        return ResponseEntity.ok(bookingService.addAll(entity));
    }

    @DeleteMapping("/all")
    public ResponseEntity<Void> deleteAll() {
        bookingService.deleteAll();
        return ResponseEntity.ok().build();
    }
}
