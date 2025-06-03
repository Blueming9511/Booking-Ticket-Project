package com.cibook.bookingticket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CinemaDashboardDto {
    private String cinemaName;
    private Double revenue;
}
