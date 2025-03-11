package com.cibook.bookingticket.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "cinemas")
public class Cinema {
    @Id
    private String cinemaID;
    
    private String cinemaName;
    private String address;
    private String NumberOfRooms;
}
