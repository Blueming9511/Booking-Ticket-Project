package com.cibook.bookingticket.model;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookings")
public class Booking {
    @Id
    private String id;
    @Indexed(unique = true)
    private String bookingCode;
    private String userId;
    private String showTimeCode;
    private Double totalAmount;
    private String couponCode;
    private String owner;
    @Builder.Default
    private Double taxAmount = 0.1;
    @CreatedDate
    private LocalDateTime createdAt;
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;
    private String paymentUrl;
    private String txnRef;

    public enum BookingStatus {
        PENDING,
        APPROVED,
        CANCELLED,
        EXPIRED
    }

}
