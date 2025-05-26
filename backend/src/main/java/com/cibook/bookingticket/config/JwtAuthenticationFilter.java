package com.cibook.bookingticket.config;

import com.cibook.bookingticket.security.CustomUserDetails;
import com.cibook.bookingticket.service.Auth.CookieService;
import com.cibook.bookingticket.service.Auth.JWTService;
import com.cibook.bookingticket.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JWTService jwtService;
    private final UserService userService;
    private final CookieService cookieService;

    public JwtAuthenticationFilter(JWTService jwtService, UserService userService, CookieService cookieService) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.cookieService = cookieService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String accessToken = cookieService.getCookieValue(request, "accessToken");
            String refreshToken = cookieService.getCookieValue(request, "refreshToken");

            if (accessToken != null) {
                String userId = jwtService.getIdFromAccessToken(accessToken);
                if (userId != null && jwtService.isAccessTokenValid(accessToken, userId)) {
                    setAuthentication(userId);
                } else if (refreshToken != null) {
                    handleRefreshToken(refreshToken, response);
                }
            } else if (refreshToken != null) {
                handleRefreshToken(refreshToken, response);
            }
        } catch (Exception e) {
            log.error("Error processing JWT authentication", e);
        }
        
        filterChain.doFilter(request, response);
    }

    private void handleRefreshToken(String refreshToken, HttpServletResponse response) {
        String userId = jwtService.getIdFromRefreshToken(refreshToken);
        if (userId != null && jwtService.isRefreshTokenValid(refreshToken, userId)) {
            userService.findById(userId).ifPresent(user -> {
                String newAccessToken = jwtService.generateToken(user);
                cookieService.addCookie("accessToken", newAccessToken, 15 * 60, response);
                setAuthentication(userId);
            });
        }
    }

    private void setAuthentication(String userId) {
        userService.findById(userId).ifPresent(user -> {
            CustomUserDetails userDetails = new CustomUserDetails(user);
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                            user.getEmail(), null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(auth);
        });
    }
}
