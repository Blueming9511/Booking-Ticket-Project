package com.cibook.bookingticket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MovieGuestCarouselDto {
    private String id;
    private String title;
    private String thumbnail;
    private String[] genre;
    private Integer duration;
    private String trailer;
    private String description;
}
