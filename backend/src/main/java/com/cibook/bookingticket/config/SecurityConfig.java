package com.cibook.bookingticket.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/oauth2/**", "/swagger-ui/**", "/v3/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/reset-password**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/bookingdetails").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.GET, "/api/bookings").hasRole("CUSTOMER")

                        .requestMatchers(HttpMethod.POST,   "/api/**").hasAnyRole("ADMIN", "PROVIDER")
                        .requestMatchers(HttpMethod.PUT,    "/api/**").hasAnyRole("ADMIN", "PROVIDER")
                        .requestMatchers(HttpMethod.DELETE, "/api/**").hasAnyRole("ADMIN", "PROVIDER")

                        .requestMatchers(HttpMethod.GET, "/api/**").permitAll()

                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2.successHandler(oAuth2SuccessHandler));

        return http.build();
    }



}