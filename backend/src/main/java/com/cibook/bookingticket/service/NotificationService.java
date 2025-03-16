package com.cibook.bookingticket.service;

import com.cibook.bookingticket.model.Notification;
import com.cibook.bookingticket.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;
    // Create a new Notification
    public Notification createNotification(Notification Notification) {
        return notificationRepository.save(Notification);
    }

    // Get all Notifications
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    // Get a Notification by ID
    public Optional<Notification> getNotificationById(String id) {
        return notificationRepository.findById(id);
    }

    // Update a Notification
    public Notification updateNotification(String id, Notification updatedNotification) {
        return notificationRepository.findById(id).map(existingNotification -> {
            if (updatedNotification.getMessage() != null) {
                existingNotification.setMessage(updatedNotification.getMessage());
            }
            if (updatedNotification.getDateSent() != null) {
                existingNotification.setDateSent(updatedNotification.getDateSent());
            }
            if (updatedNotification.getStatus() != null) {
                existingNotification.setStatus(updatedNotification.getStatus());
            }
            if (updatedNotification.getBookingDetailID() != null) {
                existingNotification.setBookingDetailID(updatedNotification.getBookingDetailID());
            }
            if (updatedNotification.getUserID() != null) {
                existingNotification.setUserID(updatedNotification.getUserID());
            }

            return notificationRepository.save(existingNotification);
        }).orElse(null);
    }





    // Delete a Notification
    public void deleteNotification(String id) {
        notificationRepository.deleteById(id);
    }
}
