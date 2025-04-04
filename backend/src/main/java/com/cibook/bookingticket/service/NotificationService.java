package com.cibook.bookingticket.service;

import com.cibook.bookingticket.model.Coupon;
import com.cibook.bookingticket.model.Notification;
import com.cibook.bookingticket.repository.NotificationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
public class NotificationService implements IService<Notification, String>{
    NotificationRepository notificationRepo;

    @Autowired
    public NotificationService(NotificationRepository notificationRepo) {
        this.notificationRepo = notificationRepo;
    }



    @Override
    public Notification add(Notification entity) { // Changed Coupon to Notification
        log.info("NotificationService: Adding new notification");
        // Add any pre-processing logic if needed (e.g., setting timestamp)
        return notificationRepo.save(entity);
    }

    /**
     * Finds a notification by its ID.
     * NOTE: The signature MUST match the corrected interface IService<Notification, String>
     * @param id The ID of the notification.
     * @return An Optional containing the Notification if found, otherwise empty.
     */
    @Override
    public Optional<Notification> findById(String id) { // Changed Coupon to Notification
        log.info("NotificationService: Finding notification by ID {}", id);
        return notificationRepo.findById(id);
    }

    /**
     * Finds a notification by a specific code - THIS METHOD MAY NOT BE APPLICABLE.
     * Notifications usually don't have a unique 'code' like coupons.
     * Consider removing this or adapting it (e.g., findByRecipientAndType).
     * NOTE: The signature MUST match the corrected interface IService<Notification, String>
     * @param code The code to search for (meaning needs definition).
     * @return Optional containing Notification if found.
     */
    @Override
    public Optional<Notification> findByCode(String code) { // Changed Coupon to Notification
        log.warn("NotificationService: findByCode is likely not applicable for Notifications. Code: {}", code);
        // Implement specific logic if 'code' has meaning (e.g., find by a specific attribute)
        // Example: return notificationRepo.findBySomeUniqueAttribute(code);
        return Optional.empty(); // Default: Not applicable
    }

    /**
     * Finds all notifications. Consider adding pagination for large numbers.
     * NOTE: The signature MUST match the corrected interface IService<Notification, String>
     * @return A List of all Notifications.
     */
    @Override
    public List<Notification> findAll() { // Changed Coupon to Notification
        log.info("NotificationService: Finding all notifications");
        // Add sorting or filtering logic if needed
        return notificationRepo.findAll();
    }

    /**
     * Finds all "names" with IDs - THIS METHOD MAY NOT BE APPLICABLE.
     * Notifications don't typically have a "name" like Cinemas or a "code/description" pair like Coupons.
     * Consider removing this or adapting it (e.g., get message snippets by ID).
     * NOTE: The signature MUST match the corrected interface IService<Notification, String>
     * @return A Map (meaning needs definition).
     */
    @Override
    public Map<String, String> findAllNamesWithID() { // Kept K=String, but meaning is unclear
        log.warn("NotificationService: findAllNamesWithID is likely not applicable or needs redefinition for Notifications.");
        // Example adaptation: Return Map<ID, MessageSnippet>
        // return notificationRepo.findAll().stream()
        //        .collect(Collectors.toMap(
        //                Notification::getId,
        //                n -> n.getMessage().substring(0, Math.min(n.getMessage().length(), 50)) + "..." // Example: snippet
        //        ));
        return Map.of(); // Default: Not applicable
    }

    /**
     * Updates an existing notification. Often used to mark as read.
     * NOTE: The signature MUST match the corrected interface IService<Notification, String>
     * @param id The ID of the notification to update.
     * @param entity The Notification object with updated data.
     * @return The updated Notification object, or null if not found.
     */
    @Override
    public Notification update(String id, Notification entity) { // Changed Coupon to Notification
        log.info("NotificationService: Updating notification with ID {}", id);
        return notificationRepo.findById(id)
                .map(existingNotification -> {
                    entity.setId(existingNotification.getId());
                    return notificationRepo.save(entity);

                })
                .orElseGet(() -> {
                    log.warn("NotificationService: Update failed. Notification with ID {} not found.", id);
                    return null;
                });
    }

    /**
     * Deletes a notification by its ID.
     * @param id The ID of the notification to delete.
     */
    @Override
    public void deleteById(String id) {
        log.info("NotificationService: Deleting notification with ID {}", id);
        // Add checks if needed (e.g., authorization)
        notificationRepo.deleteById(id);
    }

    /**
     * Checks if a notification exists by its ID.
     * @param id The ID to check.
     * @return true if a notification with the given ID exists, false otherwise.
     */
    @Override
    public boolean existsById(String id) {
        log.info("NotificationService: Checking existence for notification with ID {}", id);
        return notificationRepo.existsById(id);
    }
}