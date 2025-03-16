package com.cibook.bookingticket.repository;

import com.cibook.bookingticket.model.Coupon;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CouponRepository extends MongoRepository<Coupon,String>
{
}
