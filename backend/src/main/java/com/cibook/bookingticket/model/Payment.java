package com.cibook.bookingticket.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document (collection = "payments")

public class Payment {
    @Id
    private String id;

    @Indexed(unique = true)
    private String paymentCode;

    private PaymentMethod method;
    private double amount;
    private Date date;
    private String UserID;

    private PaymentStatus status;

    public enum PaymentStatus {
        PENDING,
        APPROVED,
        REJECTED,
    }

    public enum PaymentMethod {
        VNPAY,
        MOMO,
        VISA,
        BANK
    }



}
