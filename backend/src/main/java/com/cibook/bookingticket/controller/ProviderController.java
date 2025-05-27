package com.cibook.bookingticket.controller;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cibook.bookingticket.security.CustomUserDetails;
import com.cibook.bookingticket.service.BookingService;
import com.cibook.bookingticket.service.CinemaService;
import com.cibook.bookingticket.service.MovieService;
import com.cibook.bookingticket.service.PaymentService;
import com.cibook.bookingticket.service.ScreenService;
import com.cibook.bookingticket.service.ShowtimeService;

@RestController
@RequestMapping("/api/providers")
public class ProviderController {
    private final BookingService bookingService;
    private final MovieService movieService;
    private final CinemaService cinemaService;
    private final ScreenService screenService;
    private final PaymentService paymentService;
    private final ShowtimeService showtimeService;

    public ProviderController(BookingService bookingService, MovieService movieService, CinemaService cinemaService,
            ScreenService screenService, PaymentService paymentService, ShowtimeService showtimeService) {
        this.bookingService = bookingService;
        this.movieService = movieService;
        this.cinemaService = cinemaService;
        this.screenService = screenService;
        this.paymentService = paymentService;
        this.showtimeService = showtimeService;
    }

    @GetMapping("/cinemas")
    public ResponseEntity<?> getCinemas(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "address", required = false) String address,
            @RequestParam(name = "status", required = false) String status) {
        Pageable pageable = PageRequest.of(page, size);

        boolean isAuthorize = userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_PROVIDER")
                        || auth.getAuthority().equals("ROLE_ADMIN"));

        if (isAuthorize) {
            String providerName = userDetails.getName();
            return ResponseEntity.ok(
                    cinemaService.findAllWithOwner(pageable, providerName, address, status));
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
    }

}
