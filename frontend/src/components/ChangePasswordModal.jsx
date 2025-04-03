// ChangePasswordModal.js
import React from 'react';
import { Modal, Form, Button, Input } from 'antd';
import { LockOutlined } from '@ant-design/icons';

const { Password } = Input;

const ChangePasswordModal = ({ visible, onCancel, onFinish, form }) => (
  <Modal
    title="Change Password"
    open={visible}
    onCancel={onCancel}
    footer={null}
  >
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="currentPassword"
        label="Current Password"
        rules={[
          { required: true, message: 'Please enter your current password' }
        ]}
      >
        <Password
          prefix={<LockOutlined />}
          autoComplete="current-password"
        />
      </Form.Item>

      <Form.Item
        name="newPassword"
        label="New Password"
        rules={[
          { required: true, message: 'Please enter your new password' }
        ]}
      >
        <Password prefix={<LockOutlined />} autoComplete="new-password" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Change Password
        </Button>
      </Form.Item>
    </Form>
  </Modal>
);

export default ChangePasswordModal;