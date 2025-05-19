package com.cibook.bookingticket.model;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@Document (collection = "bookings")
public class Booking {
    @Id
    private String id;

    @Indexed(unique = true)
    private String BookingCode;
    private String userId;

    private double totalPrice;
    private LocalDateTime createdAt;
    private LocalDateTime expiredAt;
    private LocalDateTime cancelledAt;
}
