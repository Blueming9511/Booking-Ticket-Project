package com.cibook.bookingticket.service;

import com.cibook.bookingticket.model.Payment;
import com.cibook.bookingticket.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;
    // Create a new Booking
    public Payment createBooking(Payment Booking) {
        return paymentRepository.save(Booking);
    }

    // Get all Bookings
    public List<Payment> getAllBookings() {
        return paymentRepository.findAll();
    }

    // Get a Booking by ID
    public Optional<Payment> getBookingById(String id) {
        return paymentRepository.findById(id);
    }

    // Update a Booking
    public Payment updateBooking(String id, Payment updatedBooking) {
        return paymentRepository.findById(id).map(existingPayment -> {
            existingPayment.setAmount(updatedBooking.getAmount());
            existingPayment.setPaymentMethod(updatedBooking.getPaymentMethod());
            existingPayment.setStatus(updatedBooking.getStatus());
            return paymentRepository.save(existingPayment);
        }).orElse(null);
    }

    // Delete a Booking
    public void deleteBooking(String id) {
        paymentRepository.deleteById(id);
    }
}
