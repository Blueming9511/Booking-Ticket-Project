package com.cibook.bookingticket.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.sql.Time;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;

@Data
@Document(collection = "showtimes")
public class Showtime {
    @Id
    private String id;

    @Indexed(unique = true)
    private String showTimeCode;

//    private Date date;
//    private Time startTime;
//    private Time endTime;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime startTime;

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime endTime;



    private Double price;
    @DBRef
    private Movie movie;

    private String movieCode;
    private String screenCode;
    private String cinemaCode;

    private ShowTimeStatus status;

    public enum ShowTimeStatus {
        AVAILABLE,
        FULL,
    }


}
