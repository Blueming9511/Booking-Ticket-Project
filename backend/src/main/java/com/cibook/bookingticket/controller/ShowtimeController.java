package com.cibook.bookingticket.controller;

import com.cibook.bookingticket.model.Showtime;
import com.cibook.bookingticket.service.ShowtimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/showtimes")
public class ShowtimeController implements IController<Showtime, String> {
    private final ShowtimeService showtimeService;

    @Autowired
    public ShowtimeController(ShowtimeService showtimeService) {
        this.showtimeService = showtimeService;
    }

    @Override
    public ResponseEntity<Showtime> add(Showtime entity) {
        return ResponseEntity.ok(showtimeService.add(entity));
    }

    @Override
    public ResponseEntity<List<Showtime>> getAll() {
        return ResponseEntity.ok(showtimeService.findAll());
    }

    @Override
    public ResponseEntity<Showtime> getById(String id) {
        return showtimeService.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<Map<String, String>> getAllNames() {
        return ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<Showtime> update(String id, Showtime entity) {
        if (!showtimeService.existsById(id)) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(showtimeService.update(id, entity));
    }

    @Override
    public ResponseEntity<Void> delete(String id) {
        if (!showtimeService.existsById(id)) return ResponseEntity.notFound().build();
        showtimeService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
