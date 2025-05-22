package com.cibook.bookingticket.dto;

import com.cibook.bookingticket.model.Showtime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ShowtimeResponseDto {
    private String id;
    private String showTimeCode;
    private String movieCode;
    private String movieTitle;
    private int movieDuration;
    private String movieThumbnail;
    private Double movieRating;
    private String cinemaCode;
    private String cinemaLocation;
    private String screenCode;
    private Date startTime;
    private Date endTime;
    private Double price;
    private int seats;
    private int bookedSeats;
    private Showtime.ShowTimeStatus status;
}
