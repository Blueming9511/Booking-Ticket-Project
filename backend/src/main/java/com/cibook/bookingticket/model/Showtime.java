package com.cibook.bookingticket.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.sql.Time;
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

    private String date;
    private String startTime;
    private String endTime;
    private Double price;

    private String movieCode;
    private String screenCode;
    private String cinemaCode;

    private ShowTimeStatus status;

    public enum ShowTimeStatus {
        AVAILABLE,
        FULL,
    }
}
