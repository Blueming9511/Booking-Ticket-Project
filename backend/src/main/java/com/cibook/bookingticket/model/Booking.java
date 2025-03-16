package com.cibook.bookingticket.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Collection;

@Data
@Document (collection = "booking")
public class Booking {
    @Id
    private String bookingID;
    private double totalPrice;
    private String status;

}
