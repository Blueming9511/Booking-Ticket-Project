package com.cibook.bookingticket.model;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document (collection = "coupon")
public class Coupon {
    private String couponID;
    private int code;
    private double discountValue;
    private double minOrderValue;
    private Date expiryDate;
    private int usageLimit;
    private String booingDetailID;


}
