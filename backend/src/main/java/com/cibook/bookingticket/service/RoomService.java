package com.cibook.bookingticket.service;


import com.cibook.bookingticket.model.Room;
import com.cibook.bookingticket.repository.RoomRepository;
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

    // Update a room
    public Room updateRoom(String id, Room updatedRoom) {
        if (roomRepository.existsById(id)) {
            updatedRoom.setRoomID(id);
            return roomRepository.save(updatedRoom);
        }
        return null;
    }

    // Delete a room
    public void deleteRoom(String id) {
        roomRepository.deleteById(id);
    }

    
    public List<Room> getRoomsByCinemaID(String cinemaID) {
        return roomRepository.findByCinemaID(cinemaID);
    }
}
