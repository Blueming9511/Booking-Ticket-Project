// pages/ForgotPassword/ForgotPassword.jsx - Updated main component
import React, {useEffect, useState} from "react";
import {
    Typography,
    message,
    Spin,
    Flex,
    Card,
    Row,
    Col,
    ConfigProvider,
    Steps
} from "antd";
import { Link } from 'react-router-dom';

// Import components
import EmailForm from "../components/Auth/EmailForm.jsx";
import OtpForm from "../components/Auth/OtpForm";
import ResetPasswordForm from "../components/Auth/ResetPasswordForm";
import SuccessResult from "../components/Auth/SuccessResult";

// Import shared styles
import { sideImageUrl, themeConfig } from "../components/Auth/style";

const { Title, Text } = Typography;

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    // State to track the current step in the password reset flow
    const [currentStep, setCurrentStep] = useState(0);
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenFromUrl = params.get('token');

        if (tokenFromUrl) {
            setToken(tokenFromUrl);
            setCurrentStep(2);
        }
    }, [location]);

    // Step content mapping
    const STEPS = [
        {
            title: 'Email',
            content: (
                <EmailForm
                    setLoading={setLoading}
                    messageApi={messageApi}
                    setCurrentStep={setCurrentStep}
                    setEmail={setEmail}
                />
            )
        },
        {
            title: 'Verify',
            content: (
                <OtpForm
                    email={email}
                    setLoading={setLoading}
                    messageApi={messageApi}
                    setCurrentStep={setCurrentStep}
                />
            )
        },
        {
            title: 'Reset',
            content: (
                <ResetPasswordForm
                    email={email}
                    setLoading={setLoading}
                    messageApi={messageApi}
                    setCurrentStep={setCurrentStep}
                    token={token}
                />
            )
        },
        {
            title: 'Success',
            content: <SuccessResult />
        }
    ];

    // Loading message based on current step
    const loadingMessages = [
        "Sending...",
        "Verifying...",
        "Resetting...",
        "Redirecting..."
    ];

    return (
        <ConfigProvider theme={themeConfig}>
            {contextHolder}
            <Flex
                justify="center"
                align="center"
                className="min-h-screen bg-gradient-to-br from-red-50 via-gray-50 to-red-100 p-4"
            >
                {/* --- Main Card Container --- */}
                <Card
                    className="w-full max-w-4xl shadow-xl bg-white rounded-xl border border-gray-200 overflow-hidden"
                    variant={"borderless"}
                    styles={{body: {padding: 0}}}
                >
                    <Row>
                        <Col
                            xs={24}
                            md={14}
                            className="p-8 sm:p-12"
                        >
                            <div className="text-center mb-8 md:text-left">
                                <Title level={3} className="!text-gray-800 !mb-2">
                                    {currentStep === 3 ? "Success" : "Reset Your Password"}
                                </Title>
                            </div>

                            {currentStep < 3 && (
                                <Steps
                                    current={currentStep}
                                    className="mb-8"
                                    size="small"
                                    items={STEPS.slice(0, 3).map(step => ({ title: step.title }))}
                                />
                            )}

                            <Spin spinning={loading} tip={loadingMessages[currentStep]}>
                                {STEPS[currentStep].content}
                            </Spin>

                            {currentStep < 3 && (
                                <Text className="block text-center text-gray-600 mt-6 text-sm">
                                    Remember your password?{" "}
                                    <Link to="/login" className="text-red-600 hover:text-red-700 font-medium transition-colors">
                                        Back to login
                                    </Link>
                                </Text>
                            )}
                        </Col>

                        {/* --- Image Column --- */}
                        <Col
                            xs={0}
                            md={10}
                            className="relative bg-gray-100"
                        >
                            <img
                                src={sideImageUrl}
                                alt="Tickets and events illustration"
                                className="w-full h-full object-cover"
                            />
                        </Col>
                    </Row>
                </Card>
            </Flex>
        </ConfigProvider>
    );
};

export default ForgotPassword;