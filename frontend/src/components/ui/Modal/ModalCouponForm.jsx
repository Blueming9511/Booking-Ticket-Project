import React from "react";
import { Form, Input, InputNumber, Select, Row, Col, DatePicker } from "antd";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const ModalCouponForm = ({ form, onFinish, initialValues }) => {
  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Expired", label: "Expired" },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        ...initialValues,
        dateRange: [
          initialValues.start ? dayjs(initialValues.start, "DD/MM/YYYY") : null,
          initialValues.expiry
            ? dayjs(initialValues.expiry, "DD/MM/YYYY")
            : null,
        ],
        status: initialValues.status || "Active",
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="code"
            label="Coupon Code"
            rules={[
              { required: true, message: "Please input coupon code!" },
              { max: 20, message: "Code cannot exceed 20 characters" },
              {
                pattern: /^[A-Z0-9]+$/,
                message: "Code must be uppercase letters and numbers only",
              },
            ]}
          >
            <Input placeholder="e.g. DISCOUNT10" disabled={initialValues.code} />
          </Form.Item>

          <Form.Item
            name="discount"
            label="Discount"
            rules={[
              { required: true, message: "Please input discount value!" },
              { max: 50, message: "Discount cannot exceed 50 characters" },
            ]}
          >
            <Input placeholder="e.g. 10% or Free Ticket" />
          </Form.Item>

          <Form.Item
            name="usageLimit"
            label="Usage Limit"
            rules={[
              {
                type: "number",
                min: 1,
                message:
                  "Limit must be at least 1 (or leave empty for unlimited)",
              },
            ]}
          >
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              placeholder="e.g. 1000 (optional)"
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="dateRange"
            label="Release Period"
            rules={[
              { required: true, message: "Please select release period" },
            ]}
          >
            <RangePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
          </Form.Item>

          <Form.Item
            name="minOrderValue"
            label="Minimum Order Value ($)"
            rules={[
              { required: true, message: "Please input minimum order value!" },
              { type: "number", min: 0, message: "Value must be non-negative" },
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="e.g. 50"
            />
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

      <Form.Item
        name="description"
        label="Description"
        rules={[
          { max: 200, message: "Description cannot exceed 200 characters" },
        ]}
      >
        <TextArea rows={3} placeholder="e.g. 10% off on orders above $50" />
      </Form.Item>
    </Form>
  );
};

export default ModalCouponForm;
