package com.cibook.bookingticket.dto;

import org.springframework.data.mongodb.core.mapping.Field;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecentBookingsDto {
    @Field("movieTitle")
    private String movieTitle;
    @Field("customerName")
    private String customerName;
    private Double totalAmount;
    private String bookingDate;
    private String status;
    private String owner;

}
