package com.cibook.bookingticket.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document (collection = "coupons")
public class Coupon {
    @Id
    private String id;

    @Indexed(unique = true)
    private String couponCode;

    private Double discountValue;
    private Double minOrderValue;

    @CreatedDate
    private Date startDate;
    private Date expiryDate;
    private Integer usageLimit;
    private String description;

}
