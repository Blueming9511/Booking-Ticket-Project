package com.cibook.bookingticket.config;

import com.cibook.bookingticket.observer.EmailNotificationListener;
import com.cibook.bookingticket.observer.NotificationListener;
import com.cibook.bookingticket.observer.NotificationSubject;
import com.cibook.bookingticket.observer.WebSocketNotificationListener;
import com.cibook.bookingticket.repository.NotificationRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;

@Component
public class NotificationConfig {
    private final NotificationSubject notificationSubject;
    private final NotificationListener webSocketNotificationListener;
    private final NotificationListener emailNotificationListener;

    public NotificationConfig(NotificationSubject notificationSubject, @Qualifier("webSocketNotificationListener") NotificationListener webSocketNotificationListener, @Qualifier("emailNotificationListener")NotificationListener emailNotificationListener) {
        this.notificationSubject = notificationSubject;
        this.webSocketNotificationListener = webSocketNotificationListener;
        this.emailNotificationListener = emailNotificationListener;
    }

    @PostConstruct
    public void init() {
        notificationSubject.addListener(webSocketNotificationListener);
        notificationSubject.addListener(emailNotificationListener);
    }
}
