import React, { use, useEffect, useState } from "react";
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
import axios from "axios";

const { Option } = Select;

const ModalShowTimeForm = ({
  form,
  initialValues,
  onFinish,
  cinemaOptions,
  roomOptions,
  movieOptions,
}) => {

  console.log("ROom opTioNs", roomOptions)

  const [durationMovie, setDurationMove] = useState(0);
  const [filteredRoom, setFilteredRoom] = useState([]);
  const [dateSt, setDateSt] = useState(null);
  useEffect(() => {
    const startTime = form.getFieldValue('startTime');
    console.log(23)
    if (startTime && durationMovie) {
      const endTime = startTime.add(durationMovie, 'minute');
      form.setFieldsValue({ endTime });
    }
  }, [form.getFieldValue('startTime'), durationMovie]);

  const getDuration = async (code) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/movies/duration/${code}`)
      setDurationMove(res.data);
    } catch (err) {
      console.error(err)
    }
  }

  const handleFinish = async (values) => {
    const startTime = (values.date)
      ? dayjs(`${values.date.format("YYYY-MM-DD")} ${values.startTime.format("HH:mm")}`).toISOString()
      : null;

    const endTime = (values.date)
      ? dayjs(`${values.date.format("YYYY-MM-DD")} ${values.endTime.format("HH:mm")}`).toISOString()
      : null;

    const formattedValues = {
      ...values,
      startTime,
      endTime
    };
    delete formattedValues.timeRange;
    delete formattedValues.date
    console.log("add error:", JSON.stringify(formattedValues)); 
    await onFinish(formattedValues);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        ...initialValues,
        date: initialValues?.startTime
          ? dayjs.utc(initialValues.startTime).tz("Asia/Ho_Chi_Minh").startOf("day")
          : null,
        timeRange:
          initialValues?.startTime && initialValues?.endTime
            ? [
              dayjs.utc(initialValues.startTime).tz("Asia/Ho_Chi_Minh"),
              dayjs.utc(initialValues.endTime).tz("Asia/Ho_Chi_Minh"),
            ]
            : null,
        price: 50000
      }}
      onFinish={handleFinish}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="movieCode"
            label="Movie"
            rules={[{ required: true, message: "Please select a movie!" }]}
          >
            <Select
              placeholder="Select movie"
              showSearch
              optionFilterProp="children"
              onChange={(e) => getDuration(e)}
            >
              {movieOptions?.map((movie) => (
                <Option key={movie.value} value={movie.value}>
                  {movie.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="cinemaCode"
            label="Cinema"
            rules={[{ required: true, message: "Please select a cinema!" }]}
          >
            <Select placeholder="Select cinema"
              onChange={(value) => {
                form.setFieldsValue({ screenCode: null });
                setFilteredRoom(roomOptions.find((room) => (room.value === value)).label)
              }}
            >
              {cinemaOptions.map((cinema) => (
                <Option key={cinema.value} value={cinema.value}>
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
            name="screenCode"
            label="Screen"
            rules={[{ required: true, message: "Please select a room!" }]}
          >
            <Select placeholder="Select room">
              {(filteredRoom || []).map((room) => (
                <Option key={room} value={room}>
                  {room}
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
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select a date!" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              onChange={(e) => setDateSt(e)}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="startTime"
            label="Start"
            rules={[{ required: true, message: "Please select time range!" }]}
          >
            <TimePicker
              onChange={(times) => {
                const startTime = times;
                const endTime = startTime.add(durationMovie + 20, 'minute');
                form.setFieldsValue({
                  endTime
                });
              }}
              format="HH:mm"
              minuteStep={15}
              disabledTime={() => {
                const now = dayjs();
                if (!dateSt || dayjs(dateSt).isAfter(now, 'day')) {
                  return {};
                }

                const currentHour = now.hour();
                const currentMinute = now.minute();
                return {
                  disabledHours: () => Array.from({ length: currentHour }, (_, i) => i),
                  disabledMinutes: (selectedHour) => {
                    if (selectedHour === currentHour) {
                      return Array.from({ length: currentMinute }, (_, i) => i);
                    }
                    return [];
                  },
                };
              }}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="endTime"
            label="End"
            rules={[{ required: true, message: "Please select time range!" }]}
          >
            <TimePicker
              format="HH:mm"
              minuteStep={15}
              disabledTime={
                () => {
                  const startTime = form.getFieldValue("startTime");
                  if (!startTime) return {};

                  const startHour = startTime.hour();
                  const startMinute = startTime.minute();

                  return {
                    disabledHours: () =>
                      Array.from({ length: 24 }, (_, i) => i).filter((h) => h < startHour),
                    disabledMinutes: (selectedHour) => {
                      if (selectedHour === startHour) {
                        return Array.from({ length: 60 }, (_, i) => i).filter(
                          (m) => m < startMinute
                        );
                      }
                      return [];
                    },
                  };
                }}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default ModalShowTimeForm;
