package com.cibook.bookingticket.controller;

// Import the specific Model and Service
import com.cibook.bookingticket.model.Notification;
import com.cibook.bookingticket.model.Showtime;
import com.cibook.bookingticket.service.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*; // Needed for annotations defined in IController + RequestMapping

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications") // *** CORRECTED MAPPING for Notifications ***
// Implement the generic interface with specific types Notification and String (assuming ID is String)
public class NotificationController implements IController<Notification, String> {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }


    @Override
    public ResponseEntity<Notification> add(@RequestBody Notification entity) {
        Notification savedNotification = notificationService.add(entity);
        return ResponseEntity.ok(savedNotification);
    }

    @Override
    public ResponseEntity<Page<Notification>> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notifications = notificationService.findAll(pageable);
        return ResponseEntity.ok(notifications);
    }


    @Override
    public ResponseEntity<Notification> getById(@PathVariable("id") String id) {
        return notificationService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Retrieves "names" for all notifications - Applicability is questionable for Notifications.
     * Endpoint: GET /api/notifications/names
     * The meaning depends entirely on the NotificationService.findAllNamesWithID() implementation.
     */
    @Override
    public ResponseEntity<Map<String, String>> getAllNames() {
        // Note: This endpoint's usefulness depends on how findAllNamesWithID is implemented
        // in the NotificationService. It might return ID -> Message Snippet, or something else.
        Map<String, String> namesMap = notificationService.findAllNamesWithID();
        return ResponseEntity.ok(namesMap);
    }


    @Override
    public ResponseEntity<Notification> update(@PathVariable("id") String id, @RequestBody Notification entity) {
        Notification updatedNotification = notificationService.update(id, entity);
        if (updatedNotification != null) {
            return ResponseEntity.ok(updatedNotification);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @Override
    public ResponseEntity<Void> delete(@PathVariable("id") String id) {
        if (!notificationService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        notificationService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}