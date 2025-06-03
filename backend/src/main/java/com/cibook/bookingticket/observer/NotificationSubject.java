package com.cibook.bookingticket.observer;

import com.cibook.bookingticket.model.Notification;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class NotificationSubject {
    private List<NotificationListener> listeners = new ArrayList<>();

    public void addListener(NotificationListener listener) {
        listeners.add(listener);
    }

    public void notifyAll(Notification.NotificationType type, String userId, String title, String content, Map<String, Object> data) {
        for (NotificationListener listener : listeners) {
            listener.update(type, userId, title, content, data);
        }
    }
}
