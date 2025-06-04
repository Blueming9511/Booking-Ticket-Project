package com.cibook.bookingticket.controller;

import com.cibook.bookingticket.dto.BookingAdminDto;
import com.cibook.bookingticket.dto.RevenueDTO;
import com.cibook.bookingticket.dto.ScreenRequestDto;
import com.cibook.bookingticket.model.*;
import com.cibook.bookingticket.security.CustomUserDetails;
import com.cibook.bookingticket.service.*;
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
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class ProviderControllerTest {

    @Mock
    private BookingService bookingService;
    @Mock
    private MovieService movieService;
    @Mock
    private CinemaService cinemaService;
    @Mock
    private ScreenService screenService;
    @Mock
    private PaymentService paymentService;
    @Mock
    private ShowtimeService showtimeService;
    @Mock
    private CouponService couponService;
    @Mock
    private CustomUserDetails userDetails;

    @InjectMocks
    private ProviderController providerController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(userDetails.getName()).thenReturn("Provider");
    }

    @Test
    void getSales_ShouldReturnSalesData() {
        // Arrange
        Map<String, Object> salesData = Map.of(
            "newOrders", 10,
            "revenues", 1000.0,
            "conversionRates", 0.8
        );
        when(bookingService.getOrderStatAMonth()).thenReturn(Map.of("count", 10));
        when(paymentService.getRevenueStatAMonth()).thenReturn(Map.of("amount", 1000.0));
        when(paymentService.getConversionRate()).thenReturn(Map.of("rate", 0.8));

        // Act
        ResponseEntity<?> response = providerController.getSales(userDetails);

        // Assert
        assertEquals(ResponseEntity.ok(salesData), response);
    }

    @Test
    void getRevenue_ShouldReturnRevenueData() {
        // Arrange
        List<RevenueDTO> revenueData = new ArrayList<>();
        revenueData.add(new RevenueDTO());
        when(paymentService.getRevenueByMonth()).thenReturn(revenueData);

        // Act
        ResponseEntity<?> response = providerController.getRevenue(userDetails, "monthly");

        // Assert
        assertEquals(ResponseEntity.ok(revenueData), response);
        verify(paymentService).getRevenueByMonth();
    }

    @Test
    void getCinemas_ShouldReturnPageOfCinemas() {
        // Arrange
        List<Cinema> cinemas = new ArrayList<>();
        cinemas.add(new Cinema());
        Page<Cinema> cinemaPage = new PageImpl<>(cinemas);
        when(cinemaService.findAllWithOwner(any(PageRequest.class), anyString(), anyString(), anyString()))
                .thenReturn(cinemaPage);

        // Act
        ResponseEntity<?> response = providerController.getCinemas(userDetails, 0, 5, "Address", "Active");

        // Assert
        assertEquals(ResponseEntity.ok(cinemaPage), response);
        verify(cinemaService).findAllWithOwner(any(PageRequest.class), eq("Provider"), eq("Address"), eq("Active"));
    }

    @Test
    void addCinema_ShouldReturnCinema() {
        // Arrange
        Cinema cinema = new Cinema();
        when(cinemaService.add(any(Cinema.class))).thenReturn(cinema);

        // Act
        ResponseEntity<?> response = providerController.addCinema(userDetails, cinema);

        // Assert
        assertEquals(ResponseEntity.ok(cinema), response);
        verify(cinemaService).add(eq(cinema));
    }

    @Test
    void updateCinema_ShouldReturnCinema() {
        // Arrange
        String cinemaId = "123";
        Cinema cinema = new Cinema();
        when(cinemaService.update(eq(cinemaId), any(Cinema.class))).thenReturn(cinema);

        // Act
        ResponseEntity<?> response = providerController.updateCinema(userDetails, cinemaId, cinema);

        // Assert
        assertEquals(ResponseEntity.ok(cinema), response);
        verify(cinemaService).update(eq(cinemaId), eq(cinema));
    }
} 