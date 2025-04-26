package com.cibook.bookingticket.service;

import com.cibook.bookingticket.model.User;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
public class JWTService {

    private final ObjectMapper objectMapper;
    private final SecretKey jwtSecret = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final long jwtExpirationMs = 24 * 60 * 60 * 1000; // 1 ngày

    @Autowired
    public JWTService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public String generateToken(OAuth2User user) {
        return Jwts.builder()
                .claim("email", user.getAttributes().get("email"))
                .claim("name", user.getAttributes().get("name"))
                .claim("picture", user.getAttributes().get("picture"))
                .setSubject(user.getName())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    public String generateToken(User user) {
        Map<String, Object> claims = objectMapper.convertValue(user, new TypeReference<Map<String, Object>>() {});
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    private Key getSigningKey() {
        return jwtSecret;
    }

    public String getIdFromToken(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getPayload();
    }

    public boolean isTokenValid(String token, String id) {
        final String extractedId = getIdFromToken(token);
        return (extractedId.equals(id)) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
