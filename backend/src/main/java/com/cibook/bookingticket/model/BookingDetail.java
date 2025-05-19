package com.cibook.bookingticket.model;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@Document(collection = "booking_details")
public class BookingDetail {
    @Id
    private String id;
    private String userCode;
    private String bookingId;
    private String showTimeCode;
    private List<String> seatCode;
    private Double subTotal;
    private Double discountAmount;
    private Double taxAmount;
    private Double totalAmount;
    private String couponCode;
    private String paymentCode;
    private String bookingCode;

    private BookingStatus status;

    public enum BookingStatus {
        PENDING, CONFIRMED, CANCELLED, COMPLETED
    }
}