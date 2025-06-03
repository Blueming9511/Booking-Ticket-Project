package com.cibook.bookingticket.observer;

import com.cibook.bookingticket.model.BookingDetail;
import com.cibook.bookingticket.model.Notification;

import java.util.Map;

public interface NotificationListener {
    void update(Notification.NotificationType type, String userId, String title, String content, Map<String, Object> data);
}
