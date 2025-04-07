import React from "react";
import { Form, Input, Select, Row, Col, Upload, Button } from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const ModalUserForm = ({ form, onFinish, initialValues = {} }) => {
  const roleOptions = [
    { value: "ADMIN", label: "Admin" },
    { value: "PROVIDER", label: "Provider" },
    { value: "USER", label: "User" },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: "Please input username!" },
              { max: 50, message: "Username cannot exceed 50 characters" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Enter username" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input email!" },
              { type: 'email', message: 'Please enter a valid email' },
              { max: 100, message: "Email cannot exceed 100 characters" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: !initialValues._id, message: "Please input password!" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select role">
              {roleOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="avatar"
        label="Avatar"
      >
        <Upload listType="picture">
          <Button icon={<UploadOutlined />}>Upload Avatar</Button>
        </Upload>
      </Form.Item>
    </Form>
  );
};

export default ModalUserForm;