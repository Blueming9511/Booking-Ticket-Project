package com.cibook.bookingticket.repository;

import com.cibook.bookingticket.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface NotificationRepository extends MongoRepository<Notification,String> {

}
