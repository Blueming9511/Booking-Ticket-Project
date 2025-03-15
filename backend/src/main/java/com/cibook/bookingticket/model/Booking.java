package com.cibook.bookingticket.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "booking")
public class Booking {
    @Id
    private String bookingID;
    private double totalPrice;
    private String status;

    public Booking() {
    }

    public String getBookingID() {
        return this.bookingID;
    }

    public double getTotalPrice() {
        return this.totalPrice;
    }

    public String getStatus() {
        return this.status;
    }

    public void setBookingID(String bookingID) {
        this.bookingID = bookingID;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean equals(final Object o) {
        if (o == this) return true;
        if (!(o instanceof Booking)) return false;
        final Booking other = (Booking) o;
        if (!other.canEqual((Object) this)) return false;
        final Object this$bookingID = this.getBookingID();
        final Object other$bookingID = other.getBookingID();
        if (this$bookingID == null ? other$bookingID != null : !this$bookingID.equals(other$bookingID)) return false;
        if (Double.compare(this.getTotalPrice(), other.getTotalPrice()) != 0) return false;
        final Object this$status = this.getStatus();
        final Object other$status = other.getStatus();
        if (this$status == null ? other$status != null : !this$status.equals(other$status)) return false;
        return true;
    }

    protected boolean canEqual(final Object other) {
        return other instanceof Booking;
    }

    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final Object $bookingID = this.getBookingID();
        result = result * PRIME + ($bookingID == null ? 43 : $bookingID.hashCode());
        final long $totalPrice = Double.doubleToLongBits(this.getTotalPrice());
        result = result * PRIME + (int) ($totalPrice >>> 32 ^ $totalPrice);
        final Object $status = this.getStatus();
        result = result * PRIME + ($status == null ? 43 : $status.hashCode());
        return result;
    }

    public String toString() {
        return "Booking(bookingID=" + this.getBookingID() + ", totalPrice=" + this.getTotalPrice() + ", status=" + this.getStatus() + ")";
    }
}
