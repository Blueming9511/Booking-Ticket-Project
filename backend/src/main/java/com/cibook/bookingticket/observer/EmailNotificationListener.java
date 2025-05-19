package com.cibook.bookingticket.observer;

import com.cibook.bookingticket.model.BookingDetail;
import com.cibook.bookingticket.model.Notification;
import com.cibook.bookingticket.service.BookingDetailService;
import com.cibook.bookingticket.service.Email.EmailService;
import com.cibook.bookingticket.service.UserService;
import org.springframework.scheduling.annotation.Async;

import java.util.Map;

public class EmailNotificationListener implements NotificationListener {
    private final UserService userService;
    private final EmailService emailService;
    public EmailNotificationListener(UserService userService, EmailService emailService) {
        this.userService = userService;
        this.emailService = emailService;
    }

    @Async
    @Override
    public void update(Notification.NotificationType type, String userId, String title, String content, Map<String, Object> data) {
        String userEmail = userService.findEmailUser(userId);
        if (userEmail == null) {return;}
        emailService.sendOrderConfirmationEmail(userEmail, (BookingDetail) data.get("bookingDetail"));
    }
}
