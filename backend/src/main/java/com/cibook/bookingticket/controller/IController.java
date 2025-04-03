package com.cibook.bookingticket.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

public interface IController<T, K> {
    @PostMapping
    ResponseEntity<T> add(@RequestBody T entity);

    @GetMapping
    ResponseEntity<List<T>> getAll();

    @GetMapping("/{id}")
    ResponseEntity<T> getById(@PathVariable("id") K id);

    @GetMapping("/names")
    ResponseEntity<Map<K, String>> getAllNames();

    @PutMapping("/{id}")
    ResponseEntity<T> update(@PathVariable("id") K id, @RequestBody T entity);

    @DeleteMapping("/{id}")
    ResponseEntity<Void> delete(@PathVariable("id") K id);
}