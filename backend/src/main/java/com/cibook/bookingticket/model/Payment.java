package com.cibook.bookingticket.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document (collection = "payment")
public class Payment {
    @Id
    private String paymentID;
    private String paymentMethod;
    private String Status;
    private double amount;
    private Date transactionDate;
    private String UserID;


}
