package com.cibook.bookingticket.dto;

import com.cibook.bookingticket.model.Screen;
import com.cibook.bookingticket.model.Seat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScreenRequestDto {
    private String id;
    private String screenCode;
    private String cinemaCode;
    private Integer col;
    private Integer row;
    private Integer capacity;
    private List<Seat> seats;
    private Screen.ScreenType type;
}
