package com.cibook.bookingticket.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.webjars.NotFoundException;

import com.cibook.bookingticket.dto.BookingAdminDto;
import com.cibook.bookingticket.dto.ScreenWithLocationDto;
import com.cibook.bookingticket.dto.ShowtimeResponseDto;
import com.cibook.bookingticket.model.Cinema;
import com.cibook.bookingticket.model.Coupon;
import com.cibook.bookingticket.model.Movie;
import com.cibook.bookingticket.model.Payment;
import com.cibook.bookingticket.model.User;
import com.cibook.bookingticket.service.BookingService;
import com.cibook.bookingticket.service.CinemaService;
import com.cibook.bookingticket.service.CouponService;
import com.cibook.bookingticket.service.MovieService;
import com.cibook.bookingticket.service.PaymentService;
import com.cibook.bookingticket.service.ScreenService;
import com.cibook.bookingticket.service.ShowtimeService;
import com.cibook.bookingticket.service.UserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final UserService userService;
    private final CinemaService cinemaService;
    private final ScreenService screenService;
    private final MovieService movieService;
    private final ShowtimeService showtimeService;
    private final BookingService bookingService;
    private final PaymentService paymentService;
    private final CouponService couponService;

    public AdminController(UserService userService, CinemaService cinemaService, ScreenService screenService,
            MovieService movieService, ShowtimeService showtimeService, BookingService bookingService,
            PaymentService paymentService, CouponService couponService) {
        this.userService = userService;
        this.cinemaService = cinemaService;
        this.screenService = screenService;
        this.movieService = movieService;
        this.showtimeService = showtimeService;
        this.bookingService = bookingService;
        this.paymentService = paymentService;
        this.couponService = couponService;
    }

    @GetMapping("/users")
    public ResponseEntity<?> getUsers(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "role", defaultValue = "") String role) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userService.findAllWithRole(pageable, role);
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable String userId, @RequestBody User user) {
        try {
            userService.update(userId, user);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/users/{id}/unban")
    public ResponseEntity<?> unBan(@PathVariable("id") String id) {
        try {
            userService.setBan(id, false);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/users/{id}/ban")
    public ResponseEntity<?> ban(@PathVariable String id) {
        try {
            userService.setBan(id, true);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/cinemas")
    public ResponseEntity<?> getCinemas(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "owner", defaultValue = "") String owner,
            @RequestParam(name = "address", defaultValue = "") String address,
            @RequestParam(name = "status", defaultValue = "") String status) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Cinema> cinemas = cinemaService.findAllWithOwner(pageable, owner, address, status);
        return ResponseEntity.ok(cinemas);
    }

    @PutMapping("/cinemas/{id}")
    public ResponseEntity<?> editCinema(@PathVariable String id, @RequestBody Cinema entity) {
        try {
            Cinema cinema = cinemaService.update(id, entity);
            return ResponseEntity.ok(cinema);
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/cinemas/{id}")
    public ResponseEntity<?> deleteCinema(@PathVariable String id) {
        try {
            cinemaService.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("cinemas/{id}/status")
    public ResponseEntity<?> putMethodName(@PathVariable String id, @RequestBody Map<String, String> entity) {
        try {
            cinemaService.updateStatus(id, entity.get("status"));
            return ResponseEntity.ok().build();
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/cinemas/options")
    public ResponseEntity<?> getCinemaOptions(@RequestParam String param) {
        Map<String, String> cinemaOptions = cinemaService.findAllNamesWithID();
        return ResponseEntity.ok(cinemaOptions);
    }

    @GetMapping("/screens")
    public ResponseEntity<Page<ScreenWithLocationDto>> findAllWithLocation(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "cinema", defaultValue = "") String cinema,
            @RequestParam(name = "status", defaultValue = "") String status,
            @RequestParam(name = "owner", defaultValue = "") String owner,
            @RequestParam(name = "address", defaultValue = "") String address) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ScreenWithLocationDto> screens = screenService.getScreensWithLocation(pageable, cinema, owner, address, status);
        return ResponseEntity.ok(screens);
    }

    @PutMapping("/screens/{id}/status")
    public ResponseEntity<?> changeStatus(@PathVariable String id, @RequestBody Map<String, String> entity) {
        try {
            screenService.updateStatus(id, entity.get("status"));
            return ResponseEntity.ok().build();
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/movies")
    public ResponseEntity<?> getMovies(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "owner", defaultValue = "") String owner) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Movie> movies = movieService.findAllWithOwner(pageable, owner);
        return ResponseEntity.ok(movies);
    }

    @PutMapping("/movies/{id}")
    public ResponseEntity<?> putMovies(@PathVariable String id, @RequestBody Movie entity) {
        try {
            Movie movie = movieService.update(id, entity);
            return ResponseEntity.ok(movie);
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/movies/{id}/status")
    public ResponseEntity<?> changeStatusMovie(@PathVariable String id, @RequestBody Map<String, String> entity) {
        try {
            movieService.updateStatus(id, entity.get("status"));
            return ResponseEntity.ok().build();
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/showtimes")
    public ResponseEntity<?> getShowtimes(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "owner", defaultValue = "") String owner,
            @RequestParam(name = "movie", defaultValue = "") String movie,
            @RequestParam(name = "status", defaultValue = "") String status) {

        Pageable pageable = PageRequest.of(page, size);
        try {
            Page<ShowtimeResponseDto> showtimes;
            showtimes = showtimeService.findAllShowtimes(pageable, owner, movie, status);
            return ResponseEntity.ok(showtimes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/showtimes/{id}/status")
    public ResponseEntity<?> changeStatusShowtime(@PathVariable String id, @RequestBody Map<String, String> entity) {
        try {
            showtimeService.updateStatus(id, entity.get("status"));
            return ResponseEntity.ok().build();
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/coupons")
    public ResponseEntity<?> addCoupon(@RequestBody Coupon entity) {
        try {
            System.out.println(entity);
            return ResponseEntity.ok(couponService.add(entity));
        } catch (NotFoundException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Coupon code already exists");
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/coupons")
    public ResponseEntity<Page<Coupon>> getAll(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "code", defaultValue = "") String code,
            @RequestParam(name = "minPrice", defaultValue = "0.0") Double minPrice,
            @RequestParam(name = "maxPrice", defaultValue = "0.0") Double maxPrice,
            @RequestParam(name = "status", defaultValue = "") String status,
            @RequestParam(name = "type", defaultValue = "") String type,
            @RequestParam(name="startDate", defaultValue = "") String startDate,
            @RequestParam(name = "endDate", defaultValue = "") String endDate) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Coupon> coupons = couponService.findAllWithCriteria(pageable, code, minPrice, maxPrice, status, type, startDate, endDate);
        return ResponseEntity.ok(coupons);
    }

    @GetMapping("/coupons/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        return couponService.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/coupons/name")
    public ResponseEntity<Map<String, String>> getAllNames() {
        return ResponseEntity.ok(couponService.findAllNamesWithID());
    }

    @PutMapping("/coupons/{id}")
    public ResponseEntity<Coupon> update(@PathVariable String id, @RequestBody Coupon entity) {
        return ResponseEntity.ok(couponService.update(id, entity));
    }

    @DeleteMapping("/coupons/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!couponService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        couponService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/coupons/{id}/status")
    public ResponseEntity<?> changeStatusCoupon(@PathVariable String id, @RequestBody Map<String, String> entity) {
        try {
            couponService.updateStatus(id, entity.get("status"));
            return ResponseEntity.ok().build();
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/bookings")
    public ResponseEntity<Page<BookingAdminDto>> getAllBookings(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "owner", defaultValue = "") String owner,
            @RequestParam(name = "status", defaultValue = "") String status,
            @RequestParam(name = "movie", defaultValue = "") String movie) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BookingAdminDto> bookings = bookingService.findAllBooking(pageable, owner, status, movie);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/payments")
    public ResponseEntity<Page<Payment>> getAllPayments(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "owner", defaultValue = "") String owner,
            @RequestParam(name = "status", defaultValue = "") String status) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Payment> payments = paymentService.findByOwnerAndStatus(pageable, owner, status);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/owners")
    public ResponseEntity<List<String>> getOwners() {
        return ResponseEntity.ok(userService.findAllOwners());
    }

}
