package com.cibook.bookingticket.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Data
@Document (collection = "users")
public class User {
    @Id
    private String userID;
    private String username;
    private String password;
    private String email;
    private String role;
    private String avatar;

    public User() {

    }
}