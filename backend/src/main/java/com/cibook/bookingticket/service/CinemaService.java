package com.cibook.bookingticket.service;

import com.cibook.bookingticket.model.Cinema;
import com.cibook.bookingticket.repository.CinemaRepository;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CinemaService {

    @Autowired
    private CinemaRepository cinemaRepository;

    // Create a new cinema
    public Cinema createCinema(Cinema cinema) {
        return cinemaRepository.save(cinema);
    }

    // Get all cinemas
    public List<Cinema> getAllCinemas() {
        return cinemaRepository.findAll();
    }

    // Get a cinema by ID
    public Optional<Cinema> getCinemaById(String id) {
        return cinemaRepository.findById(id);
    }

    // Update a cinema
    public Cinema updateCinema(String id, Cinema updatedCinema) {
        return cinemaRepository.findById(id).map(existingCinema -> {
            BeanUtils.copyProperties(updatedCinema, existingCinema, "cinemaID"); // Exclude ID
            return cinemaRepository.save(existingCinema); // Use correct repository
        }).orElse(null);
    }
    

    // Delete a cinema
    public void deleteCinema(String id) {
        cinemaRepository.deleteById(id);
    }
}
