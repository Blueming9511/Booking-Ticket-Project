package com.cibook.bookingticket.config;

import com.cibook.bookingticket.controller.ProviderController;
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
                        // .anyRequest().permitAll()
                        .requestMatchers("/oauth2/**", "/swagger-ui/**", "/v3/**").permitAll()
                        .requestMatchers("/api/auth/**", "/api/auth/reset-password", "/api/auth/reset-password/**")
                        .permitAll()
                        .requestMatchers("/api/guest/**").permitAll()
                        .requestMatchers("/reset-password**").permitAll()
                        
                        .requestMatchers("/api/movies**", "/api/movies/**").permitAll()
                        .requestMatchers("/api/showtimes**").permitAll()
                        // .requestMatchers(HttpMethod.GET, "/api/**").permitAll()
                        // .requestMatchers(HttpMethod.POST, "/api/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/bookingdetails").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.GET, "/api/bookings").hasRole("CUSTOMER")

                        .requestMatchers(HttpMethod.GET, "/api/provider/**").hasRole("PROVIDER")
                        .requestMatchers(HttpMethod.POST, "/api/provider/**").hasRole("PROVIDER")
                        .requestMatchers(HttpMethod.PUT, "/api/provider/**").hasRole("PROVIDER")
                        .requestMatchers(HttpMethod.DELETE, "/api/provider/**").hasRole("PROVIDER")

                        .requestMatchers(HttpMethod.GET, "/api/admin/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/admin/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/admin/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/admin/**").hasRole("ADMIN")

                        .anyRequest().authenticated())
                .formLogin(d -> d.disable()) 
                .logout(logout -> logout.logoutUrl("/api/auth/logout"))
                .oauth2Login(oauth2 -> oauth2.successHandler(oAuth2SuccessHandler));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173", "https://accounts.google.com"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setExposedHeaders(List.of("Authorization", "Location", "Access-Control-Allow-Origin"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}