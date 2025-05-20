package com.cibook.bookingticket.dto;

import com.cibook.bookingticket.model.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class BookingResponseDto {
   private Booking booking;
   private Showtime showtime;
   private Cinema cinema;
   private Movie movie;
   private User user;
   private Payment payment;
   private Coupon coupon;
   private List<BookingDetail> bookingDetail;
}
