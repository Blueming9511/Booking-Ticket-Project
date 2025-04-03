package com.cibook.bookingticket.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "booking_details")
public class BookingDetail {
    @Id
    private String id;

    @Indexed(unique = true)
    private String bookingDetailCode;

    @DBRef
    private User user;

    @DBRef
    private Showtime showTime;

    @DBRef
    private List<Seat> seats;

    private double subTotal;
    private double discountAmount;
    private double taxAmount;
    private double totalAmount;

    @DBRef
    private Coupon coupon;

    @DBRef
    private Payment payment;

    @DBRef
    private Booking booking;

    @Indexed
    private BookingStatus status;


    public enum BookingStatus {
        PENDING, CONFIRMED, CANCELLED, COMPLETED
    }
}