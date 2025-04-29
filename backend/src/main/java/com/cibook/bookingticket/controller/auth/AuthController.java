package com.cibook.bookingticket.controller.auth;

import com.cibook.bookingticket.dto.*;
import com.cibook.bookingticket.mapper.UserRegisterMapper;
import com.cibook.bookingticket.mapper.UserResponseMapper;
import com.cibook.bookingticket.model.User;
import com.cibook.bookingticket.service.Auth.AuthService;
import com.cibook.bookingticket.service.Auth.CookieService;
import com.cibook.bookingticket.service.Auth.JWTService;
import com.cibook.bookingticket.service.Auth.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.webjars.NotFoundException;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Value("${frontend.url}")
    private String frontend;
    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        try {
            UserResponseDto userResponse = authService.login(loginRequest, response);
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
        authService.logout(response);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegisterDto userRegisterDto) {
        try {
            User user = authService.register(userRegisterDto);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/otp")
    public ResponseEntity<?> verify(@RequestBody UserVerifyDto userVerifyDto) {
        boolean isVerify = authService.verifyOtp(userVerifyDto.getEmail(), userVerifyDto.getOtp());
        if (isVerify) {
            return ResponseEntity.ok().body(Map.of("message", userVerifyDto.getEmail() + " is verified."));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refresh(@CookieValue("refreshToken") String refreshToken, @RequestBody String id, HttpServletResponse response) {
        try {
            authService.refreshToken(refreshToken, id, response);
            return ResponseEntity.ok().build();
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "An error occurred"));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> requestPasswordReset(@Valid @RequestBody PasswordResetRequestDto requestDto) {
        boolean success = authService.requestPasswordReset(requestDto.getEmail());

        Map<String, Object> response = new HashMap<>();
        if (success) {
            response.put("message", "Password reset email sent successfully");
            response.put("success", true);
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Email not found");
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyResetCode(@Valid @RequestBody PasswordVerificationDto verificationDto, HttpServletResponse r) {
        System.out.println("hiii");
        boolean isValid = authService.verifyResetCode(verificationDto.getEmail(), verificationDto.getOtp(), r);

        Map<String, Object> response = new HashMap<>();
        if (isValid) {
            response.put("message", "Code verified successfully");
            response.put("success", true);
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Invalid or expired code");
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody PasswordResetDto passwordResetDto, HttpServletRequest request, HttpServletResponse r) {
        boolean success = false;
        if (passwordResetDto.getToken() == null || passwordResetDto.getToken().isEmpty()) {
            System.out.println("hiii");
            success = authService.resetPassword(passwordResetDto.getNewPassword(), request, r);
        } else {
            System.out.println("barrr");
            success = authService.resetPassword(passwordResetDto.getToken(), passwordResetDto.getNewPassword());
        }

        Map<String, Object> response = new HashMap<>();
        if (success) {
            response.put("message", "Password reset successfully");
            response.put("success", true);
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Invalid or expired token");
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
