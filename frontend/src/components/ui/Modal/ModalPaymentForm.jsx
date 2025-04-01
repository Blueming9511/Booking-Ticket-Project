import React from "react";
import { Form, Input, InputNumber, Select, DatePicker, Row, Col } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const ModalPaymentForm = ({ form, onFinish, initialValues }) => {
  const paymentMethods = [
    { value: "Credit Card", label: "Credit Card" },
    { value: "E-Wallet", label: "E-Wallet" },
    { value: "Bank Transfer", label: "Bank Transfer" },
  ];

  const statusOptions = [
    { value: "Completed", label: "Completed" },
    { value: "Pending", label: "Pending" },
    { value: "Failed", label: "Failed" },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        ...initialValues,
        transactionDate: initialValues?.transactionDate
          ? dayjs(initialValues.transactionDate)
          : null,
      }}
    >
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name="id"
            label="Payment ID"
            rules={[{ required: true, message: "Please input payment ID!" }]}
          >
            <Input disabled={!!initialValues?.id} />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount ($)"
            rules={[
              { required: true, message: "Please input amount!" },
              {
                type: "number",
                min: 0.01,
                message: "Amount must be greater than 0",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} min={0.01} step={0.01} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="method"
            label="Payment Method"
            rules={[
              { required: true, message: "Please select payment method!" },
            ]}
          >
            <Select placeholder="Select payment method">
              {paymentMethods.map((method) => (
                <Option key={method.value} value={method.value}>
                  {method.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="transactionDate"
            label="Transaction Date"
            rules={[
              { required: true, message: "Please select transaction date!" },
            ]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              style={{ width: "100%" }}
              disabledDate={(current) =>
                current && current > dayjs().endOf("day")
              }
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: "Please select status!" }]}
      >
        <Select placeholder="Select status">
          {statusOptions.map((status) => (
            <Option key={status.value} value={status.value}>
              {status.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default ModalPaymentForm;
