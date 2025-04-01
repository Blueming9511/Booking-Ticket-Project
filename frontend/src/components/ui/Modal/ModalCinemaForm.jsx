import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,

  Row,
  Col,
} from "antd";

const { Option } = Select;

const ModalCinemaForm = ({ form, onFinish, initialValues = {}, isEditing }) => {
  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Maintenance", label: "Maintenance" },
    { value: "Closed", label: "Closed" },
  ];

  const handleImageChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
        form.setFieldsValue({ image: e.target.result });
      };
      reader.readAsDataURL(newFileList[0].originFileObj);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
    >
      {console.log("FORMMM: ", initialValues)}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="Cinema Name"
            rules={[
              { required: true, message: "Please input cinema name!" },
              { max: 100, message: "Name cannot exceed 100 characters" },
            ]}
          >
            <Input placeholder="e.g. CGV Vincom Mega Mall" />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            rules={[
              { required: true, message: "Please input location!" },
              { max: 200, message: "Location cannot exceed 200 characters" },
            ]}
          >
            <Input placeholder="e.g. Q. Bình Thạnh, TP.HCM" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="screens"
            label="Number of Screens"
            rules={[
              { required: true, message: "Please input number of screens!" },
              {
                type: "number",
                min: 1,
                max: 50,
                message: "Must be between 1-50",
              },
            ]}
          >
            <InputNumber
              min={1}
              max={50}
              style={{ width: "100%" }}
              placeholder="e.g. 8"
            />
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              {statusOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="description"
        label="Description"
        rules={[
          { max: 1000, message: "Description cannot exceed 1000 characters" },
        ]}
      >
        <Input.TextArea
          rows={4}
          placeholder="Cinema facilities, special features..."
        />
      </Form.Item>
    </Form>
  );
};

export default ModalCinemaForm;
