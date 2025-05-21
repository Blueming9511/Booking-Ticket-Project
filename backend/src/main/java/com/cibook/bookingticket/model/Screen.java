package com.cibook.bookingticket.model;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "screens")
@Builder
public class Screen {
    @Id
    private String id;

    @Indexed
    private String screenCode;

    @Indexed
    private ScreenType type;
    private int col;
    private int row;
    private int capacity;
    private String cinemaCode;
    @Builder.Default
    private ScreenStatus status = ScreenStatus.ACTIVE;

    public enum ScreenType {
        STANDARD("Standard"),
        FOUR_DX("4DX"),
        IMAX("IMAX"),
        DELUXE("Deluxe"),
        PREMIUM("Premium"),
        THREE_D("3D");

        private final String displayName;

        ScreenType(String displayName) {
            this.displayName = displayName;
        }
    }

    public enum ScreenStatus {
        ACTIVE,
        FULL,
        INACTIVE,
    }
}
