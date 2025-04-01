import React from "react";
import { Form, Input, Select, Row, Col } from "antd";

const { Option } = Select;

const ModalSeatForm = ({ form, onFinish, initialValues }) => {

  console.log(form.getFieldsValue());
  console.log(initialValues)
  const typeOptions = [
    { value: "Standard", label: "Standard" },
    { value: "VIP", label: "VIP" },
    { value: "Couple", label: "Couple" },
  ];

  const statusOptions = [
    { value: "Available", label: "Available" },
    { value: "Booked", label: "Booked" },
    { value: "Maintenance", label: "Maintenance" },
  ];

  const cinemaOptions = [
    { value: "CGV Vincom Mega Mall", label: "CGV Vincom Mega Mall" },
    { value: "CGV Vincom Plaza", label: "CGV Vincom Plaza" },
    { value: "CGV Vincom City", label: "CGV Vincom City" },
    { value: "CGV Vincom Plaza 2", label: "CGV Vincom Plaza 2" },
  ];

  const roomOptions = [
    { value: "Screen 1", label: "Screen 1" },
    { value: "Screen 2", label: "Screen 2" },
    { value: "Screen 3", label: "Screen 3" },
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
            name="cinema"
            label="Cinema"
            rules={[{ required: true, message: "Please select cinema!" }]}
          >
            <Select
              placeholder="Select cinema"
            >
              {cinemaOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="number"
            label="Seat Number"
            rules={[
              { required: true, message: "Please input seat number!" },
              {
                pattern: /^\d{2}$/,
                message: "Number must be 2 digits (e.g., 01)",
              },
            ]}
          >
            <Input placeholder="e.g. 01" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Seat Type"
            rules={[{ required: true, message: "Please select seat type!" }]}
          >
            <Select placeholder="Select seat type">
              {typeOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="room"
            label="Room"
            rules={[{ required: true, message: "Please select room!" }]}
          >
            <Select placeholder="Select room">
              {roomOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="row"
            label="Row"
            rules={[
              { required: true, message: "Please input row!" },
              {
                pattern: /^[A-Z]$/,
                message: "Row must be a single uppercase letter (e.g., A)",
              },
            ]}
          >
            <Input placeholder="e.g. A" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status!" }]}
          >
            <Select placeholder="Select status">
              {statusOptions.map((option) => (
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

export default ModalSeatForm;
