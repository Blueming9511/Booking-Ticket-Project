package com.cibook.bookingticket.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "sequence_counters")
public class SequenceCounter {
    @Id
    private String key;
    private int value;

    public SequenceCounter(String key, int value) {
        this.key = key;
        this.value = value;
    }

    public SequenceCounter() {

    }
}
