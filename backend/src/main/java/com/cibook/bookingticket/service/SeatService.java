package com.cibook.bookingticket.service;

import com.cibook.bookingticket.model.Seat;
import com.cibook.bookingticket.repository.SeatRepository;

import org.springframework.beans.BeanUtils;
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

    public Seat updateSeat(String id, Seat updatedSeat) {
        return seatRepository.findById(id).map(existingSeat -> {
            BeanUtils.copyProperties(updatedSeat, existingSeat, "seatID"); // Exclude ID
            return seatRepository.save(existingSeat); 
        }).orElse(null);
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
