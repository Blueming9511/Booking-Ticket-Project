    package com.cibook.bookingticket.model;

    import lombok.Builder;
    import lombok.Data;
    import org.springframework.data.annotation.Id;
    import org.springframework.data.mongodb.core.index.Indexed;
    import org.springframework.data.mongodb.core.mapping.Document;

    @Data
    @Document(collection = "seats")
    @Builder
    public class Seat {
        @Id
        private String id;

        @Indexed
        private String seatCode;
        private String number;
        @Builder.Default
        private SeatType type = SeatType.STANDARD;
        private String row;
        private String screenCode;
        private String cinemaCode;
        @Builder.Default
        private Double multiplier = 1.0;
        @Builder.Default
        private SeatStatus status = SeatStatus.AVAILABLE;

        public enum  SeatType {
            COUPLE,
            STANDARD,
            VIP,
            DISABLED
        }

        public enum SeatStatus {
            BOOKED,
            AVAILABLE,
            MAINTENANCE,
        }
    }
