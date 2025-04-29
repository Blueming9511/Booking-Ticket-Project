package com.cibook.bookingticket.service.Auth;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

@Service
public class CookieService {
    public void addAuthCookies(HttpServletResponse response,
                               String accessToken,
                               String refreshToken) {
        Cookie accessCookie = generateCookie("accessToken", accessToken, 15 * 60);
        response.addCookie(accessCookie);

        if (refreshToken != null) {
            Cookie refreshCookie = generateCookie("refreshToken", refreshToken, 7 * 24 * 60 * 60);
            response.addCookie(refreshCookie);
        }
    }

    public void removeAuthCookies(HttpServletResponse response) {
        Cookie accessCookie = generateCookie("accessToken", "", 0);
        response.addCookie(accessCookie);
        Cookie refreshCookie = generateCookie("refreshToken", "", 0);
        response.addCookie(refreshCookie);
    }

    private Cookie generateCookie(String name, String token,int age) {
        Cookie cookie = new Cookie(name, token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(age);
        return cookie;
    }
}
