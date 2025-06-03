package com.cibook.bookingticket.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.cibook.bookingticket.dto.BookingAdminDto;
import com.cibook.bookingticket.dto.RevenueDTO;
import com.cibook.bookingticket.dto.ScreenRequestDto;
import com.cibook.bookingticket.dto.ShowtimeResponseDto;
import com.cibook.bookingticket.model.*;
import com.cibook.bookingticket.security.CustomUserDetails;
import com.cibook.bookingticket.service.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/provider")
public class ProviderController {
    private final BookingService bookingService;
    private final MovieService movieService;
    private final CinemaService cinemaService;
    private final ScreenService screenService;
    private final PaymentService paymentService;
    private final ShowtimeService showtimeService;
    private final CouponService couponService;

    public ProviderController(BookingService bookingService, MovieService movieService, CinemaService cinemaService,
            ScreenService screenService, PaymentService paymentService, ShowtimeService showtimeService,
            CouponService couponService) {
        this.bookingService = bookingService;
        this.movieService = movieService;
        this.cinemaService = cinemaService;
        this.screenService = screenService;
        this.paymentService = paymentService;
        this.showtimeService = showtimeService;
        this.couponService = couponService;
    }

    // Dashboard endpoints
    @GetMapping("/dashboard/sales")
    public ResponseEntity<?> getSales(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (!isProvider(userDetails)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }
        String providerName = userDetails.getName();
        Map<String, Object> response = new HashMap<>();
        response.put("newOrders", bookingService.getOrderStatAMonth());
        response.put("revenues", paymentService.getRevenueStatAMonth());
        response.put("conversionRates", paymentService.getConversionRate());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard/revenue")
    public ResponseEntity<?> getRevenue(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam String type) {
        if (!isProvider(userDetails)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }
        List<RevenueDTO> revenue;
        switch (type.toLowerCase()) {
            case "monthly":
                revenue = paymentService.getRevenueByMonth();
                break;
            case "quarterly":
                revenue = paymentService.getRevenueByQuarter();
                break;
            case "weekly":
                revenue = paymentService.getRevenueByWeek();
                break;
            case "yearly":
                revenue = paymentService.getRevenueByYear();
                break;
            default:
                return ResponseEntity.badRequest().body("Invalid revenue type");
        }
        return ResponseEntity.ok(revenue);
    }

    // Cinema endpoints
    @GetMapping("/cinemas")
    public ResponseEntity<?> getCinemas(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "address", required = false) String address,
            @RequestParam(name = "status", required = false) String status) {
        if (!isProvider(userDetails)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }
        String providerName = userDetails.getName();
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(cinemaService.findAllWithOwner(pageable, providerName, address, status));
    }

    @PostMapping("/cinemas")
    public ResponseEntity<?> addCinema(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody Cinema cinema) {
        if (!isProvider(userDetails)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }
        cinema.setOwner(userDetails.getName());
        return ResponseEntity.ok(cinemaService.add(cinema));
    }

    @PutMapping("/cinemas/{id}")
    public ResponseEntity<?> updateCinema(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String id,
            @RequestBody Cinema cinema) {
        if (!isProvider(userDetails)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }
        cinema.setOwner(userDetails.getName());
        return ResponseEntity.ok(cinemaService.update(id, cinema));
    }

