package com.cibook.bookingticket.controller;

import org.apache.catalina.connector.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cibook.bookingticket.model.User;
import com.cibook.bookingticket.security.CustomUserDetails;
import com.nimbusds.oauth2.sdk.http.HTTPResponse;

@RestController
@RequestMapping("/api/")
public record CommonController() {
    @GetMapping("/health")
    public String healthCheck() {
        return "OK";
    }

    @GetMapping("/version")
    public String version() {
        return "1.0.0";
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@AuthenticationPrincipal CustomUserDetails user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        return ResponseEntity.ok(user);
    }
}
