package com.cibook.bookingticket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@SpringBootApplication
@EnableWebSecurity
@RestController
public class BookingticketApplication{
	public static void main(String[] args) {
		SpringApplication.run(BookingticketApplication.class, args);
	}

}
