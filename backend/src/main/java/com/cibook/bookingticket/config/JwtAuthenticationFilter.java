package com.cibook.bookingticket.config;

import com.cibook.bookingticket.security.CustomUserDetails;
import com.cibook.bookingticket.service.Auth.CookieService;
import com.cibook.bookingticket.service.Auth.JWTService;
import com.cibook.bookingticket.service.BookingDetailService;
import com.cibook.bookingticket.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
//@Component
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
        String refreshToken = cookieService.getCookieValue(request, "refreshToken");
        if (refreshToken != null) {
            String userId = jwtService.getIdFromRefreshToken(refreshToken);
            if (userId != null && jwtService.isRefreshTokenValid(refreshToken, userId)) {
                userService.findById(userId).ifPresent(user -> {
                    String newAccessToken = jwtService.generateToken(user);
                    cookieService.addCookie("accessToken", newAccessToken, 15 * 60, response);
                    CustomUserDetails userDetails = new CustomUserDetails(user);
                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(
                                    user.getEmail(), null, userDetails.getAuthorities());

                    SecurityContextHolder.getContext().setAuthentication(auth);
                });
            }
        }
        filterChain.doFilter(request, response);
    }
}
