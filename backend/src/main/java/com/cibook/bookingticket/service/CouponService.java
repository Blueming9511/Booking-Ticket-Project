package com.cibook.bookingticket.service;

import com.cibook.bookingticket.model.Coupon;
import com.cibook.bookingticket.repository.CouponRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class CouponService implements IService<Coupon, String> {

    private final CouponRepository couponRepository;

    @Autowired
    public CouponService(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    @Override
    public Coupon add(Coupon entity) {
        log.info("Adding new coupon");
        if (couponRepository.findByCouponCode(entity.getCouponCode()).isPresent()) {
            throw new IllegalArgumentException("Coupon code " + entity.getCouponCode() + " already exists.");
        }
        return couponRepository.save(entity);
    }

    @Override
    public Optional<Coupon> findById(String id) {
        log.debug("Finding coupon by ID: {}", id);
        return couponRepository.findById(id);
    }

    @Override
    public Optional<Coupon> findByCode(String code) {
        log.debug("Finding coupon by Code: {}", code);
        return couponRepository.findByCouponCode(code);
    }

    @Override
    public List<Coupon> findAll() {
        log.info("Finding all coupons");
        return couponRepository.findAll();
    }

    @Override
    public Map<String, String> findAllNamesWithID() {
        log.info("Finding all coupon codes and descriptions map");
        return couponRepository.findAll().stream()
                .filter(coupon -> coupon.getCouponCode() != null && coupon.getDescription() != null)
                .collect(Collectors.toMap(
                        Coupon::getCouponCode,
                        Coupon::getDescription,
                        (existingValue, newValue) -> existingValue
                ));
    }

    @Override
    public Coupon update(String id, Coupon entity) {
        log.info("Attempting to update coupon with ID: {}", id);

        Coupon existingCoupon = couponRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Update failed. Coupon with ID {} not found.", id);
                    return new NoSuchElementException("Coupon not found with ID: " + id);
                });

        entity.setId(existingCoupon.getId());
        if (entity.getCouponCode() == null || entity.getCouponCode().isEmpty()) {
            entity.setCouponCode(existingCoupon.getCouponCode());
        } else if (!entity.getCouponCode().equals(existingCoupon.getCouponCode())) {
            log.warn("Attempted to change coupon code from {} to {} during update for ID {}. Reverting to original.",
                    existingCoupon.getCouponCode(), entity.getCouponCode(), id);
            entity.setCouponCode(existingCoupon.getCouponCode());
        }

        Coupon updatedCoupon = couponRepository.save(entity);
        log.info("Successfully updated coupon with ID: {}", id);
        return updatedCoupon;
    }

    @Override
    public void deleteById(String id) {
        log.info("Attempting to delete coupon with ID: {}", id);
        if (!couponRepository.existsById(id)) {
            log.warn("Delete failed. Coupon with ID {} not found.", id);
            throw new NoSuchElementException("Cannot delete. Coupon not found with ID: " + id);
        }
        couponRepository.deleteById(id);
        log.info("Successfully deleted coupon with ID: {}", id);
    }

    @Override
    public boolean existsById(String id) {
        log.debug("Checking existence for coupon ID: {}", id);
        return couponRepository.existsById(id);
    }
}