import React, {useState} from 'react';
import {
    LockOutlined,
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
// Import Row, Col, DatePicker AND ConfigProvider
import {Button, Form, Input, Card, Typography, Flex, message, Spin, Row, Col, DatePicker, ConfigProvider} from 'antd';
import {Link} from 'react-router-dom';
import dayjs from 'dayjs';
import axios from "axios";

const {Title, Text} = Typography;

// --- Helper Styles (Red & White Theme) ---
const inputClassName = "!bg-white !border-gray-300 !text-gray-900 placeholder:!text-gray-400 focus:!border-red-600 focus:ring-1 focus:ring-red-600 !rounded-md"; // Red focus
const labelClassName = "text-gray-700 font-medium";
const iconClassName = "site-form-item-icon text-gray-500 pr-2";

// --- Custom Validator for Minimum Age ---
// (Validators remain the same)
const validateMinAge = (minAge) => (_, value) => {
    if (!value) return Promise.resolve();
    const cutoffDate = dayjs().subtract(minAge, 'year');
    if (value.isAfter(cutoffDate)) {
        return Promise.reject(new Error(`You must be at least ${minAge} years old.`));
    }
    return Promise.resolve();
};
const validateMaxAge = (maxAge) => (_, value) => {
    if (!value) return Promise.resolve();
    const earliestDate = dayjs().subtract(maxAge, 'year');
    if (value.isBefore(earliestDate)) {
        return Promise.reject(new Error(`Date of birth seems unlikely, please check.`));
    }
    return Promise.resolve();
};
const disabledDate = (current) => {
    return current && current > dayjs().endOf('day');
};

// --- Background Image URL ---
const backgroundImageUrl = 'https://i.pinimg.com/736x/62/74/e2/6274e27e43cfb816c6fcfeaefdd9b21d.jpg';


const Register = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values) => {
        setLoading(true);
        const formattedValues = {
            ...values,
            dob: values.dob ? values.dob.format('YYYY-MM-DD') : null
        };
        console.log('Received registration values (formatted): ', formattedValues);

        try {
            await axios.post(`${API_URL}/auth/register`, formattedValues);
            messageApi.success(`Registration successful for ${values.name}! Welcome.`);
            form.resetFields();
        } catch (error) {
            console.error('Registration API call failed:', error);
            messageApi.error('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Registration Failed (Validation):', errorInfo);
    };

    // --- Ant Design Theme Configuration (Red Primary Color) ---
    // NOTE: Background image is NOT set here. It's applied via Tailwind classes.
    const themeConfig = {
        token: {
            colorPrimary: '#dc2626',
        },
    };

    return (
        <ConfigProvider theme={themeConfig}>
            {contextHolder}
            <Flex
                justify="center"
                align="center"
                className={`
          min-h-screen p-4 sm:p-6 md:p-8
          bg-cover bg-center bg-no-repeat relative
        `}
                style={{backgroundImage: `url(${backgroundImageUrl})`}}
            >
                {/* Optional: Add a semi-transparent overlay for better readability */}
                <div className="absolute inset-0 bg-black/20 z-0"></div>

                <Card
                    className="w-full max-w-2xl shadow-lg bg-white rounded-xl border border-gray-200 p-6 sm:p-10 relative z-10" // Add relative z-10
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Title level={2} className="!text-gray-800 !mb-2">
                            Create Your Account
                        </Title>
                        <Text className="text-gray-600 text-base">
                            Join us and start booking your favorite movies!
                        </Text>
                    </div>

                    <Spin spinning={loading} tip="Registering..." size="large">
                        <Form
                            form={form}
                            name="register"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            layout="vertical"
                            requiredMark="optional"
                            scrollToFirstError={{behavior: 'smooth'}}
                        >
                            {/* --- Form Items remain the same, using red theme styles --- */}

                            {/* Name */}
                            <Form.Item name="name" label={<span className={labelClassName}>Full Name</span>} rules={[{
                                required: true,
                                message: 'Please enter your full name!',
                                whitespace: true
                            }]}>
                                <Input prefix={<UserOutlined className={iconClassName}/>} placeholder="e.g. Jane Doe"
                                       size="large" className={inputClassName} autoComplete="name"/>
                            </Form.Item>

                            {/* Email */}
                            <Form.Item name="email" label={<span className={labelClassName}>Email Address</span>}
                                       rules={[{
                                           required: true,
                                           message: 'Please enter your email address!'
                                       }, {type: 'email', message: 'Please enter a valid email address!'}]}>
                                <Input prefix={<MailOutlined className={iconClassName}/>}
                                       placeholder="e.g. jane.doe@example.com" size="large" className={inputClassName}
                                       autoComplete="email"/>
                            </Form.Item>

                            {/* Phone & DOB Row */}
                            <Row gutter={[16, 0]}>
                                <Col xs={24} md={12}>
                                    <Form.Item name="phoneNumber" label={<span className={labelClassName}>Phone Number</span>}
                                               rules={[{
                                                   required: true,
                                                   message: 'Please enter your phone number!'
                                               }, {
                                                   pattern: /^[+\d\s.-]{7,20}$/,
                                                   message: 'Please enter a valid phone number!'
                                               }]}>
                                        <Input prefix={<PhoneOutlined className={iconClassName}/>}
                                               placeholder="e.g. +1 123 456 7890" size="large"
                                               className={inputClassName} autoComplete="tel"/>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="dob" label={<span className={labelClassName}>Date of Birth</span>}
                                               rules={[{
                                                   required: true,
                                                   message: 'Please select your date of birth!'
                                               }, {validator: validateMinAge(13)}, {validator: validateMaxAge(120)}]}>
                                        <DatePicker placeholder="Select Date" size="large"
                                                    className={`${inputClassName} !w-full`} format="YYYY-MM-DD"
                                                    picker="date" disabledDate={disabledDate}/>
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/* Password Row */}
                            <Row gutter={[16, 0]}>
                                <Col xs={24} md={12}>
                                    <Form.Item name="password" label={<span className={labelClassName}>Password</span>}
                                               rules={[{required: true, message: 'Please create a password!'}, {
                                                   min: 8,
                                                   message: 'Password must be at least 8 characters long.'
                                               }]} hasFeedback>
                                        <Input.Password prefix={<LockOutlined className={iconClassName}/>}
                                                        placeholder="Choose a strong password" size="large"
                                                        className={inputClassName} autoComplete="new-password"/>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="confirm"
                                               label={<span className={labelClassName}>Confirm Password</span>}
                                               dependencies={['password']} hasFeedback rules={[{
                                        required: true,
                                        message: 'Please confirm your password!'
                                    }, ({getFieldValue}) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('The passwords do not match!'));
                                        },
                                    })]}>
                                        <Input.Password prefix={<LockOutlined className={iconClassName}/>}
                                                        placeholder="Re-enter your password" size="large"
                                                        className={inputClassName} autoComplete="new-password"/>
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/* Submit Button (Red) */}
                            <Form.Item className="mt-6">
                                <Button htmlType="submit"
                                        className="w-full !font-semibold !bg-red-600 hover:!bg-red-700 !border-red-600 hover:!border-red-700 !text-white !transition-colors"
                                        size="large" loading={loading}>
                                    {loading ? 'Creating Account...' : 'Register'}
                                </Button>
                            </Form.Item>

                            {/* Link to Login (Red) */}
                            <div className="text-center text-gray-600 mt-4 text-sm">
                                Already have an account?{' '}
                                <Link to="/login"
                                      className="font-medium text-red-600 hover:text-red-700 transition-colors">
                                    Sign In
                                </Link>
                            </div>
                        </Form>
                    </Spin>
                </Card>
            </Flex>
        </ConfigProvider>
    );
};

export default Register;