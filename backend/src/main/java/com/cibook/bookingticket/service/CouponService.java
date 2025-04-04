package com.cibook.bookingticket.service;

import com.cibook.bookingticket.model.Coupon;
import com.cibook.bookingticket.repository.CouponRepository;

import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class CouponService implements IService<Coupon, String>{
    private final CouponRepository couponRepository;

    @Autowired
    public CouponService(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    @Override
    public Coupon add(Coupon entity) {
        log.info("CouponService: Adding new coupon");
        return couponRepository.save(entity);
    }

    @Override
    public Optional<Coupon> findById(String id) {
        log.info("CouponService: Finding coupon by ID {}", id); // Optional logging
        return couponRepository.findById(id);
    }

    @Override
    public Optional<Coupon> findByCode(String id) {
        log.info("CouponService: Finding coupon by Code {}", id); // Optional logging
        return couponRepository.findByCouponCode(id);
    }

    @Override
    public List<Coupon> findAll() {
        log.info("CouponService: Finding all coupons"); // Optional logging
        return couponRepository.findAll();
    }

    @Override
    public Map<String, String> findAllNamesWithID() {
        log.info("CouponService: Finding all coupon codes and descriptions"); // Optional logging
        return couponRepository.findAll().stream()
                .collect(Collectors.toMap(
                        Coupon::getCouponCode,
                        Coupon::getDescription,
                        (existingValue, newValue) -> existingValue // Handle duplicate codes if they occur (keep first found)
                ));
    }

    @Override
    public Coupon update(String id, Coupon entity) {
        log.info("CouponService: Updating coupon with ID {}", id);
        return couponRepository.findById(id)
                .map(existingCoupon -> {
                    entity.setId(existingCoupon.getId());
                    entity.setCouponCode(existingCoupon.getCouponCode());
                    return couponRepository.save(entity);
                })
                .orElseGet(() -> {
                    log.warn("CouponService: Update failed. Coupon with ID {} not found.", id);
                    return null;
                });
    }

    @Override
    public void deleteById(String id) {
        couponRepository.deleteById(id);

    }

    @Override
    public boolean existsById(String id) {
        return couponRepository.existsById(id);
    }
}
