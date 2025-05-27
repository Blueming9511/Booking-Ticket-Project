package com.cibook.bookingticket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor 
@NoArgsConstructor
public class ProductDashboardDto {
    private String title;
    private String sales;
    private String revenue;
}
