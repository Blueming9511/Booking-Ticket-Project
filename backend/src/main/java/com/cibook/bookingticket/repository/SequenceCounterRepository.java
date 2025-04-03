package com.cibook.bookingticket.repository;

import com.cibook.bookingticket.model.SequenceCounter;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SequenceCounterRepository extends MongoRepository<SequenceCounter, String> {
}
