package com.cibook.bookingticket.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document (collection = "notifications")
public class Notification {
    @Id
    private String notificationID;
    private String message;
    private Date dateSent;
    private String status;
    private String bookingDetailID;
    private String UserID;
}
