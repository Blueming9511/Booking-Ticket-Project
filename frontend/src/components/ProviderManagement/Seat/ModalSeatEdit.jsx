import React from "react";
import { Modal, Button, Form } from "antd";
import ModalSeatForm from "./ModalSeatForm";

const ModalSeatEdit = ({
  visible,
  initialValues,
  onCancel,
  onSuccess,
  cinemas = [],
  rooms = [],
}) => {
  const [form] = Form.useForm();

  console.log(initialValues);

  const handleFinish = (values) => {
    console.log("Updated seat values:", values);
    onSuccess({ ...initialValues, ...values }); // Gửi dữ liệu đã chỉnh sửa về component cha
  };

  return (
    <Modal
      title="Edit Seat"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Save Changes
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

export default ModalSeatEdit;
