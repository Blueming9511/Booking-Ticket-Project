package com.cibook.bookingticket.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingAdminDto {

    private String bookingCode;
    private LocalDateTime createdAt;
    private String status;
    private Double totalAmount;
    private Double taxAmount;

    private List<BookingDetailDto> bookingDetails;

    private UserDto user;
    private MovieDto movie;
    private ShowtimeDto showtime;

    @Data
    public static class BookingDetailDto {
        private String seatCode;
        private Double price;
    }

    @Data
    public static class UserDto {
        private String name;
        private String email;
        private String phoneNumber;    
    }

    @Data
    public static class MovieDto {
        private String title;
        private String thumbnail;
        private Integer duration; // phút
        private List<String> genre;
    }

    @Data
    public static class ShowtimeDto {
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private String screenCode;
        private String cinemaCode;
        private String owner;
    }
}
