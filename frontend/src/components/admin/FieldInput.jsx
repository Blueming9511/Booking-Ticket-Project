import React from "react";
import { Col, Input, Select, DatePicker, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import TextArea from "antd/es/input/TextArea";
import PropTypes from "prop-types";

const FieldInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  options = [],
  step,
  min,
  max,
  span = 12,
  uploadProps = {},
}) => {
  const inputClass = "rounded-md border-gray-300 focus:ring focus:ring-blue-200 w-full";

  const renderInput = () => {
    switch (type) {
      case "select":
        return (
          <Select value={value} onChange={onChange} className={inputClass}>
            {options.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        );
      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            step={step}
            min={min}
            max={max}
            className={inputClass}
          />
        );
      case "textarea":
        return (
          <TextArea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className={inputClass}
          />
        );
      case "datepicker":
        return (
          <DatePicker
            value={value ? moment(value) : null}
            onChange={(date, dateString) => onChange(dateString)}
            placeholder={placeholder}
            className={inputClass}
          />
        );
      case "upload":
        return (
          <Upload
            showUploadList={false}
            beforeUpload={() => false}
            onChange={(info) => {
              if (info.file.status === "done") {
                const url = URL.createObjectURL(info.file.originFileObj);
                onChange(url);
              }
            }}
            {...uploadProps}
          >
            <Button icon={<UploadOutlined />} className="rounded-md border-gray-300 w-62">
              {placeholder || "Upload"}
            </Button>
          </Upload>
        );
      default:
        return (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={inputClass}
          />
        );
    }
  };

  return (
    <Col span={span}>
      <label className="block mb-1 font-medium text-gray-700">{label}</label>
      {renderInput()}
    </Col>
  );
};

FieldInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.oneOf(["text", "select", "number", "textarea", "datepicker", "upload"]),
  options: PropTypes.array,
  step: PropTypes.string,
  min: PropTypes.string,
  max: PropTypes.string,
  span: PropTypes.number,
  uploadProps: PropTypes.object,
};

export default FieldInput;