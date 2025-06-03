package com.cibook.bookingticket.controller;

import com.cibook.bookingticket.model.User;
import com.cibook.bookingticket.repository.UserRepository;
import com.cibook.bookingticket.service.BookingDetailService;
import com.cibook.bookingticket.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController implements IController<User, String> {
    private static final Logger log = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    @Autowired
    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
    }

    @Override
    public ResponseEntity<User> add(User entity) {
        try {
            User savedUser = userService.add(entity);
            savedUser.setPassword("[PROTECTED]");
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            log.error("Error adding user", e);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error adding user: " + e.getMessage(),
                    e
            );
        }
    }

    @Override
    public ResponseEntity<Page<User>> getAll(int page, int size) {
        log.info("UserService: Finding all users (paginated)");
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userService.findAll(pageable);
        return ResponseEntity.ok(users);
    }

    @Override
    public ResponseEntity<User> getById(String id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<Map<String, String>> getAllNames() {
        Map<String, String> namesMap = userService.findAllNamesWithID();
        return ResponseEntity.ok(namesMap);
    }

    @Override
    public ResponseEntity<User> update(String id, User entity) {
        return ResponseEntity.ok(userService.update(id, entity));
    }

    @Override
    public ResponseEntity<Void> delete(String id) {
        if (!userService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
