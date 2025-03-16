import React from "react";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen  bg-gray-100">
      <div className="bg-white p-8 px-15 rounded-2xl w-lg shadow-lg">
        {/* Title */}
        <h2 className="text-3xl font-bold text-left text-gray-800 mb-6">
          SIGN IN TO YOUR <br></br>TICKET ACCOUNT
        </h2>

        {/* Username Input */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">Username</label>
          <input
            type="text"
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your username"
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">Password</label>
          <input
            type="password"
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your password"
          />
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2 cursor-pointer" />
            Remember me
          </label>
          <a href="#" className="hover:text-blue-500">Forgot password?</a>
        </div>

        {/* Login Button */}
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-lg hover:bg-blue-700 transition duration-300 cursor-pointer">
          Sign In
        </button>

        {/* Divider */}
        <div className="text-center my-4 text-gray-400 text-sm">or</div>

        {/* Google Login */}
        <button
          className="flex items-center justify-center w-full border py-3 rounded-lg hover:bg-gray-100 transition duration-300 cursor-pointer"
          onClick={() => (window.location.href = "http://localhost:8080/oauth2/authorization/google")}
        >
          <FcGoogle className="text-2xl mr-2" />
          Sign in with Google
        </button>

        {/* Signup Link */}
        <p className="text-center text-gray-600 mt-4 text-sm">
          Don't have an account? <a href="#" className="text-blue-500 font-medium">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
