package com.cibook.bookingticket.model;

import lombok.Builder;
import lombok.Data;
import lombok.Builder.Default;

import java.util.Date;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "coupons")
@Builder
public class Coupon {
    @Id
    private String id;

    @Indexed(unique = true)
    private String couponCode;

    private Double discountValue;
    @Builder.Default
    private Double minOrderValue = 0.0;

    private CouponType type;

    @CreatedDate
    private Date startDate;
    private Date expiryDate;

    @Builder.Default
    private Integer usageLimit = 100;
    @Builder.Default
    private Integer usage = 0;
    @Default
    private CouponStatus status = CouponStatus.INACTIVE;
    private String description;

    public enum CouponType {
        FIXED, PERCENTAGE
    }

    public enum CouponStatus {
        ACTIVE, INACTIVE, EXPIRED, FULL
    }

}
