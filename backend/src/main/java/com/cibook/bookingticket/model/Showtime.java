package com.cibook.bookingticket.model;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data
@Document(collection = "showtimes")
@Builder
public class Showtime {
    @Id
    private String id;

    @Indexed(unique = true)
    private String showTimeCode;

    private Date startTime;
    private Date endTime;
    private Double price;

    private String movieCode;
    private String screenCode;
    private String cinemaCode;

    private String owner;

    private Integer seats;
    @Builder.Default
    private Integer bookedSeats = 0;
    @Builder.Default
    private ShowTimeStatus status = ShowTimeStatus.AVAILABLE;

    public enum ShowTimeStatus {
        PENDING,
        APPROVED,
        REJECTED,
        MAINTAINED,
        CLOSED,
        IN_COMING,
        AVAILABLE,
        FULL,
    }
}
