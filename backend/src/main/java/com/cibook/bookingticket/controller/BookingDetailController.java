package com.cibook.bookingticket.controller;

import com.cibook.bookingticket.model.BookingDetail;
import com.cibook.bookingticket.service.BookingDetailService;
import com.cibook.bookingticket.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/bookingdetails")
public class BookingDetailController implements IController<BookingDetail, String> {
    private final BookingDetailService bookingDetailService;

    @Autowired
    public BookingDetailController(BookingDetailService bookingDetailService) {
        this.bookingDetailService = bookingDetailService;
    }

    @Override
    public ResponseEntity<BookingDetail> add(BookingDetail entity) {
        return ResponseEntity.ok(bookingDetailService.add(entity));
    }

    @Override
    public ResponseEntity<List<BookingDetail>> getAll() {
        return ResponseEntity.ok(bookingDetailService.findAll());
    }

    @Override
    public ResponseEntity<BookingDetail> getById(String id) {
        return bookingDetailService.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<Map<String, String>> getAllNames() {
        return ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<BookingDetail> update(String id, BookingDetail entity) {
        return ResponseEntity.ok(bookingDetailService.update(id, entity));
    }

    @Override
    public ResponseEntity<Void> delete(String id) {
        if (!bookingDetailService.existsById(id)) return ResponseEntity.notFound().build();
        bookingDetailService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/all")
    public ResponseEntity<List<BookingDetail>> addAll(@RequestBody List<BookingDetail> bookingDetails) {
        return ResponseEntity.ok(bookingDetailService.addAll(bookingDetails));
    }

    @DeleteMapping("/all")
    public ResponseEntity<Void> deleteAll() {
        bookingDetailService.deleteAll();
        return ResponseEntity.ok().build();
    }
}
