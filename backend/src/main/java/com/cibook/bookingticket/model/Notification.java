package com.cibook.bookingticket.model;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Builder
@Document (collection = "notifications")
public class Notification {
    @Id
    private String id;
    @Indexed(unique = true)
    private String notificationCode;
    private String userId;
    @Indexed
    private String title;
    private String message;
    @CreatedDate
    private Date dateSent;
    private boolean isRead;
    private NotificationType type;
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
