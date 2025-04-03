package com.cibook.bookingticket.repository;

import com.cibook.bookingticket.model.Screen;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ScreenRepository extends MongoRepository<Screen, String> {
    Optional<Screen> findByScreenCode(String id);
}
