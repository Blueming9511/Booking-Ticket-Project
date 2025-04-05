package com.cibook.bookingticket.controller;

import com.cibook.bookingticket.model.Seat;
import com.cibook.bookingticket.service.SeatService;

// Import necessary Spring Web annotations
import org.springframework.http.MediaType;
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
public class SeatController implements IController<Seat, String> {
    private final SeatService seatService;

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
        if (!seatService.existsById(id)) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(seatService.findById(id).get());
    }

    @Override
    public ResponseEntity<Map<String, String>> getAllNames() {
        return ResponseEntity.ok(seatService.findAllNamesWithID());
    }

    @Override
    public ResponseEntity<Seat> update(String id, Seat entity) {
        if (!seatService.existsById(id)) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(seatService.update(id, entity));
    }

    @Override
    public ResponseEntity<Void> delete(String id) {
        if (!seatService.existsById(id)) return ResponseEntity.notFound().build();
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

}