package com.cibook.bookingticket.model;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Document (collection = "payments")
@Builder
public class Payment {
    @Id
    private String id;

    @Indexed(unique = true)
    private String paymentCode;

    private PaymentMethod method;
    private Double amount;
    @CreatedDate
    private LocalDateTime date;
    private String bookingID;
    @Builder.Default
    private PaymentStatus status = PaymentStatus.PENDING;

    public enum PaymentStatus {
        PENDING,
        APPROVED,
        REJECTED,
    }

    public enum PaymentMethod {
        BANK,
        MOMO,
        VISA
    }

}
