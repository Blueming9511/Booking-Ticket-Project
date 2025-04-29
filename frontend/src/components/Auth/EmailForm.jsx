// components/EmailForm.jsx
import React from "react";
import { Form, Input, Button, Typography } from "antd";
import { MailOutlined } from '@ant-design/icons';
import axios from "axios";
import {forgotPasswordService} from "./apiService.js";
const { Paragraph } = Typography;
// --- Helper Styles ---
const inputClassName = "!bg-white !border-gray-300 !text-gray-900 placeholder:!text-gray-400 focus:!border-red-600 focus:ring-1 focus:ring-red-600 !rounded-md";
const labelClassName = "text-gray-700 font-medium";
const iconClassName = "site-form-item-icon text-gray-500 pr-2";

const EmailForm = ({ setLoading, messageApi, setCurrentStep, setEmail }) => {
    const [form] = Form.useForm();
    const API_URL = import.meta.env.VITE_API_URL;

    // Step 1: Submit email for password reset
    const handleEmailSubmit = async (values) => {
        setLoading(true);
        try {
            // Store email for future steps
            setEmail(values.email);

            // Send request to backend to initiate password reset
            const response = await forgotPasswordService.sendResetCode(values.email);

            messageApi.success("Reset code sent to your email!");
            setCurrentStep(1);
        } catch (error) {
            console.error("Failed to send reset email:", error);
            messageApi.error(error.response?.data?.message || "Failed to send reset email. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            name="emailForm"
            layout="vertical"
            onFinish={handleEmailSubmit}
            autoComplete="off"
            requiredMark="optional"
        >
            <Paragraph className="text-gray-500 mb-6">
                Enter your email address and we'll send you a code to reset your password.
            </Paragraph>

            <Form.Item
                name="email"
                label={<span className={labelClassName}>Email</span>}
                rules={[
                    { required: true, message: "Please enter your email!" },
                    { type: 'email', message: "Please enter a valid email!" }
                ]}
            >
                <Input
                    prefix={<MailOutlined className={iconClassName} />}
                    placeholder="e.g. john@example.com"
                    size="large"
                    className={inputClassName}
                    autoComplete="email"
                />
            </Form.Item>

            <Form.Item className="mt-6">
                <Button
                    htmlType="submit"
                    className="w-full !font-semibold !bg-red-600 hover:!bg-red-700 !border-red-600 hover:!border-red-700 !text-white !transition-colors"
                    size="large"
                >
                    Send Reset Code
                </Button>
            </Form.Item>
        </Form>
    );
};

export default EmailForm;