package com.cibook.bookingticket.controller;

import com.cibook.bookingticket.model.Screen;
import com.cibook.bookingticket.service.ScreenService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/screens")
public class ScreenController implements IController<Screen, String> {
    public final ScreenService screenService;

    @Autowired
    public ScreenController(ScreenService screenService) {
        this.screenService = screenService;
    }

    @Override
    public ResponseEntity<Screen> add(Screen entity) {
        return ResponseEntity.ok(screenService.add(entity));
    }

    @Override
    public ResponseEntity<List<Screen>> getAll() {
        return ResponseEntity.ok(screenService.findAll());
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
    public ResponseEntity<List<String>> getAllTypes() {
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
