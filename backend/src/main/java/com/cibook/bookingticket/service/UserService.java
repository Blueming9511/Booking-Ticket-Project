package com.cibook.bookingticket.service;

import com.cibook.bookingticket.model.User;
import com.cibook.bookingticket.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserByID(String id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

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
}
