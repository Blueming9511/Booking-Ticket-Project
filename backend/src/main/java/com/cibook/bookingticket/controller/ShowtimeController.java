package com.cibook.bookingticket.controller;

import com.cibook.bookingticket.dto.ShowtimeResponseDto;
import com.cibook.bookingticket.model.Showtime;
import com.cibook.bookingticket.service.ShowtimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
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
    public ResponseEntity<Page<Showtime>> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Showtime> showtimes = showtimeService.findAll(pageable);
        return ResponseEntity.ok(showtimes);
    }

    @GetMapping("/v2/")
    public ResponseEntity<Page<ShowtimeResponseDto>> getShowtimes(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name ="size", defaultValue = "5") int size,
            @RequestParam(name = "movie", defaultValue = "") String movie,
            @RequestParam(name = "status", defaultValue = "") String status
    ) throws ParseException {
        Pageable pageable = PageRequest.of(page, size);
        Page<ShowtimeResponseDto> showtimes = showtimeService.findAllShowtimes(pageable, null, movie, status);
        return ResponseEntity.ok(showtimes);
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
