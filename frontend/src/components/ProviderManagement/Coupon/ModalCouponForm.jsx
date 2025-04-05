import React, { useEffect } from "react";
import { Form, Input, InputNumber, Select, Row, Col, DatePicker } from "antd";
import dayjs from "dayjs";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const ModalCouponForm = ({ form, onFinish, initialValues }) => {
  useEffect(() => {
    form.setFieldsValue({
      dateRange: [
        initialValues.startDate ? dayjs(initialValues.startDate, "YYYY-MM-DD") : null,
        initialValues.expiryDate ? dayjs(initialValues.expiryDate, "YYYY-MM-DD") : null,
      ],
    });
  }, [initialValues]);;
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
            name="couponCode"
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
            <Input
              placeholder="e.g. DISCOUNT10"
              disabled={initialValues.code}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="discountValue"
                label="Discount (%)"
                rules={[
                  { required: true, message: "Please input discount value!" },
                  { max: 50, message: "Discount cannot exceed 50 characters" },
                ]}
              >
                <Input placeholder="e.g. 10% or Free Ticket" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="minOrderValue"
                label="Minimum Value ($)"
                rules={[
                  {
                    required: true,
                    message: "Please input minimum order value!",
                  },
                  {
                    type: "number",
                    min: 0,
                    message: "Value must be non-negative",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  placeholder="e.g. 50"
                />
              </Form.Item>
            </Col>
          </Row>

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
            {console.log(form.getFieldValue())}
            <RangePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { max: 200, message: "Description cannot exceed 200 characters" },
            ]}
          >
            <TextArea rows={5} placeholder="e.g. 10% off on orders above $50" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default ModalCouponForm;
