import React from "react";
import { Modal, Button, Form } from "antd";
import ModalSeatForm from "./ModalSeatForm";

const ModalSeatAdd = ({
  visible,
  initialValues = {},
  onCancel,
  onSuccess,
  cinemas = [],
  rooms = [],
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    const { numbers, type, row, screenCode, cinemaCode, status } = values;
    let datas = [];
    for (let i = 0; i < numbers; i++) {
      datas.push({
        type,
        row,
        screenCode,
        cinemaCode,
        status,
        multiplier:
          values.type === "VIP" ? 1.5 : values.type === "COUPLE" ? 2.2 : 1,
      });
    }
    onSuccess(datas);
    form.resetFields();
  };

  return (
    <Modal
      title="Add New Seat"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Add Seat
        </Button>,
      ]}
    >
      <ModalSeatForm
        form={form}
        onFinish={handleFinish}
        initialValues={initialValues}
        cinemas={cinemas}
        rooms={rooms}
      />
    </Modal>
  );
};

export default ModalSeatAdd;
