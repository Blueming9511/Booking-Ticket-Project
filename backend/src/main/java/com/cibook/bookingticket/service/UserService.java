package com.cibook.bookingticket.service;

import com.cibook.bookingticket.model.User;
import com.cibook.bookingticket.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    // Create a new User
    public User createUser(com.cibook.bookingticket.model.User User) {
        return userRepository.save(User);
    }

    // Get all Users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get a User by ID
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    // Update a User
    public User updateUser(User user) {
        if (userRepository.existsById((user.getUserID()))) {
            Optional<User> existingUser = userRepository.findById(user.getUserID());
            User u = existingUser.get();
            u.setUsername(u.getUsername());
            u.setEmail(user.getEmail());
            u.setPassword(user.getPassword());
            u.setRole(user.getRole());
            u.setAvatar(user.getAvatar());
            return u;
        }
        return null;
    }

    // Delete a User
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}
