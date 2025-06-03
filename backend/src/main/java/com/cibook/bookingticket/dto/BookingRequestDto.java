package com.cibook.bookingticket.dto;

import com.cibook.bookingticket.model.Payment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingRequestDto {
    private String userId;
    private String showtimeId;
    private List<String> seats;
    private String paymentMethod;
    private String couponCode;
    private Double totalAmount;
}
