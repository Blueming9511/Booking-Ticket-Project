package com.cibook.bookingticket.controller;

import com.cibook.bookingticket.dto.LoginRequest;
import com.cibook.bookingticket.dto.UserDto;
import com.cibook.bookingticket.dto.UserRegisterDto;
import com.cibook.bookingticket.model.User;
import com.cibook.bookingticket.security.CustomUserDetails;
import com.cibook.bookingticket.service.Auth.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @Mock
    private AuthService authService;

    @Mock
    private HttpServletResponse response;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void login_ShouldReturnUserDto() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest();
        UserDto userDto = new UserDto();
        when(authService.login(any(LoginRequest.class), any(HttpServletResponse.class))).thenReturn(userDto);

        // Act
        ResponseEntity<?> response = authController.login(loginRequest, this.response);

        // Assert
        assertEquals(ResponseEntity.ok(userDto), response);
        verify(authService).login(eq(loginRequest), eq(this.response));
    }

    @Test
    void login_ShouldReturnNotFound() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest();
        when(authService.login(any(LoginRequest.class), any(HttpServletResponse.class)))
                .thenThrow(new UsernameNotFoundException("User not found"));

        // Act
        ResponseEntity<?> response = authController.login(loginRequest, this.response);

        // Assert
        assertEquals(ResponseEntity.notFound().build(), response);
    }

    @Test
    void login_ShouldReturnBadRequest() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest();
        when(authService.login(any(LoginRequest.class), any(HttpServletResponse.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        // Act
        ResponseEntity<?> response = authController.login(loginRequest, this.response);

        // Assert
        assertEquals(ResponseEntity.badRequest().build(), response);
    }

    @Test
    void register_ShouldReturnUser() {
        // Arrange
        UserRegisterDto userRegisterDto = new UserRegisterDto();
        User user = new User();
        when(authService.register(any(UserRegisterDto.class))).thenReturn(user);

        // Act
        ResponseEntity<?> response = authController.register(userRegisterDto);

        // Assert
        assertEquals(ResponseEntity.ok(user), response);
        verify(authService).register(eq(userRegisterDto));
    }

    @Test
    void register_ShouldReturnBadRequest() {
        // Arrange
        UserRegisterDto userRegisterDto = new UserRegisterDto();
        when(authService.register(any(UserRegisterDto.class)))
                .thenThrow(new IllegalArgumentException("Invalid registration data"));

        // Act
        ResponseEntity<?> response = authController.register(userRegisterDto);

        // Assert
        assertEquals(ResponseEntity.badRequest().build(), response);
    }

    @Test
    void logout_ShouldReturnOk() {
        // Arrange
        doNothing().when(authService).logout(any(HttpServletResponse.class));

        // Act
        ResponseEntity<Void> responseEntity = authController.logout(this.response);

        // Assert
        assertEquals(ResponseEntity.ok().build(), responseEntity);
        verify(authService).logout(eq(this.response));
    }
} 