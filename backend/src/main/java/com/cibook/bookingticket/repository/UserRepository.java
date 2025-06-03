package com.cibook.bookingticket.repository;

import com.cibook.bookingticket.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);

    Optional<Object> findByPhoneNumber(String phoneNumber);

    Optional<User> findByResetToken(String resetToken);

    Page<User> findAll(Pageable pageable);

    Optional<String> findEmailById(String id);

    Page<User> findByRole(String role, Pageable pageable);
}
