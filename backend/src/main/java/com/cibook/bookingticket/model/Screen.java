package com.cibook.bookingticket.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "screens")
public class Screen {
    @Id
    private String id;

    @Indexed
    private String screenCode;

    @Indexed
    private String type;
    private int capacity;
    private String status;
    private String cinemaId;
}
