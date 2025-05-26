package com.cibook.bookingticket.config;

import com.cibook.bookingticket.model.User;
import com.cibook.bookingticket.repository.UserRepository;
import com.cibook.bookingticket.service.Auth.CookieService;
import com.cibook.bookingticket.service.Auth.JWTService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Value("${frontend.url}")
    private String frontendUrl;
    private final JWTService jwtService;
    private final CookieService cookieService;
    private final UserRepository userService;

    public OAuth2SuccessHandler(JWTService jwtService, CookieService cookieService, UserRepository userService) {
        this.jwtService = jwtService;
        this.cookieService = cookieService;
        this.userService = userService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User user = (OAuth2User) authentication.getPrincipal();
        User u = userService.findByEmail(user.getAttribute("email")).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(user.getAttribute("email"));
            newUser.setName(user.getAttribute("name"));
            newUser.setAvatar(user.getAttribute("picture"));
            newUser.setRole(User.Role.CUSTOMER);
            return userService.save(newUser);
        });
        String accessToken = jwtService.generateToken(u);
        String refreshToken = jwtService.generateRefreshToken(u);
        cookieService.addAuthCookies(response, accessToken, refreshToken);
        response.sendRedirect(frontendUrl + "/dashboard");
    }
}
