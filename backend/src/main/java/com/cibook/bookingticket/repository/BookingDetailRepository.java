package com.cibook.bookingticket.repository;

import com.cibook.bookingticket.model.BookingDetail;
import org.springframework.data.mongodb.repository.MongoRepository;

<<<<<<< HEAD
=======
import java.util.List;
>>>>>>> front_end/notification_website

public interface BookingDetailRepository extends MongoRepository<BookingDetail, String> {

    List<BookingDetail> findByBookingId(String bookingId);
}
