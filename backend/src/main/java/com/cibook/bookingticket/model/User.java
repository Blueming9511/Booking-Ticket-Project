package com.cibook.bookingticket.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Data
@Document (collection = "users")
@NoArgsConstructor
public class User {
    @Id
    private String id;

    @Indexed(unique = true)
    private String email;
    @Indexed(unique = true)
    private String phoneNumber;
    private String name;
    private String password;
    private String avatar;
    private Role role;
    private Date dateOfBirth;
    private String otp;
    private boolean verified;
    private String resetToken;
    private String resetCode;
    private LocalDateTime resetTokenExpiry;


    public enum Role {
        CUSTOMER,
        PROVIDER,
        ADMIN
    }
}
