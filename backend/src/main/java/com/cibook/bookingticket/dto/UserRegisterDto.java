package com.cibook.bookingticket.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.index.Indexed;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRegisterDto {
    private String email;
    private String phoneNumber;
    private String name;
    private String password;
    private String avatar;
    private String role;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date dateOfBirth;
}
