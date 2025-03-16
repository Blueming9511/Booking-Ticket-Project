package com.cibook.bookingticket.service;

import com.cibook.bookingticket.model.Booking;
import com.cibook.bookingticket.repository.BookingRepository;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    // Create a new Booking
    public Booking createBooking(Booking Booking) {
        return bookingRepository.save(Booking);
    }

    // Get all Bookings
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Get a Booking by ID
    public Optional<Booking> getBookingById(String id) {
        return bookingRepository.findById(id);
    }

    // Update a Booking
    public Booking updateBooking(String id, Booking updatedBooking) {
        return bookingRepository.findById(id).map(existingBooking -> {
            BeanUtils.copyProperties(updatedBooking, existingBooking, "bookingID"); // Exclude ID
            return bookingRepository.save(existingBooking);
        }).orElse(null);
    }
    

    // Delete a Booking
    public void deleteBooking(String id) {
        bookingRepository.deleteById(id);
    }
}
