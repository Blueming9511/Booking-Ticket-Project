package com.cibook.bookingticket.service.Auth;

import com.cibook.bookingticket.dto.LoginRequest;
import com.cibook.bookingticket.dto.UserRegisterDto;
import com.cibook.bookingticket.dto.UserResponseDto;
import com.cibook.bookingticket.mapper.UserRegisterMapper;
import com.cibook.bookingticket.mapper.UserResponseMapper;
import com.cibook.bookingticket.model.User;
import com.cibook.bookingticket.service.Email.EmailService;
import com.cibook.bookingticket.util.OTPUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.webjars.NotFoundException;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {
    private final EmailService emailService;
    private final UserService userService;
    private final JWTService jwtService;
    private final CookieService cookieService;
    private final UserResponseMapper userResponseMapper;
    private final UserRegisterMapper userRegisterMapper;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(EmailService emailService, UserService userService, JWTService jwtService, CookieService cookieService, UserResponseMapper userResponseMapper, UserRegisterMapper userRegisterMapper, PasswordEncoder passwordEncoder) {
        this.emailService = emailService;
        this.userService = userService;
        this.jwtService = jwtService;
        this.cookieService = cookieService;
        this.userResponseMapper = userResponseMapper;
        this.userRegisterMapper = userRegisterMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponseDto login(LoginRequest loginRequest, HttpServletResponse response) {
        User user = userService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
        String accessToken = jwtService.generateToken(user);
        String refreshToken = null;
        if (loginRequest.isRemember()) {
            refreshToken = jwtService.generateRefreshToken(user);
        }
        cookieService.addAuthCookies(response, accessToken, refreshToken);
        UserResponseDto userResponse = userResponseMapper.toDto(user);

        emailService.sendLoginNotification(user.getEmail(), LocalDateTime.now());

        return userResponse;
    }

    public User register(UserRegisterDto userRegisterDto) {
        User user = userRegisterMapper.toEntity(userRegisterDto);
        user.setRole(User.Role.CUSTOMER);
        String otp = OTPUtil.generateOTP();
        user.setOtp(otp);
        user.setVerified(false);
        User savedUser = userService.add(user);

        emailService.sendOtpVerification(user.getEmail(), otp);

        return savedUser;
    }

    public void logout(HttpServletResponse response) {
        cookieService.removeAuthCookies(response);
    }

    public void refreshToken(String refreshToken, String id, HttpServletResponse response) {
        if (refreshToken == null || !jwtService.isRefreshTokenValid(refreshToken, id)) {
            throw new NotFoundException("Refresh token not found");
        }
        String userId = jwtService.getIdFromRefreshToken(refreshToken);
        String newAccessToken = jwtService.generateToken(userService.findById(userId).get());
        String newRefreshToken = jwtService.generateRefreshToken(userService.findById(userId).get());
        cookieService.addAuthCookies(response, newAccessToken, newRefreshToken);
    }

    public boolean verifyOtp(String email, String inputOtp) {
        User user = userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getOtp().equals(inputOtp)) {
            user.setVerified(true);
            user.setOtp(null);
            userService.update(user.getId(), user);
            emailService.sendVerificationSuccess(user.getEmail());

            return true;
        }
        return false;
    }

    public boolean requestPasswordReset(String email) {
        User user = userService.findByEmail(email).orElse(null);
        if (user == null) {
            return false;
        }

        String resetCode = OTPUtil.generateOTP();
        String resetToken = UUID.randomUUID().toString();

        user.setResetToken(resetToken);
        user.setResetCode(resetCode);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
        userService.update(user.getId(), user);

        String resetLink = "http://localhost:5173/forgot-password?token=" + resetToken;

        emailService.sendPasswordResetEmail(user.getEmail(), resetCode, resetLink);

        return true;
    }

    public boolean verifyResetCode(String email, String resetCode, HttpServletResponse response) {
        User user = userService.findByEmail(email).orElse(null);
        if (user == null || user.getResetCode() == null) {
            return false;
        }

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            return false;
        }
        if (user.getResetCode().equals(resetCode)) {
            cookieService.addCookie("resetPasswordToken", user.getResetToken(), 15 * 60, response);
            return true;
        }
        return false;
    }

    public boolean resetPassword(String newPassword, HttpServletRequest request, HttpServletResponse response) {
        String cookie = cookieService.getCookieValue(request, "resetPasswordToken");
        User user = userService.findByResetToken(cookie).orElse(null);
        if (user == null) {
            return false;
        }

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            return false;
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetCode(null);
        user.setResetTokenExpiry(null);

        cookieService.addCookie("resetPasswordToken", user.getResetToken(), 0, response);
        userService.update(user.getId(), user);
        emailService.sendPasswordResetSuccessEmail(user.getEmail());

        return true;
    }

    public boolean resetPassword(String token, String newPassword) {
        User user = userService.findByResetToken(token).orElse(null);
        if (user == null) {
            return false;
        }

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            return false;
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetCode(null);
        user.setResetTokenExpiry(null);

        userService.update(user.getId(), user);
        emailService.sendPasswordResetSuccessEmail(user.getEmail());

        return true;
    }


    public User findUserByToken(String token) {
        User user = userService.findByResetToken(token).orElseThrow(() -> new NotFoundException("Token not found"));
        return user;
    }
}