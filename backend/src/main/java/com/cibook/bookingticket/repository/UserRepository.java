package com.cibook.bookingticket.repository;

import com.cibook.bookingticket.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository  extends MongoRepository<User, String> {
}
