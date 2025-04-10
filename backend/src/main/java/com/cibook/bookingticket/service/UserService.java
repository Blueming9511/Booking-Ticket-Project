package com.cibook.bookingticket.service;

import com.cibook.bookingticket.model.User; // Assuming you have a User model
import com.cibook.bookingticket.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
// Import PasswordEncoder if handling password hashing here
// import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Optional: If combining multiple repo calls

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class UserService implements IService<User, String> {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        // Assign PasswordEncoder if injecting: this.passwordEncoder = passwordEncoder;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Adds a new user. Handles basic checks for existing username/email.
     * IMPORTANT: Assumes password hashing is done BEFORE calling this method
     * or inject PasswordEncoder and hash here.
     *
     * @param entity The User object to add.
     * @return The saved User object.
     * @throws IllegalArgumentException if username or email already exists.
     */
    @Override
    public User add(User entity) {

        // Check for existing username
        userRepository.findByUsername(entity.getUsername()).ifPresent(existing -> {
            log.warn("Attempted to add user with existing username: {}", entity.getUsername());
            throw new IllegalArgumentException("Username already exists: " + entity.getUsername());
        });

        // Check for existing email
        userRepository.findByEmail(entity.getEmail()).ifPresent(existing -> { // Assuming getEmail exists
            log.warn("Attempted to add user with existing email: {}", entity.getEmail());
            throw new IllegalArgumentException("Email already exists: " + entity.getEmail());
        });

        // *** PASSWORD HASHING  ***
        log.debug("Password before encoding: {}", entity.getPassword());
        entity.setPassword(passwordEncoder.encode(entity.getPassword()));
        log.debug("Password after encoding: {}", entity.getPassword());

        return userRepository.save(entity);
    }



    /**
     * Finds a user by their ID.
     *
     * @param id The ID of the user.
     * @return An Optional containing the User if found, otherwise empty.
     */
    @Override
    public Optional<User> findById(String id) {
        log.info("UserService: Finding user by ID {}", id);
        return userRepository.findById(id);
    }


    @Override
    public Optional<User> findByCode(String username) {
        log.info("UserService: Finding user by Code (interpreted as Username): {}", username);
        return userRepository.findByUsername(username);
    }

    // Consider adding specific findByEmail/findByUsername methods if needed directly by controllers
    public Optional<User> findByEmail(String email) {
        log.info("UserService: Finding user by Email: {}", email);
        return userRepository.findByEmail(email);
    }


    /**
     * Finds all users. CAUTION: May return large amounts of data. Consider pagination.
     *
     * @return A List of all Users.
     */
    @Override
    public List<User> findAll() {
        log.info("UserService: Finding all users");
        return userRepository.findAll();
    }


    @Override
    public Map<String, String> findAllNamesWithID() {
        log.info("UserService: Finding all user IDs and usernames");
        return userRepository.findAll().stream()
                .collect(Collectors.toMap(
                        User::getId,
                        User::getUsername,
                        (existingValue, newValue) -> existingValue
                ));
    }


    @Override
    @Transactional
    public User update(String id, User entity) {
        if (!existsById(id)) return null;
        User user = findById(id).orElse(null);
        entity.setId(user.getId());
        return userRepository.save(entity);
    }

    /**
     * Deletes a user by their ID.
     *
     * @param id The ID of the user to delete.
     */
    @Override
    public void deleteById(String id) {
        log.info("UserService: Deleting user with ID {}", id);
        userRepository.deleteById(id);
    }


    @Override
    public boolean existsById(String id) {
        log.info("UserService: Checking existence for user with ID {}", id);
        return userRepository.existsById(id);
    }
}