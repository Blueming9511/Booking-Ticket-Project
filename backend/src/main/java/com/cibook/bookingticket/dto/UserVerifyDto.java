package com.cibook.bookingticket.dto;

import lombok.Data;

@Data
public class UserVerifyDto {
    public String email;
    public String otp;
}
