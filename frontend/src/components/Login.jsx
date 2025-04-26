import React from 'react';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Card, Typography, Flex, Space } from 'antd';
import { Link } from 'react-router-dom'; // Optional: for Register link

const { Title, Text } = Typography;

const Login = () => {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    alert(`Login attempt with Username: ${values.username}, Password: ${values.password}`);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    // Centering container with movie-themed background
    <Flex
      justify="center"
      align="center"
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-slate-800 p-4" // Dark gradient background
    >
      <Card
         className="w-full max-w-md shadow-xl bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg border-none" // Dark, slightly transparent card
         bordered={false} // Remove default card border
      >
        <div className="text-center mb-8">
          <Title level={2} className="!text-white">
            Sign In
          </Title>
          <Text className="text-gray-400">Access your movie account</Text>
        </div>

        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical" // Labels on top
          requiredMark={false} // Hide default required mark
        >
          <Form.Item
            name="username"
            label={<span className="text-gray-300">Username or Email</span>} // Custom label color
            rules={[
              {
                required: true,
                message: 'Please input your Username or Email!',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon text-gray-400" />}
              placeholder="Username or Email"
              size="large" // Make inputs slightly larger
              className="!bg-gray-700 !border-gray-600 !text-white placeholder:!text-gray-500 focus:!border-primary focus:!shadow-none" // Custom input styling
            />
          </Form.Item>

          <Form.Item
            name="password"
             label={<span className="text-gray-300">Password</span>}
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon text-gray-400" />}
              type="password"
              placeholder="Password"
               size="large"
              className="!bg-gray-700 !border-gray-600 !text-white placeholder:!text-gray-500 focus:!border-primary focus:!shadow-none" // Custom input styling
            />
          </Form.Item>

          <Form.Item>
             <Flex justify="space-between" align="center">
                 <Form.Item name="remember" valuePropName="checked" noStyle>
                   <Checkbox className="login-form-remember text-gray-400">
                       <span className="text-gray-400">Remember me</span>
                   </Checkbox>
                 </Form.Item>
                {/* Use standard <a> if not using react-router-dom */}
                <Link className="login-form-forgot text-primary hover:text-red-400 transition-colors" to="/forgot-password">
                  Forgot password?
                </Link>
             </Flex>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              danger // Use Ant Design's danger prop for red styling
              className="login-form-button w-full !font-semibold" // Full width, bold
              size="large"
            >
              Log in
            </Button>
          </Form.Item>

           <div className="text-center text-gray-400">
              Or{' '}
              {/* Use standard <a> if not using react-router-dom */}
              <Link to="/register" className="text-primary hover:text-red-400 transition-colors font-medium">
                 register now!
              </Link>
           </div>
        </Form>
      </Card>
    </Flex>
  );
};

export default Login;