package com.cibook.bookingticket.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "seats")

public class Seat {
    @Id
    private String id;

    @Indexed
    private String seatCode;
    private String seatNumber;
    private String seatType;
    private String row;
    @DBRef
    private Screen screen;
    @DBRef
    private Cinema cinema;
    private double multiplier;
    private SeatStatus status;

    public enum SeatStatus {
        BOOKED,
        AVAILABLE,
        MAINTAINED
    }
}
