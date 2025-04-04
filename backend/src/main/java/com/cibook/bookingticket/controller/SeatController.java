package com.cibook.bookingticket.controller;

import com.cibook.bookingticket.model.Seat;
import com.cibook.bookingticket.service.SeatService;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        return seatService.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<Map<String, String>> getAllNames() {
        return ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<Seat> update(String id, Seat entity) {
        return ResponseEntity.ok(seatService.update(id, entity));
    }

    @Override
    public ResponseEntity<Void> delete(String id) {
        if (!seatService.existsById(id))
            return ResponseEntity.notFound().build();
        seatService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/all")
    public ResponseEntity<List<Seat>> addAll(@RequestBody List<Seat> seats) {
        List<Seat> savedSeats = seatService.addAll(seats);
        return ResponseEntity.ok(savedSeats);
    }
    @DeleteMapping("/all")
    public ResponseEntity<Void> deleteAll() {
        seatService.deleteAll();
        return ResponseEntity.ok().build();
    }
}
