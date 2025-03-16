package com.cibook.bookingticket.service;

import com.cibook.bookingticket.model.Coupon;
import com.cibook.bookingticket.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CouponService {
    @Autowired
    private CouponRepository couponRepository;
    // Create a new Coupon
    public Coupon createCoupon(Coupon Coupon) {
        return couponRepository.save(Coupon);
    }

    // Get all Coupons
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    // Get a Coupon by ID
    public Optional<Coupon> getCouponById(String id) {
        return couponRepository.findById(id);
    }

    // Update a Coupon
    public Coupon updateCoupon(String id, Coupon updatedCoupon) {
        return couponRepository.findById(id).map(existingCoupon -> {
            if (updatedCoupon.getCode() != 0) {
                existingCoupon.setCode(updatedCoupon.getCode());
            }
            if (updatedCoupon.getDiscountValue() > 0) {
                existingCoupon.setDiscountValue(updatedCoupon.getDiscountValue());
            }
            if (updatedCoupon.getMinOrderValue() > 0) {
                existingCoupon.setMinOrderValue(updatedCoupon.getMinOrderValue());
            }
            if (updatedCoupon.getExpiryDate() != null) {
                existingCoupon.setExpiryDate(updatedCoupon.getExpiryDate());
            }
            if (updatedCoupon.getUsageLimit() > 0) {
                existingCoupon.setUsageLimit(updatedCoupon.getUsageLimit());
            }
            if (updatedCoupon.getBooingDetailID() != null) {
                existingCoupon.setBooingDetailID(updatedCoupon.getBooingDetailID());
            }

            return couponRepository.save(existingCoupon);
        }).orElse(null);
    }


    // Delete a Coupon
    public void deleteCoupon(String id) {
        couponRepository.deleteById(id);
    }
}
