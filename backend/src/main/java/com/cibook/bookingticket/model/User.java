package com.cibook.bookingticket.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Document (collection = "users")
@AllArgsConstructor
@Builder
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
    
    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
    @Builder.Default
    private boolean isBan = false;

    public enum Role {
        CUSTOMER,
        PROVIDER,
        ADMIN
    }
}
