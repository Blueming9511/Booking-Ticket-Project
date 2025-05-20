    package com.cibook.bookingticket.model;

    import lombok.Data;
    import org.springframework.data.annotation.Id;
    import org.springframework.data.mongodb.core.index.Indexed;
    import org.springframework.data.mongodb.core.mapping.DBRef;
    import org.springframework.data.mongodb.core.mapping.Document;

    @Data
    @Document(collection = "seats")

    public class Seat {
        @Id
        private String id;

        @Indexed
        private String seatCode;
        private String number;
        private SeatType type;
        private String row;
        private String screenCode;
        private String cinemaCode;
        private Double multiplier;
        private Double price;
        private SeatStatus status;

        public enum  SeatType {
            COUPLE,
            STANDARD,
            VIP
        }

        public enum SeatStatus {
            BOOKED,
            AVAILABLE,
            MAINTENANCE,
        }
    }
