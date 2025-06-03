package com.cibook.bookingticket.observer;

import com.cibook.bookingticket.model.Notification;
import com.cibook.bookingticket.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class DBNotificationListener implements NotificationListener {
    private final NotificationRepository notificationRepository;

    @Autowired
    public DBNotificationListener(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }


    @Override
    public void update(Notification.NotificationType type, String userId, String title, String content, Map<String, Object> data) {
        Notification noti = Notification
                .builder()
                .userId(userId)
                .type(type)
                .title(title)
                .message(content)
                .build();
        notificationRepository.save(noti);
    }
}
