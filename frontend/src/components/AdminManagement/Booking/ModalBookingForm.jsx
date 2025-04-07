import React, { useState } from "react";
import { Form, Input, Select, InputNumber, Row, Col } from "antd";

const { Option } = Select;

const ModalBookingForm = ({
  form,
  onFinish,
  initialValues = {},
  seats,
  showtimes,
  users,
}) => {
  const statusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "COMPLETED", label: "Completed" },
  ];

  const [selectedShowTime, setShowTime] = useState(null);

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
            name="userCode"
            label="User Code"
            rules={[{ required: true, message: "Please input user code!" }]}
          >
            <Select
              showSearch
              placeholder="Select user code"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {users.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.username}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="showTimeCode"
            label="Showtime Code"
            rules={[{ required: true, message: "Please input showtime code!" }]}
          >
            <Select
              showSearch
              placeholder="Select showtime code"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              onChange={(value) =>
              {
                setShowTime(
                  showtimes.find((showtime) => showtime.showTimeCode === value)
                )
                form.setFieldValue("seatCode", []);
              }}
            >
              {showtimes.map((showtime) => (
                <Option key={showtime.id} value={showtime.showTimeCode}>
                  {showtime.showTimeCode}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="seatCode"
            label="Seat Codes"
            rules={[{ required: true, message: "Please input seat codes!" }]}
          >
            <Select
              mode="tags"
              placeholder="e.g. A1, A2, B3"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {console.log(selectedShowTime)}
              {selectedShowTime &&
                seats
                  .filter(
                    (seat) =>
                      seat.screenCode === selectedShowTime.screenCode &&
                      seat.cinemaCode === selectedShowTime.cinemaCode
                  )
                  .map((seat) => (
                    <Option key={seat.id} value={seat.seatCode}>
                      {seat.seatCode}
                    </Option>
                  ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="subTotal"
            label="Sub Total"
            rules={[{ required: true, message: "Please input sub total!" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item
            name="discountAmount"
            label="Discount Amount"
            rules={[
              { required: true, message: "Please input discount amount!" },
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item
            name="taxAmount"
            label="Tax Amount"
            rules={[{ required: true, message: "Please input tax amount!" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item
            name="totalAmount"
            label="Total Amount"
            rules={[{ required: true, message: "Please input total amount!" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status!" }]}
          >
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
    </Form>
  );
};

export default ModalBookingForm;
