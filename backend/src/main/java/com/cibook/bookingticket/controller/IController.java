package com.cibook.bookingticket.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

public interface IController<T, K> {
    @PostMapping
    ResponseEntity<T> add(@RequestBody T entity);

    @GetMapping
    ResponseEntity<Page<T>> getAll(@RequestParam(name = "page", defaultValue = "0") int page,
                                   @RequestParam(name = "size", defaultValue = "10") int size);

    @GetMapping("/{id}")
    ResponseEntity<T> getById(@PathVariable("id") K id);

    @GetMapping("/names")
    ResponseEntity<Map<K, String>> getAllNames();

    @PutMapping("/{id}")
    ResponseEntity<T> update(@PathVariable("id") K id, @RequestBody T entity);

    @DeleteMapping("/{id}")
    ResponseEntity<Void> delete(@PathVariable("id") K id);
}