package com.cibook.bookingticket.controller;

import com.cibook.bookingticket.model.Payment;
import com.cibook.bookingticket.model.Showtime;
import com.cibook.bookingticket.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController implements IController<Payment, String>{
    private final PaymentService paymentService;
    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
    @Override
    public ResponseEntity<Payment> add(Payment entity) {
        return ResponseEntity.ok().body(paymentService.add(entity));
    }

    @Override
    public ResponseEntity<Page<Payment>> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("paymentCode").ascending());
        Page<Payment> payments = paymentService.findAll(pageable);
        return ResponseEntity.ok(payments);
    }

    @Override
    public ResponseEntity<Payment> getById(String id) {
        return paymentService.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<Map<String, String>> getAllNames() {
       return ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<Payment> update(String id, Payment entity) {
        if (!paymentService.existsById(id)) return ResponseEntity.notFound().build();
        return ResponseEntity.ok().body(paymentService.update(id, entity));
    }

    @Override
    public ResponseEntity<Void> delete(String id) {
        if (!paymentService.existsById(id)) return ResponseEntity.notFound().build();
        paymentService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/all", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Payment>> getAllPayments(@RequestBody List<Payment> payments) {
        return ResponseEntity.ok().body(paymentService.addAll(payments));
    }

    @DeleteMapping("/all")
    public ResponseEntity<Void> deleteAllPayments() {
        paymentService.deleteAll();
        return ResponseEntity.ok().build();
    }
}
