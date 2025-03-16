package com.cibook.bookingticket.controller;

import com.cibook.bookingticket.model.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/users")
public class UserController {
    @GetMapping("/")
    public List<User>  getAllUsers() {
        return null;
    }
}
