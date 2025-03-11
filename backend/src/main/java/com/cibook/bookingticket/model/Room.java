package com.cibook.bookingticket.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "rooms")
public class Room {
    @Id
    private String roomID;
    private String roomNumber; 
    private String roomType;
    private String status;
    private int numberOfSeats; 
    private String cinemaID; // Reference to Cinema
}
