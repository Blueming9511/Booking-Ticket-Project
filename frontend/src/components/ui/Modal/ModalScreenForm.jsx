import React, { useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Row,
  Col,
} from 'antd';

const { Option } = Select;

const ModalScreenForm = ({ form, onFinish, initialValues={} }) => {
  const typeOptions = [
    { value: 'Standard', label: 'Standard' },
    { value: 'VIP', label: 'VIP' },
    { value: 'IMAX', label: 'IMAX' },
    { value: '4DX', label: '4DX' },
    { value: 'Deluxe', label: 'Deluxe' },
    { value: 'Premium', label: 'Premium' },
    { value: '3D', label: '3D' },
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Renovating', label: 'Renovating' },
    { value: 'Closed', label: 'Closed' },
  ];

  const cinemaOptions = [
    { value: 'CGV Vincom Mega Mall', label: 'CGV Vincom Mega Mall' },
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
            name="type"
            label="Screen Type"
            rules={[{ required: true, message: 'Please select screen type!' }]}
          >
            <Select placeholder="Select screen type">
              {typeOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="capacity"
            label="Capacity"
            rules={[
              { required: true, message: 'Please input capacity!' },
              { type: 'number', min: 10, max: 500, message: 'Capacity must be between 10-500' },
            ]}
          >
            <InputNumber
              min={10}
              max={500}
              style={{ width: '100%' }}
              placeholder="e.g. 120"
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status!' }]}
          >
            <Select placeholder="Select status">
              {statusOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="cinema"
            label="Cinema"
            rules={[{ required: true, message: 'Please select cinema!' }]}
          >
            <Select placeholder="Select cinema">
              {cinemaOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default ModalScreenForm;