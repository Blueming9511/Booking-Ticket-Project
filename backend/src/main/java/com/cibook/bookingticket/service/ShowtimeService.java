package com.cibook.bookingticket.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cibook.bookingticket.model.Showtime;
import com.cibook.bookingticket.repository.ShowtimeRepository;

@Service
public class ShowtimeService {
    @Autowired
    private ShowtimeRepository showtimeRepository;

    public List<Showtime> getAllShowtimes() {
        return showtimeRepository.findAll();
    }

    public Optional<Showtime> getShowtimeById(String id) {
        return showtimeRepository.findById(id);
    }

    public Showtime createShowtime(Showtime showtime) {
        return showtimeRepository.save(showtime);
    }

public Showtime updateShowtime(String id, Showtime updatedShowtime) {
    return showtimeRepository.findById(id).map(existingShowtime -> {
        BeanUtils.copyProperties(updatedShowtime, existingShowtime, "showTimeID"); // Exclude ID
        return showtimeRepository.save(existingShowtime); // Save updated showtime
    }).orElse(null);
}


    public void deleteShowtime(String id) {
        showtimeRepository.deleteById(id);
    }
}
