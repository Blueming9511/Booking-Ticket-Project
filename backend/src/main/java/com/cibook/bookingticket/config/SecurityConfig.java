package com.cibook.bookingticket.config;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    @Lazy
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        ;
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

                .authorizeHttpRequests(auth -> auth
                       .requestMatchers("/oauth2/**", "/swagger-ui/**", "/v3/**").permitAll()
                       .requestMatchers("/api/auth/**", "/api/auth/reset-password", "/api/auth/reset-password/**").permitAll()
                       .requestMatchers("/reset-password**").permitAll()

                       .requestMatchers(HttpMethod.GET, "/api/**").permitAll()
                       .requestMatchers(HttpMethod.POST, "/api/**").permitAll()

                       .requestMatchers(HttpMethod.GET, "/api/bookingdetails").hasRole("CUSTOMER")
                       .requestMatchers(HttpMethod.GET, "/api/bookings").hasRole("CUSTOMER")

                       .requestMatchers(HttpMethod.POST,   "/api/**").hasAnyRole("ADMIN", "PROVIDER")
                       .requestMatchers(HttpMethod.PUT,    "/api/**").hasAnyRole("ADMIN", "PROVIDER")
                       .requestMatchers(HttpMethod.DELETE, "/api/**").hasAnyRole("ADMIN", "PROVIDER")


                       .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2.successHandler(oAuth2SuccessHandler));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setExposedHeaders(List.of("Authorization", "Location"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}