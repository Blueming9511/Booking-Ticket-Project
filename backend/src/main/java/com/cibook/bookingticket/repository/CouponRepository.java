package com.cibook.bookingticket.repository;

import com.cibook.bookingticket.model.Coupon;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CouponRepository extends MongoRepository<Coupon,String>
{
    Optional<Coupon> findByCouponCode(String couponCode);
}
