package com.cibook.bookingticket.repository;

import com.cibook.bookingticket.model.BookingDetail;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface BookingDetailRepository extends MongoRepository<BookingDetail, String> {

    List<BookingDetail> findByBookingCode(String bookingCode);
}
