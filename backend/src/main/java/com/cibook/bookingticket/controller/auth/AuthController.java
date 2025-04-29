package com.cibook.bookingticket.controller.auth;

import com.cibook.bookingticket.dto.LoginRequest;
import com.cibook.bookingticket.dto.UserRegisterDto;
import com.cibook.bookingticket.dto.UserResponseDto;
import com.cibook.bookingticket.mapper.UserRegisterMapper;
import com.cibook.bookingticket.mapper.UserResponseMapper;
import com.cibook.bookingticket.model.User;
import com.cibook.bookingticket.service.Auth.CookieService;
import com.cibook.bookingticket.service.Auth.JWTService;
import com.cibook.bookingticket.service.Auth.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final JWTService jwtService;
    private final UserRegisterMapper mapper;
    private final UserResponseMapper userResponseMapper;
    private final CookieService cookieService;

    @Autowired
    public AuthController(UserService userService, JWTService jwtService, UserRegisterMapper mapper, UserResponseMapper userResponseMapper, CookieService cookieService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.mapper = mapper;
        this.userResponseMapper = userResponseMapper;
        this.cookieService = cookieService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        try {
            User user = userService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
            String accessToken = jwtService.generateToken(user);
            String refreshToken = null;
            if (loginRequest.isRemember()) {
                refreshToken = jwtService.generateRefreshToken(user);
            }
            cookieService.addAuthCookies(response, accessToken, refreshToken);
            UserResponseDto userResponse = userResponseMapper.toDto(user);
            return ResponseEntity.ok(userResponse);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (BadCredentialsException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        cookieService.removeAuthCookies(response);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegisterDto userRegisterDto) {
        try {
            User user = mapper.toEntity(userRegisterDto);
            user.setRole(User.Role.CUSTOMER);
            User savedUser = userService.add(user);
            return ResponseEntity.ok(savedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@CookieValue("refreshToken") String refreshToken, @RequestBody String id, HttpServletResponse response) {
        try {
            if (refreshToken == null || !jwtService.isRefreshTokenValid(refreshToken, id)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid refresh token"));
            }
            String userId = jwtService.getIdFromRefreshToken(refreshToken);
            String newAccessToken = jwtService.generateToken(userService.findById(userId).get());
            String newRefreshToken = jwtService.generateRefreshToken(userService.findById(userId).get());
            cookieService.addAuthCookies(response, newAccessToken, newRefreshToken);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "An error occurred"));
        }
    }
}
