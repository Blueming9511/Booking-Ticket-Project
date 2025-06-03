package com.cibook.bookingticket.controller;

import com.cibook.bookingticket.dto.ShowtimeResponseDto;
import com.cibook.bookingticket.model.Showtime;
import com.cibook.bookingticket.service.ShowtimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.Map;

@RestController
@RequestMapping("/api/showtimes")
@CrossOrigin(origins = "${frontend.url}")
public class ShowtimeController implements IController<Showtime, String> {
    private final ShowtimeService showtimeService;

    @Autowired
    public ShowtimeController(ShowtimeService showtimeService) {
        this.showtimeService = showtimeService;
    }

    @Override
    @PostMapping
    public ResponseEntity<Showtime> add(@RequestBody Showtime entity) {
        return ResponseEntity.ok(showtimeService.add(entity));
    }
    
    @Override
    @GetMapping
    public ResponseEntity<Page<Showtime>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Showtime> showtimes = showtimeService.findAll(pageable);
        return ResponseEntity.ok(showtimes);
    }

    @GetMapping("/v2")
    public ResponseEntity<Page<ShowtimeResponseDto>> getShowtimes(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "movie", required = false) String movie,
            @RequestParam(name = "status", required = false) String status
    ) throws ParseException {
        Pageable pageable = PageRequest.of(page, size);
        Page<ShowtimeResponseDto> showtimes = showtimeService.findAllShowtimes(pageable, null, movie, status, null, null, null, null);
        return ResponseEntity.ok(showtimes);
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<Showtime> getById(@PathVariable("id") String id) {
        return showtimeService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    @GetMapping("/names")
    public ResponseEntity<Map<String, String>> getAllNames() {
        return ResponseEntity.notFound().build();
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<Showtime> update(
            @PathVariable("id") String id,
            @RequestBody Showtime entity) {
        if (!showtimeService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(showtimeService.update(id, entity));
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") String id) {
        if (!showtimeService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        showtimeService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
