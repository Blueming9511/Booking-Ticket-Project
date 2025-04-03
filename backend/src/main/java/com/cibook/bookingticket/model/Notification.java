package com.cibook.bookingticket.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document (collection = "notifications")
public class Notification {
    @Id
    private String id;

    @Indexed(unique = true)
    private String notificationCode;

    @Indexed
    private String title;

    private String message;

    @CreatedDate
    private Date dateSent;

    @Indexed
    private NotificationStatus status;

    @DBRef
    private BookingDetail bookingDetail;

    @DBRef
    private User user;

    private NotificationType type;

    private boolean isRead;

    public enum NotificationStatus {
        SENT,
        DELIVERED,
        READ,
        FAILED
    }

    public enum NotificationType {
        BOOKING_CONFIRMATION,
        PAYMENT_SUCCESS,
        PAYMENT_FAILED,
        BOOKING_CANCELLED,
        SHOWTIME_REMINDER,
        PROMOTION,
        SYSTEM_ALERT
    }



}
