package com.cibook.bookingticket.controller;

import com.cibook.bookingticket.dto.BookingAdminDto;
import com.cibook.bookingticket.dto.BookingRequestDto;
import com.cibook.bookingticket.dto.BookingResponseDto;
import com.cibook.bookingticket.model.Booking;
import com.cibook.bookingticket.model.BookingDetail;
import com.cibook.bookingticket.model.Showtime;
import com.cibook.bookingticket.service.BookingDetailService;
import com.cibook.bookingticket.service.BookingService;
import com.cibook.bookingticket.service.SeatUnavailableException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/bookings")
public class BookingController implements IController<Booking, String> {

    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @Override
    public ResponseEntity<Booking> add(Booking entity) {
        return ResponseEntity.ok(bookingService.add(entity));
    }

    @Override
    public ResponseEntity<Page<Booking>> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Booking> bookings = bookingService.findAll(pageable);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/v2/")
    public ResponseEntity<Page<BookingAdminDto>> getAllBooking(
        @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BookingAdminDto> bookings = bookingService.findAllBooking(pageable, null, null, null);
        return ResponseEntity.ok(bookings);
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
        if (!bookingService.existsById(id))
            return ResponseEntity.notFound().build();
        bookingService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<BookingDetail> getBookingDetails(@PathVariable("id") String id) {
        return ResponseEntity.ok(bookingService.getBookingDetailById(id));
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

    @PostMapping("/u/")
    public ResponseEntity<?> createWithDetail(@RequestBody BookingRequestDto entity) {
        // try {
        //     Booking booking = bookingService.addWithDetail(entity);
        //     return ResponseEntity.ok(booking);
        // } catch (SeatUnavailableException e) {
            return ResponseEntity.badRequest().build();
        // }
    }

}
