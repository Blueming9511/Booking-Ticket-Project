package com.cibook.bookingticket.model;

import lombok.Builder;
import lombok.Data;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@Document(collection = "booking_details")
public class BookingDetail {
    @Id
    private String id;
    private String bookingId;
    private String seatCode;
    private Double price;
}