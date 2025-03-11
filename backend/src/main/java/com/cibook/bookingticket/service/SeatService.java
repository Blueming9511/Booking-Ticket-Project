package com.cibook.bookingticket.service;

import com.cibook.bookingticket.model.Seat;
import com.cibook.bookingticket.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SeatService {

    @Autowired
    private SeatRepository seatRepository;

    // Create a new seat
    public Seat createSeat(Seat seat) {
        return seatRepository.save(seat);
    }

    // Get all seats
    public List<Seat> getAllSeats() {
        return seatRepository.findAll();
    }

    // Get a seat by ID
    public Optional<Seat> getSeatById(String id) {
        return seatRepository.findById(id);
    }

    // Update a seat
    public Seat updateSeat(String id, Seat updatedSeat) {
        if (seatRepository.existsById(id)) {
            updatedSeat.setSeatID(id);
            return seatRepository.save(updatedSeat);
        }
        return null;
    }

    // Delete a seat
    public void deleteSeat(String id) {
        seatRepository.deleteById(id);
    }

    // Get seat by room id
    public List<Seat> getSeatsByRoomID(String roomID) {
        return seatRepository.findByRoomID(roomID);
    }
}
