package com.cibook.bookingticket.repository;

import com.cibook.bookingticket.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PaymentRepository extends MongoRepository<Payment,String> {
    Optional<Payment> findByPaymentCode(String id);
}
