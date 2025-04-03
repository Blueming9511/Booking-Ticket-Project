package com.cibook.bookingticket.service;

import com.cibook.bookingticket.model.SequenceCounter;
import com.cibook.bookingticket.repository.SequenceCounterRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AutoGeneratedCode {
    private static final int MAX_SEQUENCE = 999;
    private static final int SEAT_ROWS = 10;
    private static final int SEATS_PER_ROW = 10;

    private final SequenceCounterRepository sequenceRepo;

    public AutoGeneratedCode(SequenceCounterRepository sequenceRepo) {
        this.sequenceRepo = sequenceRepo;
    }

    @Transactional
    public String generateBookingCode() {
        return generateUniqueCode("BO", 3);
    }

    @Transactional
    public String generateCinemaCode() {
        return generateUniqueCode("CI", 3);
    }

    @Transactional
    public String generateMovieCode() {
        return generateUniqueCode("MO", 3);
    }

    @Transactional
    public String generateScreenCode(String cinemaCode) {
        String key = "SCR" + cinemaCode;
        SequenceCounter sequence = sequenceRepo.findById(key)
                .orElseGet(() -> {
                    SequenceCounter newSeq = new SequenceCounter();
                    newSeq.setKey(key);
                    newSeq.setValue(0);
                    return sequenceRepo.save(newSeq);
                });

        int nextValue = sequence.getValue() + 1;
        sequence.setValue(nextValue);
        sequenceRepo.save(sequence);

        return String.format("%s%02d", cinemaCode, nextValue);
    }

    @Transactional
    public String generateSeatCode(String screenCode) {
        String key = "SE" + screenCode;
        SequenceCounter sequence = sequenceRepo.findById(key)
                .orElse(new SequenceCounter(key, 0));

        int seq = sequence.getValue() + 1;
        sequence.setValue(seq);
        sequenceRepo.save(sequence);

        char row = (char) ('A' + (seq - 1) / SEATS_PER_ROW);
        int number = (seq % SEATS_PER_ROW == 0) ? SEATS_PER_ROW : seq % SEATS_PER_ROW;
        return String.format("%c%02d", row, number);
    }

    private String generateUniqueCode(String prefix, int digits) {
        String key = prefix;
        SequenceCounter sequence = sequenceRepo.findById(key)
                .orElse(new SequenceCounter(key, 0));

        int nextValue = sequence.getValue() + 1;
        if (nextValue > MAX_SEQUENCE) {
            nextValue = 1;
        }

        sequence.setValue(nextValue);
        sequenceRepo.save(sequence);

        return String.format("%s%0" + digits + "d", prefix, nextValue);
    }
}