import React, { useState } from "react";
import { Input, Button, Checkbox, Typography, Divider } from "antd";
import { FcGoogle } from "react-icons/fc";

const { Title, Text } = Typography;

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Logging in with:", form);
    // Add login logic here
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 ">
      <div className="bg-white p-5 rounded-2xl shadow-lg max-w-sm w-full">
        <Title level={3} className="text-gray-800">
          SIGN IN TO YOUR <br /> TICKET ACCOUNT
        </Title>

        <div className="mb-4">
          <Text className="block text-gray-600">Username</Text>
          <Input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter your username"
          />
        </div>

        <div className="mb-4">
          <Text className="block text-gray-600">Password</Text>
          <Input.Password
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>

        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <Checkbox>Remember me</Checkbox>
          <a href="#" className="hover:text-blue-500">
            Forgot password?
          </a>
        </div>

        <Button type="primary" className="w-full" onClick={handleSubmit}>
          Sign In
        </Button>

        <Divider>or</Divider>

        <Button
          className="flex items-center justify-center w-full"
          onClick={() => (window.location.href = process.env.REACT_APP_GOOGLE_AUTH_URL)}
        >
          <FcGoogle className="text-2xl mr-2" />
          Sign in with Google
        </Button>

        <Text className="block text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="#" className="text-blue-500 font-medium">
            Sign up
          </a>
        </Text>
      </div>
    </div>
  );
};

export default Login;
