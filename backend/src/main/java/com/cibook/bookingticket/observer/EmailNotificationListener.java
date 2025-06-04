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
    private final BookingDetailService bookingDetailService;
    private final PaymentService paymentService;
    private final CouponService couponService;

    public EmailNotificationListener(UserService userService, EmailService emailService, BookingService bookingService,
            ShowtimeService showtimeService, MovieService movieService, CinemaService cinemaService,
            BookingDetailService bookingDetailService, PaymentService paymentService, CouponService couponService) {
        this.couponService = couponService;
        this.paymentService = paymentService;
        this.bookingDetailService = bookingDetailService;
        this.userService = userService;
        this.emailService = emailService;
        this.bookingService = bookingService;
        this.showtimeService = showtimeService;
        this.movieService = movieService;
        this.cinemaService = cinemaService;
    }

    @Async
    @Override
    public void update(Notification.NotificationType type, String userId, String title, String content,
            Map<String, Object> data) {
        Booking booking = (Booking) data.get("booking");
        System.out.println("USERID: " + booking);
        User user = userService.findById(booking.getUserId()).orElseThrow();
        if (user == null) {
            return;
        }
        System.out.println("Sending email notification to user: " + user.getEmail());
        List<BookingDetail> bookingDetails = bookingDetailService.findByBookingId(booking.getId());
        Showtime showtime = showtimeService.findByCode(booking.getShowTimeCode()).orElseThrow();
        Movie movie = movieService.findByCode(showtime.getMovieCode()).orElseThrow();
        Cinema cinema = cinemaService.findByCode(showtime.getCinemaCode()).orElseThrow();
        Coupon coupon = booking.getCouponCode() != null ? couponService.findByCode(booking.getCouponCode()).orElse(null)
                : null;
        Payment payment = paymentService.findByBookingId(booking.getId()).orElseThrow();
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
        System.out.println("BookingResponseDto: " + bookingResponseDto);
        emailService.sendOrderConfirmationEmail(user.getEmail(), bookingResponseDto);
        System.out.println("Email notification sent to: " + user.getEmail());
    }
}
