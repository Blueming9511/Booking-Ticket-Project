package com.cibook.bookingticket.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "movies")
public class Movie {
    @Id
    private String id;

    @Indexed(unique = true)
    private String movieCode;

    private String thumbnail;
    private String title;

    private String[] genre;

    private Integer releaseYear;
    private String director;
    private Double rating;
    private Integer duration;
    private String language;
    private Double budget;
    private Double boxOffice;
    private String[] casts;
    private String releasedBy;
    private String releaseDate;
    private String endDate;
    private String trailer;
    private String description;
    private String status;

    private String owner;

    public enum MovieStatus {
        PENDING,
        APPROVED,
        COMMING_SOOM,
        NOW_SHOWING,
        CLOSED,
        POSTPONE
    }
}