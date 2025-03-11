package com.cibook.bookingticket.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "movies")
public class Movie {
    @Id
    private String movieID; 
    
    private String title;
    private String director; 
    private String description; 
    private String cast; 
    private String poster; 
    private String trailer; 
    private String status; 
    private String genre; 
}
