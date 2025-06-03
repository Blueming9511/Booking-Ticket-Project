// components/SuccessResult.jsx
import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from 'react-router-dom';

const SuccessResult = () => {
    const navigate = useNavigate();

    // Navigate to login
    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <Result
            status="success"
            title="Password Reset Successful!"
            subTitle="Your password has been successfully reset."
            extra={[
                <Button
                    key="login"
                    className="!font-semibold !bg-red-600 hover:!bg-red-700 !border-red-600 hover:!border-red-700 !text-white !transition-colors"
                    size="large"
                    onClick={handleLoginRedirect}
                >
                    Back to Login
                </Button>
            ]}
        />
    );
};

export default SuccessResult;