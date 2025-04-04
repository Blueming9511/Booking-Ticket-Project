package com.cibook.bookingticket.controller;

import com.cibook.bookingticket.model.Coupon;
import com.cibook.bookingticket.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
public class CouponController implements IController<Coupon, String>{
    private final CouponService couponService;

    @Autowired
    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @Override
    public ResponseEntity<Coupon> add(Coupon entity) {
        return ResponseEntity.ok(couponService.add(entity));
    }

    @Override
    public ResponseEntity<List<Coupon>> getAll() {
        return ResponseEntity.ok(couponService.findAll());
    }

    @Override
    public ResponseEntity<Coupon> getById(String id) {
        return couponService.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<Map<String, String>> getAllNames() {
        return ResponseEntity.ok(couponService.findAllNamesWithID());
    }

    @Override
    public ResponseEntity<Coupon> update(String id, Coupon entity) {
        return ResponseEntity.ok(couponService.update(id, entity));
    }

    @Override
    public ResponseEntity<Void> delete(String id) {
        if(!couponService.existsById(id)){
            return ResponseEntity.notFound().build();
        }
        couponService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
