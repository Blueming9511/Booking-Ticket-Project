import React from "react";
import {
  Form,
  InputNumber,
  Select,
  DatePicker,
  TimePicker,
  Row,
  Col,
} from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const ModalShowTimeForm = ({
  form,
  initialValues,
  onFinish,
  cinemaOptions,
  roomOptions,
  movieOptions,
}) => {
  const statusOptions = ["Active", "Inactive"];

  const handleFinish = (values) => {
    const formattedValues = {
      ...values,
      date: values.date.format("YYYY-MM-DD"),
      startTime: values.timeRange[0].format("HH:mm"),
      endTime: values.timeRange[1].format("HH:mm"),
    };
    onFinish(formattedValues);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        ...initialValues,
        date: initialValues?.date ? dayjs(initialValues.date) : null,
        timeRange:
          initialValues?.startTime && initialValues?.endTime
            ? [
                dayjs(initialValues.startTime, "HH:mm"),
                dayjs(initialValues.endTime, "HH:mm"),
              ]
            : null,
      }}
      onFinish={handleFinish}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="movie"
            label="Movie"
            rules={[{ required: true, message: "Please select a movie!" }]}
          >
            <Select
              placeholder="Select movie"
              showSearch
              optionFilterProp="children"
            >
              {movieOptions?.map((movie) => (
                <Option key={movie.id} value={movie.title}>
                  {movie.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="cinema"
            label="Cinema"
            rules={[{ required: true, message: "Please select a cinema!" }]}
          >
            <Select placeholder="Select cinema">
              {cinemaOptions.map((cinema) => (
                <Option key={cinema.key} value={cinema.label}>
                  {cinema.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="room"
            label="Room"
            rules={[{ required: true, message: "Please select a room!" }]}
          >
            <Select placeholder="Select room">
              {roomOptions.map((room) => (
                <Option key={room.key} value={room.label}>
                  {room.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="price"
            label="Ticket Price (VND)"
            rules={[{ required: true, message: "Please enter ticket price!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={50000}
              step={10000}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="timeRange"
            label="Time Range"
            rules={[{ required: true, message: "Please select time range!" }]}
          >
            <TimePicker.RangePicker
              style={{ width: "100%" }}
              format="HH:mm"
              minuteStep={15}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select a date!" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
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
            <Option key={status} value={status}>
              {status}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default ModalShowTimeForm;
