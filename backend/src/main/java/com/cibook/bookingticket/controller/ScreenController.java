package com.cibook.bookingticket.controller;

import com.cibook.bookingticket.dto.ScreenLocationWithOptionsResponse;
import com.cibook.bookingticket.dto.ScreenRequestDto;
import com.cibook.bookingticket.dto.ScreenWithLocationDto;
import com.cibook.bookingticket.model.Screen;
import com.cibook.bookingticket.service.CinemaService;
import com.cibook.bookingticket.service.ScreenService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/screens")
public class ScreenController implements IController<Screen, String> {
    public final ScreenService screenService;
    private final CinemaService cinemaService;

    @Autowired
    public ScreenController(ScreenService screenService, CinemaService cinemaService) {
        this.screenService = screenService;
        this.cinemaService = cinemaService;
    }

    @Override
    public ResponseEntity<Screen> add(Screen entity) {
        return ResponseEntity.ok(screenService.add(entity));
    }

    @PostMapping("/v2")
    public ResponseEntity<Screen> createWithRequest(@RequestBody ScreenRequestDto dto) {
        Screen screen = screenService.addWithSeats(dto);
        return ResponseEntity.ok(screen);
    }

    @Override
    public ResponseEntity<Page<Screen>> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Screen> screens = screenService.findAll(pageable);
        return ResponseEntity.ok(screens);
    }

    @PutMapping("/v2/{id}")
    public ResponseEntity<Screen> updateWithDetail(@PathVariable("id") String id, @RequestBody ScreenRequestDto dto) {
        Screen screen = screenService.updateWithSeats(id, dto);
        return ResponseEntity.ok(screen);
    }
    @GetMapping("/v2/")
    public ResponseEntity<ScreenLocationWithOptionsResponse> findAllWithLocation(@RequestParam(name = "page", defaultValue = "0") int page,
                                                                                 @RequestParam(name = "size", defaultValue = "5") int size,
                                                                                 @RequestParam(name = "cinema", defaultValue = "") String cinema) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ScreenWithLocationDto> screens = screenService.getScreensWithLocation(pageable, cinema);
        Map<String, String> cinemaOptions = cinemaService.findAllNamesWithID();
        ScreenLocationWithOptionsResponse response = new ScreenLocationWithOptionsResponse();
        response.setCinemaOptions(cinemaOptions);
        response.setScreens(screens);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<Screen> getById(String id) {
        return screenService.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<Map<String, String>> getAllNames() {
        return ResponseEntity.ok(screenService.findAllNamesWithID());
    }

    @GetMapping("/v2/names")
    public ResponseEntity<Map<String, List<String>>> getAllNamesWithIDs() {
        return ResponseEntity.ok(screenService.findAllNamesWithIDs());
    }

    @Override
    public ResponseEntity<Screen> update(String id, Screen entity) {
        return ResponseEntity.ok(screenService.update(id, entity));
    }

    @Override
    public ResponseEntity<Void> delete(String id) {
        if (!screenService.existsById(id))
            return ResponseEntity.notFound().build();
        screenService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/types")
    public ResponseEntity<List<Screen.ScreenType>> getAllTypes() {
        return ResponseEntity.ok(screenService.findAllTypes());
    }

    @PostMapping("/many")
    public ResponseEntity<List<Screen>> addMany(@RequestBody List<Screen> entity) {
        return ResponseEntity.ok(screenService.addMany(entity));
    }

    @DeleteMapping("/many")
    public ResponseEntity<Void> deleteMany() {
        screenService.deleteAll();
        return ResponseEntity.ok().build();
    }
}
