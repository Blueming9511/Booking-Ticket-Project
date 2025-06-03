package com.cibook.bookingticket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScreenWithLocationDto {
    private String id;
    private String screenCode;
    private int col;
    private int row;
    private String owner;
    private String type;
    private int capacity;
    private String status;
    private String cinemaCode;
    private String cinemaName;
    private String cinemaLocation;
}
