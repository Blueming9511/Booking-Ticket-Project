package com.cibook.bookingticket.config;

import com.cibook.bookingticket.security.CustomUserDetails;
import com.cibook.bookingticket.service.Auth.JWTService;
import com.cibook.bookingticket.service.Auth.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JWTService jwtService;
    private final UserService userService;

    public JwtAuthenticationFilter(JWTService jwtService, UserService userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String refreshToken = getCookieValue(request, "refreshToken");
        if (refreshToken != null) {
            String userId = jwtService.getIdFromRefreshToken(refreshToken);
            if (userId != null && jwtService.isRefreshTokenValid(refreshToken, userId)) {
                userService.findById(userId).ifPresent(user -> {
                    String newAccessToken = jwtService.generateToken(user);

                    Cookie accessCookie = new Cookie("accessToken", newAccessToken);
                    accessCookie.setHttpOnly(true);
                    accessCookie.setSecure(false);
                    accessCookie.setPath("/");
                    accessCookie.setMaxAge(15 * 60);
                    response.addCookie(accessCookie);

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

    private String getCookieValue(HttpServletRequest request, String cookieName) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookieName.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
