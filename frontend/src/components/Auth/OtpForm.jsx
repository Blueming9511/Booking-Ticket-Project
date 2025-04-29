// components/OtpForm.jsx
import React from "react";
import {Form, Input, Button, Typography, Flex} from "antd";
import { KeyOutlined } from '@ant-design/icons';
import {forgotPasswordService} from "./apiService.js";
const { Paragraph, Text } = Typography;

// --- Helper Styles ---
const inputClassName = "!bg-white !border-gray-300 !text-gray-900 placeholder:!text-gray-400 focus:!border-red-600 focus:ring-1 focus:ring-red-600 !rounded-md";
const labelClassName = "text-gray-700 font-medium";
const iconClassName = "site-form-item-icon text-gray-500 pr-2";

const OtpForm = ({ email, setLoading, messageApi, setCurrentStep }) => {
  const [form] = Form.useForm();
  const API_URL = import.meta.env.VITE_API_URL;

  // Verify OTP
  const handleOtpVerify = async (values) => {
    setLoading(true);
    try {
      // Verify OTP with backend
      const response = await forgotPasswordService.verifyOtp(email, values.otp);
      messageApi.success("OTP verified successfully!");
      setCurrentStep(2); // Move to reset password step
    } catch (error) {
      console.error("OTP verification failed:", error);
      messageApi.error(error.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle resend code
  const handleResendCode = async () => {
    setLoading(true);
    try {
      // Resend OTP
      const response = await forgotPasswordService.sendResetCode(email);
      messageApi.success("New code sent to your email!");
      form.resetFields();
    } catch (error) {
      console.error("Failed to resend code:", error);
      messageApi.error(error.response?.data?.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle back to email step
  const handleBackToEmail = () => {
    setCurrentStep(0);
  };

  return (
    <Form
      form={form}
      name="otpForm"
      layout="vertical"
      onFinish={handleOtpVerify}
      autoComplete="off"
      requiredMark="optional"
    >
      <Paragraph className="text-gray-500 mb-6">
        We've sent a verification code to <strong>{email}</strong>. Enter the code below.
      </Paragraph>

      <Form.Item
        name="otp"
        label={<span className={labelClassName}>Verification Code</span>}
        rules={[{ required: true, message: "Please enter the verification code!" }]}
      >
        <Input
          prefix={<KeyOutlined className={iconClassName} />}
          placeholder="Enter the 6-digit code"
          size="large"
          className={inputClassName}
          maxLength={6}
        />
      </Form.Item>

      <Form.Item className="mt-6">
        <Button
          htmlType="submit"
          className="w-full !font-semibold !bg-red-600 hover:!bg-red-700 !border-red-600 hover:!border-red-700 !text-white !transition-colors"
          size="large"
        >
          Verify Code
        </Button>
      </Form.Item>

      <Flex className="justify-between items-center text-center text-gray-600 mt-4 text-sm">
        <Button
          type="link"
          className="!p-0 !text-red-600 hover:!text-red-700 !font-medium !transition-colors"
          onClick={handleBackToEmail}
        >
          Change email
        </Button>

        <Button
          type="link"
          className="!p-0 !text-red-600 hover:!text-red-700 !font-medium !transition-colors"
          onClick={handleResendCode}
        >
          Resend code
        </Button>
      </Flex>
    </Form>
  );
};

export default OtpForm;