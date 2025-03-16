package com.cibook.bookingticket.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document (collection = "booking")
public class Booking {
    @Id
    private String bookingID;
    private double totalPrice;
    private String status;

}
