package com.cibook.bookingticket.scheduler;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.cibook.bookingticket.model.Booking;
import com.cibook.bookingticket.model.Notification;
import com.cibook.bookingticket.model.Showtime;
import com.cibook.bookingticket.observer.NotificationSubject;
import com.cibook.bookingticket.model.Booking.BookingStatus;
import com.cibook.bookingticket.repository.BookingRepository;
import com.cibook.bookingticket.service.BookingDetailService;
import com.cibook.bookingticket.service.SeatService;
import com.cibook.bookingticket.service.ShowtimeService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class BookingTimeoutScheduler {

    private final BookingRepository bookingRepository;
    private final SeatService seatService;
    private final ShowtimeService showtimeService;
    private final BookingDetailService bookingDetailService;
    private final NotificationSubject notificationSubject;

    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void cancelExpiredBookings() {
        LocalDateTime timeoutThreshold = LocalDateTime.now().minusMinutes(15);
        List<Booking> expiredBookings = bookingRepository.findByStatusAndCreatedAtBefore(
                BookingStatus.PENDING, timeoutThreshold);

        for (Booking booking : expiredBookings) {
            // 1. Update status booking -> CANCELLED
            booking.setStatus(BookingStatus.EXPIRED);
            bookingRepository.save(booking);

            // 2. Get all seats by booking detail
            List<String> seatCodes = bookingDetailService.getSeatCodesByBookingId(booking.getId());

            // 3. Update status seats back AVAILABLE
            Showtime showtime = showtimeService.findByCode(booking.getShowTimeCode()).orElse(null);
            if (showtime == null) {
                continue; // Skip if showtime not found
            }
            seatService.updateSeatStatus(seatCodes, showtime.getScreenCode(), showtime.getCinemaCode(), "AVAILABLE");

            // 4. Update showtime booked seats
            showtime.setBookedSeats(showtime.getBookedSeats() - seatCodes.size());

            // 5. Update booking status
            booking.setStatus(BookingStatus.CANCELLED);

            // 6. Notify user
            notificationSubject.notifyAll(
                    Notification.NotificationType.BOOKING_CANCELLED,
                    booking.getUserId(),
                    "Đơn đặt vé đã bị hủy!",
                    "Vé của bạn không được thanh toán trong thời gian quy định và đã bị hủy.",
                    Map.of("Booking", booking));
        }
    }
}
