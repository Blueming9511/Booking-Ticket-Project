package com.cibook.bookingticket.service;

import com.cibook.bookingticket.model.Seat;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScreenLayoutDefinition {
    private int totalRows; 
    private int totalColumns; 

    // Defines zones for specific seat types
    private List<SeatTypeZone> seatTypeZones;



    // Optional: Seats that physically don't exist
    private Set<String> unavailableSeatNumbers;


    // --- Inner classes for definitions ---
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SeatTypeZone {
        private Seat.SeatType type; // STANDARD, VIP, etc.
        private List<String> rows; // e.g., ["F", "G", "H"]
    }

}