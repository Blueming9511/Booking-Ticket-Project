package com.cibook.bookingticket.controller;

import com.cibook.bookingticket.model.User;
import com.cibook.bookingticket.service.UserService;
import com.cibook.bookingticket.service.CinemaService;
import com.cibook.bookingticket.service.ScreenService;
import com.cibook.bookingticket.service.MovieService;
import com.cibook.bookingticket.service.ShowtimeService;
import com.cibook.bookingticket.service.BookingService;
import com.cibook.bookingticket.service.PaymentService;
import com.cibook.bookingticket.service.CouponService;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class AdminControllerTest {

    @Mock
    private UserService userService;
    @Mock
    private CinemaService cinemaService;
    @Mock
    private ScreenService screenService;
    @Mock
    private MovieService movieService;
    @Mock
    private ShowtimeService showtimeService;
    @Mock
    private BookingService bookingService;
    @Mock
    private PaymentService paymentService;
    @Mock
    private CouponService couponService;

    @InjectMocks
    private AdminController adminController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getUsers_ShouldReturnPageOfUsers() {
        // Arrange
        List<User> users = new ArrayList<>();
        users.add(new User());
        Page<User> userPage = new PageImpl<>(users);
        when(userService.findAllWithRole(any(PageRequest.class), anyString())).thenReturn(userPage);

        // Act
        ResponseEntity<?> response = adminController.getUsers(0, 5, "ADMIN");

        // Assert
        assertEquals(ResponseEntity.ok(userPage), response);
        verify(userService).findAllWithRole(any(PageRequest.class), eq("ADMIN"));
    }

    @Test
    void updateUser_ShouldReturnOk() {
        // Arrange
        String userId = "123";
        User user = new User();
        doNothing().when(userService).update(eq(userId), any(User.class));

        // Act
        ResponseEntity<?> response = adminController.updateUser(userId, user);

        // Assert
        assertEquals(ResponseEntity.ok().build(), response);
        verify(userService).update(eq(userId), eq(user));
    }

    @Test
    void ban_ShouldReturnOk() {
        // Arrange
        String userId = "123";
        doNothing().when(userService).setBan(eq(userId), eq(true));

        // Act
        ResponseEntity<?> response = adminController.ban(userId);

        // Assert
        assertEquals(ResponseEntity.ok().build(), response);
        verify(userService).setBan(eq(userId), eq(true));
    }

    @Test
    void unBan_ShouldReturnOk() {
        // Arrange
        String userId = "123";
        doNothing().when(userService).setBan(eq(userId), eq(false));

        // Act
        ResponseEntity<?> response = adminController.unBan(userId);

        // Assert
        assertEquals(ResponseEntity.ok().build(), response);
        verify(userService).setBan(eq(userId), eq(false));
    }
} 