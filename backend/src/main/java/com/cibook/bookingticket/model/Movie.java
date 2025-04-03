package com.cibook.bookingticket.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

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
    private Float rating;
    private Integer duration;
    private String language;
    private Float budget;
    private Float boxOffice;
    private String[] casts;
    private String releasedBy;
    private String releaseDate;
    private String endDate;
    private String trailer;
    private String description;
    private MovieStatus status;

    public enum MovieStatus {
        INCOMING,
        NOW_SHOWING,
        CLOSED,
        POSTPONE
    }
}