    // Movie endpoints
    @GetMapping("/movies")
    public ResponseEntity<?> getMovies(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "title", required = false) String title) {
        if (!isProvider(userDetails)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }
        String providerName = userDetails.getName();
        Pageable pageable = PageRequest.of(page, size);

        return ResponseEntity.ok(movieService.findAllWithOwner(pageable, providerName, status, title));
    }

    @PostMapping("/movies")
    public ResponseEntity<?> addMovie(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody Movie movie) {
        if (!isProvider(userDetails)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }
        movie.setOwner(userDetails.getName());
        return ResponseEntity.ok(movieService.add(movie));
    }

    @PutMapping("/movies/{id}")
    public ResponseEntity<?> updateMovie(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String id,
            @RequestBody Movie movie) {
        if (!isProvider(userDetails)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }
        movie.setOwner(userDetails.getName());
        return ResponseEntity.ok(movieService.update(id, movie));
    }

    @GetMapping("/cinemaOptions")
    public Map<String, String> getCinemaOptions() {
        return cinemaService.findAllNamesWithID();
    }

    // Screen endpoints 
    @GetMapping("/screens")
    public ResponseEntity<?> getScreens(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "cinema", required = false) String cinema,
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "type", required = false) String type) {
        if (!isProvider(userDetails)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }
        String providerName = userDetails.getName();
        System.out.println(providerName);
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(screenService.getScreensWithLocation(pageable, cinema, providerName, null, status, type));
    }

    @PostMapping("/screens")
    public ResponseEntity<?> addScreen(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody ScreenRequestDto screenRequest) {
        if (!isProvider(userDetails)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }
        return ResponseEntity.ok(screenService.addWithSeats(screenRequest));
    }

    @PutMapping("/screens/{id}")
    public ResponseEntity<?> updateScreen(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String id,
            @RequestBody ScreenRequestDto screenRequest) {
        if (!isProvider(userDetails)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }
        return ResponseEntity.ok(screenService.updateWithSeats(id, screenRequest));
    }

    // Showtime endpoints
    @GetMapping("/showtimes")
    public ResponseEntity<?> getShowtimes(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "movie", required = false) String movie,
            @RequestParam(name = "status", required = false) String status) {
        if (!isProvider(userDetails)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }
        String providerName = userDetails.getName();
        Pageable pageable = PageRequest.of(page, size);
        System.out.println("Provider name: " + providerName);
        try {
            Page<ShowtimeResponseDto> showtimes = showtimeService.findAllShowtimes(
                    pageable, providerName, movie, status, null, null, null, null, null);
            return ResponseEntity.ok(showtimes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/showtimes")
    public ResponseEntity<?> addShowtime(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody Showtime showtime) {
        if (!isProvider(userDetails)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }
        showtime.setOwner(userDetails.getName());
        return ResponseEntity.ok(showtimeService.add(showtime));
    }

    @PutMapping("/showtimes/{id}")
    public ResponseEntity<?> updateShowtime(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String id,
            @RequestBody Showtime showtime) {
        if (!isProvider(userDetails)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }
        showtime.setOwner(userDetails.getName());
        return ResponseEntity.ok(showtimeService.update(id, showtime));
    }

    // Booking endpoints
    @GetMapping("/bookings")
    public ResponseEntity<?> getBookings(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "movie", required = false) String movie) {
        if (!isProvider(userDetails)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }
        String providerName = userDetails.getName();
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(bookingService.findAllBooking(pageable, providerName, status, movie));
    }

    // Payment endpoints
    @GetMapping("/payments")
    public ResponseEntity<?> getPayments(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "method", required = false) String method,
            @RequestParam(name = "maxPrice", required = false) Double maxPrice,
            @RequestParam(name = "minPrice", required = false) Double minPrice,
            @RequestParam(name = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(name = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        if (!isProvider(userDetails)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }
        String providerName = userDetails.getName();
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(paymentService.findByOwnerAndStatus(pageable, providerName, status, method, startDate, endDate, maxPrice, minPrice));
    }

    // Coupon endpoints
    @GetMapping("/coupons")
    public ResponseEntity<?> getCoupons(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "code", required = false) String code,
            @RequestParam(name = "minPrice", required = false) Double minPrice,
            @RequestParam(name = "maxPrice", required = false) Double maxPrice,
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "type", required = false) String type,
            @RequestParam(name = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startDate,
            @RequestParam(name = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endDate) {
        if (!isProvider(userDetails)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(couponService.findAllWithCriteria(pageable, code, minPrice, maxPrice, status, type, startDate, endDate));
    }

    @PostMapping("/coupons")
    public ResponseEntity<?> addCoupon(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody Coupon coupon) {
        if (!isProvider(userDetails)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }
        return ResponseEntity.ok(couponService.add(coupon));
    }

    @PutMapping("/coupons/{id}")
    public ResponseEntity<?> updateCoupon(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String id,
            @RequestBody Coupon coupon) {
        if (!isProvider(userDetails)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }
        return ResponseEntity.ok(couponService.update(id, coupon));
    }

    // Helper method to check if user is a provider
    private boolean isProvider(CustomUserDetails userDetails) {
        return userDetails != null && userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_PROVIDER")
                        || auth.getAuthority().equals("ROLE_ADMIN"));
    }
}
