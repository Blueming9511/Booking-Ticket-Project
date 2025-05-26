package com.cibook.bookingticket.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevenueDTO {
    private String period;
    private Double revenue;
    private Long orders;
}
