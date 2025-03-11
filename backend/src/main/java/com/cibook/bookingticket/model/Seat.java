package com.cibook.bookingticket.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "seats")
public class Seat {
    @Id
    private String seatID;
    private String seatNumber;
    private String seatType;
    private String status;
    private String roomID; // Reference to Room
}
