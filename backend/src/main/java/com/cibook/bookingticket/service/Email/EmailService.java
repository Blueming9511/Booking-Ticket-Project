package com.cibook.bookingticket.service.Email;

import com.cibook.bookingticket.dto.BookingResponseDto;
import com.cibook.bookingticket.model.BookingDetail;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${application.name:Cinemaxx}")
    private String applicationName;

    @Value("${application.url:https://localhost:5173}")
    private String applicationUrl;

    public void sendSimpleMail(String to, String subject, String text) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text, true);

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    public void sendLoginNotification(String to, LocalDateTime loginTime) {
        try {
            Map<String, Object> templateModel = new HashMap<>();
            templateModel.put("applicationName", applicationName);
            templateModel.put("loginTime", loginTime.format(DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm:ss")));
            templateModel.put("applicationUrl", applicationUrl);

            String htmlContent = processTemplate("login", templateModel);

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Login Notification - " + applicationName);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send login notification email: " + e.getMessage());
        }
    }

    public void sendOtpVerification(String to, String otp) {
        try {
            Map<String, Object> templateModel = new HashMap<>();
            templateModel.put("applicationName", applicationName);
            templateModel.put("otp", otp);
            templateModel.put("expiryMinutes", 15);
            templateModel.put("applicationUrl", applicationUrl);

            String htmlContent = processTemplate("otp", templateModel);

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Your Verification Code - " + applicationName);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send OTP verification email: " + e.getMessage());
        }
    }

    public void sendVerificationSuccess(String to) {
        try {
            Map<String, Object> templateModel = new HashMap<>();
            templateModel.put("applicationName", applicationName);
            templateModel.put("applicationUrl", applicationUrl);

            String htmlContent = processTemplate("verify", templateModel);

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Email Verification Successful - " + applicationName);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send verification success email: " + e.getMessage());
        }
    }

    public void sendPasswordResetEmail(String to, String resetCode, String resetLink) {
        try {
            Map<String, Object> templateModel = new HashMap<>();
            templateModel.put("applicationName", applicationName);
            templateModel.put("resetCode", resetCode);
            templateModel.put("resetLink", resetLink);
            templateModel.put("expiryMinutes", 15);
            templateModel.put("applicationUrl", applicationUrl);

            String htmlContent = processTemplate("forgot", templateModel);

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Password Reset Request - " + applicationName);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send password reset email: " + e.getMessage());
        }
    }

    public void sendPasswordResetSuccessEmail(String to) {
        try {
            Map<String, Object> templateModel = new HashMap<>();
            templateModel.put("applicationName", applicationName);
            templateModel.put("applicationUrl", applicationUrl);

            String htmlContent = processTemplate("forgot-success", templateModel);

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Password Reset Successful - " + applicationName);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send password reset success email: " + e.getMessage());
        }
    }

    public void sendOrderConfirmationEmail(String to, BookingResponseDto response) {
        try {
            Map<String, Object> templateModel = new HashMap<>();
            templateModel.put("applicationName", applicationName);
            templateModel.put("applicationUrl", applicationUrl);
            templateModel.put("booking", response);
            templateModel.put("customerName", response.getUser().getName() != null ? response.getUser().getName() : "Valued Customer");

            String htmlContent = processTemplate("order-confirmation", templateModel);
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Your Booking is Confirmed | " + applicationName);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send booking confirmation email: " + e.getMessage());
        }
    }

    private String processTemplate(String templateName, Map<String, Object> templateModel) {
        Context context = new Context();
        context.setVariables(templateModel);
        return templateEngine.process(templateName, context);
    }
}