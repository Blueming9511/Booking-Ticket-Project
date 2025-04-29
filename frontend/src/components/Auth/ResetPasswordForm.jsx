// components/Auth/ResetPasswordForm.jsx
import React from "react";
import {Form, Input, Button} from "antd";
import {LockOutlined} from "@ant-design/icons";
import {forgotPasswordService} from "./apiService.js";

const ResetPasswordForm = ({email, token, setLoading, messageApi, setCurrentStep}) => {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const response = await forgotPasswordService.resetPassword(token, values.password);
            if (response.success) {
                messageApi.success("Password reset successful!");
                setCurrentStep(3);
            } else {
                messageApi.error(response.message || "Failed to reset password");
            }
        } catch (error) {
            console.log(error)
            messageApi.error(
                error.response?.message || "An error occurred. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            name="resetPassword"
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
        >
            <Form.Item
                name="password"
                label="New Password"
                rules={[
                    {
                        required: true,
                        message: "Please enter your new password",
                    },
                    {
                        min: 8,
                        message: "Password must be at least 8 characters",
                    },
                ]}
                hasFeedback
            >
                <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon"/>}
                    placeholder="New password"
                />
            </Form.Item>

            <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={["password"]}
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: "Please confirm your password",
                    },
                    ({getFieldValue}) => ({
                        validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(
                                new Error("The two passwords do not match")
                            );
                        },
                    }),
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon"/>}
                    placeholder="Confirm password"
                />
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    className="bg-red-600 hover:bg-red-700 w-full h-10 mt-4"
                    size="large"
                >
                    Reset Password
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ResetPasswordForm;