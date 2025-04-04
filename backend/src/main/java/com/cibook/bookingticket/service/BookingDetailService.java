package com.cibook.bookingticket.service;

import com.cibook.bookingticket.model.Booking;
import com.cibook.bookingticket.model.BookingDetail;
import com.cibook.bookingticket.repository.BookingDetailRepository;
import com.cibook.bookingticket.repository.BookingRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class BookingDetailService implements IService<BookingDetail, String> {

    private final BookingDetailRepository bookingDetailRepository;
    private final BookingRepository bookingRepository;

    @Autowired
    public BookingDetailService(BookingDetailRepository bookingDetailRepository, BookingRepository bookingRepository) {
        this.bookingDetailRepository = bookingDetailRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public BookingDetail add(BookingDetail entity) {
        // Validate if Booking exists
        if (entity.getBooking() == null || entity.getBooking().getBookingCode() == null || entity.getBooking().getBookingCode().isEmpty()) {
            throw new IllegalArgumentException("Booking code cannot be null or empty.");
        }

        // Validate if the referenced Booking exists
        if (!bookingRepository.existsById(entity.getBooking().getId())) {
            throw new NoSuchElementException("Parent Booking with ID " + entity.getBooking().getId() + " does not exist.");
        }

        // Additional validation logic for other fields like User, Showtime, etc.
        if (entity.getUser() == null) {
            throw new IllegalArgumentException("User cannot be null.");
        }

        if (entity.getShowTime() == null) {
            throw new IllegalArgumentException("Showtime cannot be null.");
        }

        if (entity.getSeats() == null || entity.getSeats().isEmpty()) {
            throw new IllegalArgumentException("Seats cannot be null or empty.");
        }

        // Proceed with saving the BookingDetail if all validations pass
        return bookingDetailRepository.save(entity);
    }

    @Override
    public Optional<BookingDetail> findById(String id) {
        return bookingDetailRepository.findById(id);
    }

    @Override
    public Optional<BookingDetail> findByCode(String code) {
        return bookingDetailRepository.findByBookingDetailCode(code);
    }

    @Override
    public List<BookingDetail> findAll() {
        return bookingDetailRepository.findAll();
    }

    @Override
    public Map<String, String> findAllNamesWithID() {
        return bookingDetailRepository.findAll().stream()
                .collect(Collectors.toMap(BookingDetail::getId, BookingDetail::getBookingDetailCode));
    }

    @Override
    public BookingDetail update(String id, BookingDetail entity) {
        return bookingDetailRepository.findById(id).map(existing -> {
            entity.setId(existing.getId());
            entity.setBookingDetailCode(existing.getBookingDetailCode());
            return bookingDetailRepository.save(entity);
        }).orElseThrow(() -> new NoSuchElementException("BookingDetail not found with ID: " + id));
    }

    @Override
    public void deleteById(String id) {
        if (bookingDetailRepository.existsById(id)) {
            bookingDetailRepository.deleteById(id);
        } else {
            throw new NoSuchElementException("BookingDetail not found with ID: " + id);
        }
    }

    @Override
    public boolean existsById(String id) {
        return bookingDetailRepository.existsById(id);
    }



    public List<BookingDetail> findByBookingId(String bookingId) {
        log.info("Fetching booking details for booking ID: {}", bookingId);
        return bookingDetailRepository.findByBooking_Id(bookingId);
    }

    public Optional<BookingDetail> findDetailByIdAndBookingId(String detailId, String bookingId) {
        log.info("Fetching booking detail ID: {} for booking ID: {}", detailId, bookingId);

        return bookingDetailRepository.findById(detailId)
                .filter(detail -> detail.getBooking() != null &&
                        detail.getBooking().getId() != null &&
                        detail.getBooking().getId().equals(bookingId));
    }

}
