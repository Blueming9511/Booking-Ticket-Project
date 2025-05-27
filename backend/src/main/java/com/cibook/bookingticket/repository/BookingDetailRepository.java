package com.cibook.bookingticket.repository;

import com.cibook.bookingticket.model.BookingDetail;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BookingDetailRepository extends MongoRepository<BookingDetail, String> {
    List<BookingDetail> findByBookingId(String bookingId);
}
