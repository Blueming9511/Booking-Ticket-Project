package com.cibook.bookingticket.service.Auth;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class CookieService {
    @Value("${frontend.url}")
    private String frontendUrl;

    public void addAuthCookies(HttpServletResponse response,
                               String accessToken,
                               String refreshToken) {
        addCookie("accessToken", accessToken, 15 * 60, response);
        if (refreshToken != null) {
            addCookie("refreshToken", refreshToken, 7 * 24 * 60 * 60, response);
        }
    }

    public void removeAuthCookies(HttpServletResponse response) {
        addCookie("accessToken", "", 0, response);
        addCookie("refreshToken", "", 0, response);
    }

    public void addCookie(String name, String token, int age, HttpServletResponse response) {
        Cookie cookie = generateCookie(name, token, age);
        response.addCookie(cookie);
    }

    private Cookie generateCookie(String name, String token, int age) {
        Cookie cookie = new Cookie(name, token);
        cookie.setHttpOnly(false); // Allow JavaScript access
        cookie.setSecure(true); // Set to true in production
        cookie.setPath("/");
        cookie.setMaxAge(age);
        cookie.setAttribute("SameSite", "Lax");
        
        // Set domain for localhost
        String domain = extractDomain(frontendUrl);
        if (domain != null) {
            cookie.setDomain(domain);
        }
        
        return cookie;
    }

    private String extractDomain(String url) {
        if (url.contains("localhost")) {
            return null;
        }
        try {
            String domain = url.replace("http://", "")
                             .replace("https://", "")
                             .split(":")[0];
            return domain;
        } catch (Exception e) {
            return null;
        }
    }

    public String getCookieValue(HttpServletRequest request, String cookieName) {
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
