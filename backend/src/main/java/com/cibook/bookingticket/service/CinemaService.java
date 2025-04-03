package com.cibook.bookingticket.service;

import com.cibook.bookingticket.model.Cinema;
import com.cibook.bookingticket.repository.CinemaRepository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class CinemaService implements IService<Cinema, String> {
    private final CinemaRepository cinemaRepository;
    private final AutoGeneratedCode codeGenerator;

    @Autowired
    public CinemaService(CinemaRepository cinemaRepository, AutoGeneratedCode codeGenerator) {
        this.cinemaRepository = cinemaRepository;
        this.codeGenerator = codeGenerator;
    }

    @Override
    public Cinema add(Cinema entity) {
        log.info("CinemaService add cinema");
        entity.setCinemaCode(codeGenerator.generateCinemaCode());
        return cinemaRepository.save(entity);
    }

    @Override
    public Optional<Cinema> findById(String id) {
        return cinemaRepository.findById(id);
    }

    @Override
    public Optional<Cinema> findByCode(String id) {
        return cinemaRepository.findByCinemaCode(id);
    }

    @Override
    public List<Cinema> findAll() {
        return cinemaRepository.findAll();
    }

    @Override
    public Map<String, String> findAllNamesWithID() {
        return cinemaRepository.findAll().stream()
                .filter(cinema -> cinema.getCinemaCode() != null &&  cinema.getCinemaCode() !=null)
                .collect(Collectors.toMap(
                        Cinema::getCinemaCode,
                        Cinema::getCinemaName,
                        (existing, replacement) -> existing
                ));
    }

    @Override
    public Cinema update(String id, Cinema entity) {
        if (!existsById(id)) return null;
        return cinemaRepository.findById(id)
                .map(existing -> {
                    entity.setId(existing.getId());
                    entity.setCinemaCode(existing.getCinemaCode());
                    return cinemaRepository.save(entity);
                })
                .orElse(null);
    }

    @Override
    public void deleteById(String id) {
        cinemaRepository.deleteById(id);
    }

    @Override
    public boolean existsById(String id) {
        return cinemaRepository.existsById(id);
    }
}
