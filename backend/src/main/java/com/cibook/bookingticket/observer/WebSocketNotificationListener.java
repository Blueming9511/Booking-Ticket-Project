package com.cibook.bookingticket.observer;

import com.cibook.bookingticket.model.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
@Component
@Service
public class WebSocketNotificationListener implements NotificationListener {
    private final SimpMessagingTemplate template;

    @Autowired
    public WebSocketNotificationListener(SimpMessagingTemplate template) {
        this.template = template;
    }
    @Override
    @Async
    public void update(Notification.NotificationType type, String userId, String title, String content, Map<String, Object> data) {
        Map<String, String> map = new HashMap<>();
        map.put("title", title);
        map.put("content", content);
        template.convertAndSend("/topic/notifications/" + userId, map);
    }
}
