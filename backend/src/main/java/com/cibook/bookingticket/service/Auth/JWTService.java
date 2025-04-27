package com.cibook.bookingticket.service.Auth;

import com.cibook.bookingticket.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Service
public class JWTService {
    private final SecretKey jwtSecret = Jwts.SIG.HS256.key().build();
    private final SecretKey refreshSecret =  Jwts.SIG.HS256.key().build();
    private final long accessTokenExpirationMs = 15 * 60 * 1000;
    private final long refreshTokenExpirationMs = 7 * 24 * 60 * 60 * 1000;

    public String generateToken(User user) {
        return Jwts.builder()
                .subject(user.getId())
                .claim("name", user.getName())
                .claim("email", user.getEmail())
                .claim("dob", user.getDateOfBirth())
                .claim("role", user.getRole())
                .claim("phoneNumber", user.getPhoneNumber())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + accessTokenExpirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    public String generateRefreshToken(User user) {
        return Jwts.builder()
                .subject(user.getId())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + refreshTokenExpirationMs))
                .signWith(getRefreshKey())
                .compact();
    }

    private Key getSigningKey() {
        return jwtSecret;
    }

    private Key getRefreshKey() {
        return refreshSecret;
    }

    public String getIdFromAccessToken(String token) {
        return extractClaim(token, Claims::getSubject, jwtSecret);
    }

    public String getIdFromRefreshToken(String token) {
        return extractClaim(token, Claims::getSubject, refreshSecret);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver, SecretKey key) {
        final Claims claims = extractAllClaims(token, key);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token, SecretKey key) {
        return Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getPayload();
    }

    public boolean isAccessTokenValid(String token, String id) {
        final String extractedId = getIdFromAccessToken(token);
        return (extractedId.equals(id) && isTokenExpired(token, jwtSecret));
    }

    public boolean isRefreshTokenValid(String token, String id) {
        final String extractedId = getIdFromRefreshToken(token);
        return (extractedId.equals(id) && !isTokenExpired(token, refreshSecret));
    }

    private boolean isTokenExpired(String token, SecretKey key) {
        Date expiration = extractClaim(token, Claims::getExpiration, key);
        return expiration.before(new Date());
    }
}
