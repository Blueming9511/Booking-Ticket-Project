package com.cibook.bookingticket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.Map;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScreenLocationWithOptionsResponse {
    private Page<ScreenWithLocationDto> screens;
    private Map<String, String> cinemaOptions;
}
