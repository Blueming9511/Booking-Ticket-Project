package com.cibook.bookingticket.observer;

import com.cibook.bookingticket.dto.BookingResponseDto;
import com.cibook.bookingticket.model.*;
import com.cibook.bookingticket.service.*;
import com.cibook.bookingticket.service.Email.EmailService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class EmailNotificationListener implements NotificationListener {
    private final UserService userService;
    private final EmailService emailService;
    private final BookingService bookingService;
    private final ShowtimeService showtimeService;
    private final MovieService movieService;
    private final CinemaService cinemaService;

    public EmailNotificationListener(UserService userService, EmailService emailService, BookingService bookingService, ShowtimeService showtimeService, MovieService movieService, CinemaService cinemaService) {
        this.userService = userService;
        this.emailService = emailService;
        this.bookingService = bookingService;
        this.showtimeService = showtimeService;
        this.movieService = movieService;
        this.cinemaService = cinemaService;
    }

    @Async
    @Override
    public void update(Notification.NotificationType type, String userId, String title, String content, Map<String, Object> data) {
        User user = userService.findById(userId).orElseThrow();
        if (user == null) {
            return;
        }
        Booking booking = (Booking) data.get("Booking");
        List<BookingDetail> bookingDetails = (List<BookingDetail>) data.get("BookingDetail");
        Payment payment = (Payment) data.get("Payment");
        Showtime showtime = (Showtime) data.get("Showtime");
        Movie movie = (Movie) data.get("Movie");
        Cinema cinema = (Cinema) data.get("Cinema");
        Coupon coupon = (Coupon) data.get("Coupon");
        BookingResponseDto bookingResponseDto = BookingResponseDto.builder()
                .booking(booking)
                .bookingDetail(bookingDetails)
                .coupon(coupon)
                .user(user)
                .movie(movie)
                .payment(payment)
                .showtime(showtime)
                .cinema(cinema)
                .build();
        emailService.sendOrderConfirmationEmail(user.getEmail(), bookingResponseDto);
    }
}
