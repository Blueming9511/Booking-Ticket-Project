package com.cibook.bookingticket.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cibook.bookingticket.dto.RevenueDTO;
import com.cibook.bookingticket.service.BookingService;
import com.cibook.bookingticket.service.MovieService;
import com.cibook.bookingticket.service.PaymentService;
import com.cibook.bookingticket.service.UserService;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final UserService userService;
    private final BookingService bookingService;
    private final PaymentService paymentService;
    private final MovieService movieService;

    public DashboardController(UserService userService, BookingService bookingService, PaymentService paymentService,
            MovieService movieService) {
        this.userService = userService;
        this.bookingService = bookingService;
        this.paymentService = paymentService;
        this.movieService = movieService;
    }

    // @GetMapping("/customers")
    // public ResponseEntity<?> getNewCustomers() {
    // return ResponseEntity.ok(userService.getUserStatAMonth());
    // }

    // @GetMapping("/orders")
    // public ResponseEntity<?> getNewOrders() {
    // return ResponseEntity.ok(bookingService.getOrderStatAMonth());
    // }

    // @GetMapping("/revenues")
    // public ResponseEntity<?> getNewRevenues() {
    // return ResponseEntity.ok(paymentService.getRevenueStatAMonth());
    // }

    // @GetMapping("/conversion-rate")
    // public ResponseEntity<?> getConversionRate() {
    // return ResponseEntity.ok(paymentService.getConversionRate());
    // }

    @GetMapping("/sales")
    public ResponseEntity<?> getSales() {
        Map<String, Object> response = new HashMap<>();
        response.put("newCustomers", userService.getUserStatAMonth());
        response.put("newOrders", bookingService.getOrderStatAMonth());
        response.put("revenues", paymentService.getRevenueStatAMonth());
        response.put("conversionRates", paymentService.getConversionRate());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/revenue")
    public List<RevenueDTO> getRevenue(@RequestParam String type) {
        switch (type.toLowerCase()) {
            case "monthly":
                return paymentService.getRevenueByMonth();
            case "quarterly":
                return paymentService.getRevenueByQuarter();
            case "weekly":
                return paymentService.getRevenueByWeek();
            case "yearly":
                return paymentService.getRevenueByYear();
            default:
                throw new IllegalArgumentException("Invalid revenue type");
        }
    }

    @GetMapping("/top-movies")
    public ResponseEntity<?> getTopProducts() {
        return ResponseEntity.ok(paymentService.getProductDashboardData());
    }

    @GetMapping("/top-cinemas")
    public ResponseEntity<?> getTopCinemas() {
        return ResponseEntity.ok(paymentService.getTopCinemas());
    }

    @GetMapping("/recent-bookings")
    public ResponseEntity<?> getRecentBookings() {
        return ResponseEntity.ok(paymentService.getRecentBookings());
    }

}
