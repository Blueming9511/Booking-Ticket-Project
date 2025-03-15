package com.cibook.bookingticket.service;

import com.cibook.bookingticket.model.Booking;
import com.cibook.bookingticket.repository.BookingRepository;

import java.util.List;
import java.util.Optional;

public class BookingService {
    BookingRepository bookingRepository;

    public List<Booking> GetAllBooking() {
        return bookingRepository.findAll();
    }

    public void AddBooking(Booking booking) {
        bookingRepository.save(booking);
    }

    public Booking UpdateBooking(Booking booking) {
        Optional<Booking> existingBooking = bookingRepository.findById(booking.getBookingID());
        if (existingBooking != null) {
            Booking b = existingBooking.get();
            b.setTotalPrice(booking.getTotalPrice());
            b.setStatus(booking.getStatus());
            return b;
        }
        return null;
    }

    public void Delete(String id) {
        if(bookingRepository.existsById(id)) {
            bookingRepository.deleteById(id);
        }
    }

}
