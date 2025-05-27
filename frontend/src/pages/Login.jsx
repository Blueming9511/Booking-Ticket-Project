import React, {useState} from "react";
// Import Row and Col for layout
import {
    Input, Button, Checkbox, Typography, Divider, Form, message, Spin, Flex, Card, Row, Col, ConfigProvider
} from "antd"; // Added ConfigProvider
import {FcGoogle} from "react-icons/fc";
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {Link, useNavigate} from 'react-router-dom';
import axios from "axios";

const {Title, Text, Paragraph} = Typography;

// --- Helper Styles (Red & White Theme) ---
const inputClassName = "!bg-white !border-gray-300 !text-gray-900 placeholder:!text-gray-400 focus:!border-red-600 focus:ring-1 focus:ring-red-600 !rounded-md";
const labelClassName = "text-gray-700 font-medium";
const iconClassName = "site-form-item-icon text-gray-500 pr-2";
const sideImageUrl = 'https://i.pinimg.com/736x/62/74/e2/6274e27e43cfb816c6fcfeaefdd9b21d.jpg ';

const Login = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const onFinish = async (values) => {
        setLoading(true);
        console.log("Success (Form values):", values);
        try {
            const response = await axios.post(`${API_URL}/auth/login`, values, {
                withCredentials: true
            });
            console.log(response.data)
            const name = response?.data?.name ?? "Anonymous";
            messageApi.success(`Welcome back, ${name}!`);
            navigate('/');
        } catch (error) {
            console.error("Login failed:", error);
            messageApi.error("Login failed. Please check credentials.");
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed (Validation errors):", errorInfo);
    };

    const handleGoogleSignIn = () => {
        const googleAuthUrl = import.meta.env.VITE_GOOGLE_AUTH_URL;
        console.log("Redirecting to Google Auth...");
        window.location.href = googleAuthUrl;
    };

    const themeConfig = {
        token: {
            colorPrimary: '#dc2626',
        },
    };

    return (<ConfigProvider theme={themeConfig}>
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
                            {/* Header */}
                            <div className="text-center mb-8 md:text-left">
                                <Title level={3} className="!text-gray-800 !mb-2">
                                    Sign in to Your Account
                                </Title>
                                <Paragraph className="text-gray-500">
                                    Enter your credentials to access your tickets.
                                </Paragraph>
                            </div>

                            {/* Wrap Form in Spin */}
                            <Spin spinning={loading} tip="Signing In...">
                                <Form
                                    form={form}
                                    name="login"
                                    layout="vertical"
                                    initialValues={{remember: true}}
                                    onFinish={onFinish}
                                    onFinishFailed={onFinishFailed}
                                    requiredMark="optional"
                                    autoComplete="off"
                                >
                                    {/* Username Input */}
                                    <Form.Item
                                        name="email"
                                        label={<span className={labelClassName}>Email</span>}
                                        rules={[{required: true, message: "Please enter your email!"}]}
                                    >
                                        <Input
                                            prefix={<UserOutlined className={iconClassName}/>}
                                            placeholder="e.g. john@example.com"
                                            size="large"
                                            className={inputClassName} // Uses red focus state
                                            autoComplete="email"
                                        />
                                    </Form.Item>

                                    {/* Password Input */}
                                    <Form.Item
                                        name="password"
                                        label={<span className={labelClassName}>Password</span>}
                                        rules={[{required: true, message: "Please enter your password!"}]}
                                    >
                                        <Input.Password
                                            prefix={<LockOutlined className={iconClassName}/>}
                                            placeholder="Enter your password"
                                            size="large"
                                            className={inputClassName} // Uses red focus state
                                            autoComplete="current-password"
                                        />
                                    </Form.Item>

                                    {/* Remember Me & Forgot Password Row */}
                                    <Form.Item className="-mt-2 mb-6">
                                        <Flex justify="space-between" align="center" className="text-sm">
                                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                                {/* Checkbox will inherit primaryColor from ConfigProvider */}
                                                <Checkbox>
                                                    <span className="text-gray-600">Remember me</span>
                                                </Checkbox>
                                            </Form.Item>
                                            {/* Link styled with red */}
                                            <Link to="/forgot-password"
                                                  className="text-red-600 hover:text-red-700 font-medium transition-colors">
                                                Forgot password?
                                            </Link>
                                        </Flex>
                                    </Form.Item>

                                    {/* Sign In Button (Styled with Red) */}
                                    <Form.Item>
                                        <Button
                                            htmlType="submit"
                                            className="w-full !font-semibold !bg-red-600 hover:!bg-red-700 !border-red-600 hover:!border-red-700 !text-white !transition-colors"
                                            size="large"
                                            loading={loading}
                                        >
                                            Sign In
                                        </Button>
                                    </Form.Item>

                                    {/* Divider */}
                                    <Divider className="!text-gray-500 !text-sm !font-normal">or continue with</Divider>

                                    <Form.Item>
                                        <Button
                                            icon={<FcGoogle className="!text-xl"/>}
                                            className="flex items-center justify-center w-full !border-gray-300 !text-gray-700 hover:!border-red-500 hover:!text-red-600"
                                            size="large"
                                            onClick={handleGoogleSignIn}
                                        >
                                            Sign in with Google
                                        </Button>
                                    </Form.Item>

                                    {/* Sign Up Link (Styled with Red) */}
                                    <Text className="block text-center text-gray-600 mt-6 text-sm">
                                        Don't have an account?{" "}
                                        <Link to="/register"
                                              className="text-red-600 hover:text-red-700 font-medium transition-colors">
                                            Sign up now
                                        </Link>
                                    </Text>
                                </Form>
                            </Spin>
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
        </ConfigProvider>);
};

export default Login;