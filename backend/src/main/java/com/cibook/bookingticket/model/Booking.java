package com.cibook.bookingticket.model;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@Document(collection = "bookings")
public class Booking {
    @Id
    private String id;
    @Indexed(unique = true)
    private String bookingCode;
    private String userId;
    private String showTimeCode;
    private List<BookingDetail> bookingDetails;
    private Double totalAmount;
    private String couponCode;
    @Builder.Default
    private Double taxAmount = 0.1;
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;

    public enum BookingStatus {
        PENDING,
        CONFIRMED,
        CANCELED,
        EXPIRED
    }

}
