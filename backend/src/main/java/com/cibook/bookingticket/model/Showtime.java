package com.cibook.bookingticket.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "showtimes")
public class Showtime {
    @Id
    private String showTimeID;

    private String date;
    private String time;
    private double price;
    private String movieID;  // Reference to Movie
    private String cinemaID; // Reference to Cinema
}
