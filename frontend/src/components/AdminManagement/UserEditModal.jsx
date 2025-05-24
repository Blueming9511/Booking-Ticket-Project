import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  Avatar, 
  Upload, 
  Button, 
  message,
  Switch
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  UploadOutlined,
  CameraOutlined
} from '@ant-design/icons';

const { Option } = Select;

const UserEditModal = ({ 
  visible, 
  onCancel, 
  onFinish, 
  initialValues,
  loading 
}) => {
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isBanned, setIsBanned] = useState(false);

  useEffect(() => {
    console.log(initialValues)
    if (initialValues) {
      form.setFieldsValue({
        id: initialValues.id,
        name: initialValues.name,
        email: initialValues.email,
        phoneNumber: initialValues.phoneNumber,
        role: initialValues.role
      });
      setAvatarUrl(initialValues.avatar);
      setIsBanned(initialValues.isBanned || false);
    }
  }, [initialValues, form]);

  const handleUploadChange = (info) => {
    if (info.file.status === 'done') {
      // Giả sử API trả về URL sau khi upload
      const url = info.file.response?.url || URL.createObjectURL(info.file.originFileObj);
      setAvatarUrl(url);
      message.success(`${info.file.name} file uploaded successfully`);
    }
  };

  const uploadProps = {
    name: 'avatar',
    action: 'https://your-api-upload-endpoint.com/upload',
    showUploadList: false,
    onChange: handleUploadChange,
  };

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        const updatedValues = {
          ...values,
          avatar: avatarUrl,
          id: initialValues.id,
          isBanned
        };
        onFinish(updatedValues);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Edit User"
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
      width={700}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading}
          onClick={handleSubmit}
        >
          Save Changes
        </Button>,
      ]}
    >
      <div className="flex gap-6">
        {/* Left Column - Avatar */}
        <div className="flex flex-col items-center w-1/4">
          <Avatar 
            src={avatarUrl} 
            icon={<UserOutlined />} 
            size={120}
            className="mb-4"
          />
          <Upload {...uploadProps}>
            <Button icon={<CameraOutlined />}>Change Avatar</Button>
          </Upload>
          
          <div className="mt-6 w-full">
            <div className="font-medium mb-2">Account Status</div>
            <div className="flex items-center justify-between">
              <span>{isBanned ? 'Banned' : 'Active'}</span>
              <Switch
                checked={!isBanned}
                onChange={(checked) => setIsBanned(!checked)}
                className={isBanned ? 'bg-red-500' : 'bg-green-500'}
              />
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="flex-1">
          <Form
            form={form}
            layout="vertical"
          >
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: 'Please input the name!' }]}
            >
              <Input 
                prefix={<UserOutlined className="text-gray-400" />} 
                placeholder="Enter full name" 
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input the email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input 
                prefix={<MailOutlined className="text-gray-400" />} 
                placeholder="Enter email" 
                disabled // Thường không cho phép thay đổi email
              />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[
                { pattern: /^[0-9]+$/, message: 'Please enter valid phone number!' }
              ]}
            >
              <Input 
                prefix={<PhoneOutlined className="text-gray-400" />} 
                placeholder="Enter phone number" 
              />
            </Form.Item>

            <Form.Item
              name="role"
              label="User Role"
              rules={[{ required: true, message: 'Please select a role!' }]}
            >
              <Select placeholder="Select a role">
                <Option value="ADMIN">Admin</Option>
                <Option value="STAFF">Staff</Option>
                <Option value="USER">User</Option>
              </Select>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default UserEditModal;