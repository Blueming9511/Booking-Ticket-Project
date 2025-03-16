package com.cibook.bookingticket.repository;

import com.cibook.bookingticket.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PaymentRepository extends MongoRepository<Payment,String> {
}
