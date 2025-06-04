package com.cibook.bookingticket.controller;

import com.cibook.bookingticket.common.Config;
import com.cibook.bookingticket.dto.BookingRequestDto;
import com.cibook.bookingticket.security.CustomUserDetails;
import com.cibook.bookingticket.service.BookingService;
import com.cibook.bookingticket.service.CinemaService;
import com.cibook.bookingticket.service.MovieService;
import com.cibook.bookingticket.service.ShowtimeService;
import com.cibook.bookingticket.service.UserService;
import com.nimbusds.jose.shaded.gson.Gson;
import com.nimbusds.jose.shaded.gson.JsonObject;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.apache.catalina.connector.Response;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/guest")
public class GuestController {

    private final ShowtimeService showtimeService;

    private final UserService userService;

    private final CinemaService cinemaService;

    private final MovieService movieService;
    private final BookingService bookingService;

    GuestController(MovieService movieService, CinemaService cinemaService, UserService userService,
            ShowtimeService showtimeService, BookingService bookingService) {
        this.bookingService = bookingService;
        this.movieService = movieService;
        this.cinemaService = cinemaService;
        this.userService = userService;
        this.showtimeService = showtimeService;
    }

    @GetMapping("/movies-carousel")
    public ResponseEntity<?> getMoviesCarousel() {
        return ResponseEntity.ok(movieService.getMoviesCarousel());
    }

    @GetMapping("/movies-up-comming")
    public ResponseEntity<?> getMoviesUpComming() {
        return ResponseEntity.ok(movieService.getMoviesUpComming());
    }

    @GetMapping("/all-cinemas")
    public ResponseEntity<?> getAllCinemas(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "brand", required = false) String brand) {
        return ResponseEntity.ok(cinemaService.findAllWithOwner(PageRequest.of(page, size), brand, null, null));
    }

    @GetMapping("/all-brands")
    public ResponseEntity<?> getAllBrands() {
        return ResponseEntity.ok(userService.getAllBrands());
    }

    @GetMapping("/cinema/{id}/showtimes")
    public ResponseEntity<?> getCinemas(@PathVariable String id) {
        try {
            return ResponseEntity.ok(showtimeService.findAllShowtimes(PageRequest.of(0, 100), null, null, null, null,
                    null, null, null, id));
        } catch (ParseException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PostMapping("/booking")
    public ResponseEntity<?> createWithDetail(@AuthenticationPrincipal CustomUserDetails userDetails,@RequestBody BookingRequestDto entity, HttpServletRequest request) {
        try {
            System.out.println(userDetails.getId());
            entity.setUserId(userDetails.getId());
            var ipAdress = Config.getIpAddress(request);
            entity.setIp(ipAdress);

            return ResponseEntity.ok(bookingService.addWithDetail(entity));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/booking-success")
    public void getBookingSuccess(HttpServletRequest request, HttpServletResponse response) {
        try {
            if (bookingService.handleBooking(request)) {
                response.sendRedirect("http://localhost:5173/redirectPayment?status=success");
            } else {
                response.sendRedirect("http://localhost:5173/redirectPayment?status=fail");

            }
        } catch (Exception e) {
            e.printStackTrace();
            try {
                response.sendRedirect("http://localhost:5173/redirectPayment?status=fail");
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }

}
