package com.cibook.bookingticket.util;

import java.util.Random;

public class OTPUtil {
    public static String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // 6 số
        return String.valueOf(otp);
    }
}
