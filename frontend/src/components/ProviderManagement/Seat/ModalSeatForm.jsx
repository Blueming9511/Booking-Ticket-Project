import React, { useState } from "react";
import { Form, Input, Select, Row, Col } from "antd";

const { Option } = Select;

const ModalSeatForm = ({ form, onFinish, initialValues, cinemas, rooms }) => {
  const typeOptions = [
    { value: "Standard", label: "Standard" },
    { value: "VIP", label: "VIP" },
    { value: "Couple", label: "Couple" },
  ];

  const statusOptions = [
    { value: "AVAILABLE", label: "Available" },
    { value: "BOOKED", label: "Booked" },
    { value: "MAINTAINED", label: "Maintenance" },
  ];


  const getRoomsForCinema = (cinemaId) => {
    console.log(rooms[cinemaId]);
    return rooms[cinemaId];
  };

  const cinemaOptions = cinemas;
  const [cinemaId, setCinemaId] = useState(null);
  const [roomOptions, setRooms] = useState([]);

  const handleCinemaChange = (value) => {
    setCinemaId(value);
    setRooms(getRoomsForCinema(value));
  };

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
            name="cinemaCode"
            label="Cinema"
            rules={[{ required: true, message: "Please select cinema!" }]}
          >
            <Select
              placeholder="Select cinema"
              onChange={handleCinemaChange}
              value={cinemaId}
            >
              {Object.entries(cinemaOptions).map(([value, label]) => (
                <Option key={value} value={value}>
                  {label}
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
            name="screenCode"
            label="Room"
            rules={[{ required: true, message: "Please select room!" }]}
          >
            <Select placeholder="Select room">
              {roomOptions.map((option) => {
                console.log(option);
                return (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                );
              })}
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
