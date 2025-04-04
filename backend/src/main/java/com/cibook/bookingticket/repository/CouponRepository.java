package com.cibook.bookingticket.repository;

import com.cibook.bookingticket.model.Coupon;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CouponRepository extends MongoRepository<Coupon,String>
{
<<<<<<< HEAD
    Optional<Coupon> findByCouponCode(String couponCode);
=======
    Optional<Coupon> findByCouponCode(String id);
>>>>>>> a2d6ae2c8d503f29ccff4d522e069cd74043ef11
}
