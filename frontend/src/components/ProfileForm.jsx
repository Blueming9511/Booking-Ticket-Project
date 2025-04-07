import React from 'react';
import { Form, Input, Row, Col, Radio, Button } from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  LockOutlined, 
  EditOutlined, 
  SaveOutlined 
} from '@ant-design/icons';

const { Password } = Input;

const ProfileForm = ({ 
  form, 
  isEditing, 
  onFinish, 
  onEditClick, 
  onSaveClick, 
  onChangePasswordClick,
  userData
}) => (
  <Form
    form={form}
    layout="vertical"
    onFinish={onFinish}
    initialValues={userData} // Set initial values here
  >
    <Row gutter={16}>
      <Col xs={24} md={12}>
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: 'Please enter your name' }]}
        >
          <Input prefix={<UserOutlined />} disabled={!isEditing} />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item name="email" label="Email">
          <Input prefix={<MailOutlined />} disabled />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={16}>
      <Col xs={24} md={12}>
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            { required: true, message: 'Please enter your phone number' },
            {
              pattern: /^[0-9]+$/,
              message: 'Please enter valid phone number'
            }
          ]}
        >
          <Input prefix={<PhoneOutlined />} disabled={!isEditing} />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item
          name="DOB"
          label="Date of Birth"
          rules={[
            { required: true, message: 'Please enter your date of birth' }
          ]}
        >
          <Input type="date" disabled={!isEditing} />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={16}>
      <Col xs={24} md={12}>
        <Form.Item
          name="gender"
          label="Gender"
          rules={[
            { required: true, message: 'Please select your gender' }
          ]}
        >
          <Radio.Group disabled={!isEditing}>
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
            <Radio value="other">Other</Radio>
          </Radio.Group>
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item label="Password">
          <div className="flex items-center">
            <Password
              placeholder="••••••••"
              disabled
              className="w-full mr-2"
              autoComplete="current-password"
            />
            <Button
              type="primary"
              icon={<LockOutlined />}
              onClick={onChangePasswordClick}
              disabled={!isEditing}
            >
              Change
            </Button>
          </div>
        </Form.Item>
      </Col>
    </Row>

    <Form.Item>
      {!isEditing ? (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={onEditClick}
          style={{ width: '100%' }}
        >
          Update Profile
        </Button>
      ) : (
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={onSaveClick}
          style={{ width: '100%' }}
        >
          Save Changes
        </Button>
      )}
    </Form.Item>
  </Form>
);

export default ProfileForm;
