package com.cibook.bookingticket.controller;

import com.cibook.bookingticket.dto.BookingRequestDto;
import com.cibook.bookingticket.dto.MovieGuestCarouselDto;
import com.cibook.bookingticket.model.Cinema;
import com.cibook.bookingticket.model.Movie;
import com.cibook.bookingticket.model.Booking;
import com.cibook.bookingticket.security.CustomUserDetails;
import com.cibook.bookingticket.service.BookingService;
import com.cibook.bookingticket.service.CinemaService;
import com.cibook.bookingticket.service.MovieService;
import com.cibook.bookingticket.service.ShowtimeService;
import com.cibook.bookingticket.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.io.UnsupportedEncodingException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class GuestControllerTest {

    @Mock
    private ShowtimeService showtimeService;
    @Mock
    private UserService userService;
    @Mock
    private CinemaService cinemaService;
    @Mock
    private MovieService movieService;
    @Mock
    private BookingService bookingService;
    @Mock
    private HttpServletRequest request;
    @Mock
    private HttpServletResponse response;
    @Mock
    private CustomUserDetails userDetails;

    @InjectMocks
    private GuestController guestController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getMoviesCarousel_ShouldReturnMovies() {
        // Arrange
        List<MovieGuestCarouselDto> movies = new ArrayList<>();
        movies.add(new MovieGuestCarouselDto());
        when(movieService.getMoviesCarousel()).thenReturn(movies);

        // Act
        ResponseEntity<?> response = guestController.getMoviesCarousel();

        // Assert
        assertEquals(ResponseEntity.ok(movies), response);
        verify(movieService).getMoviesCarousel();
    }

    @Test
    void getMoviesUpComming_ShouldReturnMovies() {
        // Arrange
        List<Movie> movies = new ArrayList<>();
        movies.add(new Movie());
        when(movieService.getMoviesUpComming()).thenReturn(movies);

        // Act
        ResponseEntity<?> response = guestController.getMoviesUpComming();

        // Assert
        assertEquals(ResponseEntity.ok(movies), response);
        verify(movieService).getMoviesUpComming();
    }

    @Test
    void getAllCinemas_ShouldReturnPageOfCinemas() {
        // Arrange
        List<Cinema> cinemas = new ArrayList<>();
        cinemas.add(new Cinema());
        Page<Cinema> cinemaPage = new PageImpl<>(cinemas);
        when(cinemaService.findAllWithOwner(any(PageRequest.class), anyString(), anyString(), anyString()))
                .thenReturn(cinemaPage);

        // Act
        ResponseEntity<?> response = guestController.getAllCinemas(0, 5, "Brand");

        // Assert
        assertEquals(ResponseEntity.ok(cinemaPage), response);
        verify(cinemaService).findAllWithOwner(any(PageRequest.class), eq("Brand"), eq(null), eq(null));
    }

    @Test
    void getAllBrands_ShouldReturnBrands() {
        // Arrange
        List<String> brands = new ArrayList<>();
        brands.add("Brand1");
        when(userService.getAllBrands()).thenReturn(brands);

        // Act
        ResponseEntity<?> response = guestController.getAllBrands();

        // Assert
        assertEquals(ResponseEntity.ok(brands), response);
        verify(userService).getAllBrands();
    }

    @Test
    void createWithDetail_ShouldReturnBooking() throws UnsupportedEncodingException {
        // Arrange
        BookingRequestDto bookingRequestDto = new BookingRequestDto();
        Booking booking = new Booking();
        when(bookingService.addWithDetail(any(BookingRequestDto.class))).thenReturn(booking);
        when(userDetails.getId()).thenReturn("123");

        // Act
        ResponseEntity<?> response = guestController.createWithDetail(userDetails, bookingRequestDto, request);

        // Assert
        assertEquals(ResponseEntity.ok(booking), response);
        verify(bookingService).addWithDetail(any(BookingRequestDto.class));
    }
} 