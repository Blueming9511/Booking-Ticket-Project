package com.cibook.bookingticket.service;

import com.cibook.bookingticket.model.Room;
import com.cibook.bookingticket.repository.RoomRepository;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    // Create a new room
    public Room createRoom(Room room) {
        return roomRepository.save(room);
    }

    // Get all rooms
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    // Get a room by ID
    public Optional<Room> getRoomById(String id) {
        return roomRepository.findById(id);
    }

    public Room updateRoom(String id, Room updatedRoom) {
        return roomRepository.findById(id).map(existingRoom -> {
            BeanUtils.copyProperties(updatedRoom, existingRoom, "roomID"); // Exclude ID
            return roomRepository.save(existingRoom); // Save updated room
        }).orElse(null);
    }

    // Delete a room
    public void deleteRoom(String id) {
        roomRepository.deleteById(id);
    }

    public List<Room> getRoomsByCinemaID(String cinemaID) {
        return roomRepository.findByCinemaID(cinemaID);
    }
}
