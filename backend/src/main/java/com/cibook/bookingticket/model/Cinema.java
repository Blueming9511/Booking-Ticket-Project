package com.cibook.bookingticket.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "cinemas")
public class Cinema {
    @Id
    private String id;

    @Indexed(unique = true)
    private String cinemaCode;
    private String cinemaName;
    private String location;
    private Integer numberOfScreens;
    private String owner;

    @Indexed
    private CinemaStatus status;

    public enum CinemaStatus {
        OPEN,
        CLOSED,
        MAINTAINED
    }


}
