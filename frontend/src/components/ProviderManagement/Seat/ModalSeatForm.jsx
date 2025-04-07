import React, { useState } from "react";
import { Form, Input, Select, Row, Col } from "antd";

const { Option } = Select;

const ModalSeatForm = ({
  form,
  onFinish,
  initialValues,
  cinemas,
  rooms,
  isEdit,
}) => {
  const typeOptions = [
    { value: "STANDARD", label: "Standard" },
    { value: "VIP", label: "VIP" },
    { value: "COU", label: "Couple" },
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

          <Form.Item name="number" label="Seat Number">
            <Input placeholder="This is auto generated" disabled={!isEdit} />
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
          {isEdit ? (
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
          ) : (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="row"
                  label="Row"
                  rules={[
                    { required: true, message: "Please input row!" },
                    {
                      pattern: /^[A-Z]$/,
                      message:
                        "Row must be a single uppercase letter (e.g., A)",
                    },
                  ]}
                >
                  <Input placeholder="e.g. A" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="numbers"
                  label="N. of Seats"
                  rules={[
                    {
                      required: true,
                      message: "Please input number of seats!",
                    },
                    {
                      pattern: /^[0-9]+$/,
                      message: "Number of seats must be a number",
                    },
                  ]}
                >
                  <Input placeholder="e.g. 10" min={1} defaultValue={1} />
                </Form.Item>
              </Col>
            </Row>
          )}

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
