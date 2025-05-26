package com.cibook.bookingticket.service;

import com.cibook.bookingticket.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface UserServiceInterface {
    Optional<User> findById(String id);
    Optional<User> findByEmail(String email);
    User authenticate(String email, String password);
    User save(User user);
    void deleteById(String id);
    List<User> findAll();
    Page<User> findAll(Pageable pageable);
    Map<String, String> findAllNamesWithID();
    User update(String id, User entity);
    boolean existsById(String id);
} 