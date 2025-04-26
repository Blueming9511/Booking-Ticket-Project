package com.cibook.bookingticket.config;

import com.cibook.bookingticket.model.User;
import com.cibook.bookingticket.service.JWTService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Value("${frontend.url}")
    private String frontendUrl;
    private final JWTService jwtService;
    private final ObjectMapper objectMapper;

    public OAuth2SuccessHandler(JWTService jwtService, ObjectMapper objectMapper) {
        this.jwtService = jwtService;
        this.objectMapper = objectMapper;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        System.out.println(authentication.getPrincipal());
        OAuth2User user = (OAuth2User) authentication.getPrincipal();
        System.out.println(user);
        String jwtToken = jwtService.generateToken(user);
        Cookie cookie = new Cookie("jwt", jwtToken);
        System.out.println("Cookie Name: " + cookie.getName());
        System.out.println("Cookie Value: " + cookie.getValue());
        System.out.println("Cookie Path: " + cookie.getPath());
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setMaxAge(3600);
        response.addCookie(cookie);
        response.sendRedirect(frontendUrl + "/dashboard");
    }
}
