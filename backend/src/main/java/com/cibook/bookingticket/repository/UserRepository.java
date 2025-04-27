package com.cibook.bookingticket.repository;

import com.cibook.bookingticket.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository  extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<Object> findByPhoneNumber(String phoneNumber);
}
