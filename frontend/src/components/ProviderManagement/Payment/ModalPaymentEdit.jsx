import React, { useEffect } from "react";
import { Modal, Form } from "antd";
import ModalPaymentForm from "./ModalPaymentForm";
import dayjs from "dayjs";

const ModalPaymentEdit = ({ visible, initialValues, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  console.log("initialValues", initialValues);

  const handleSubmit = (values) => {
    const formattedValues = {
      ...values,
      date: dayjs(values.date).toISOString(),
    };
    onSuccess(formattedValues);
  };

  return (
    <Modal
      title="Edit Payment"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={500}
      destroyOnClose
    >
      <ModalPaymentForm
        form={form}
        initialValues={initialValues}
        onFinish={handleSubmit}
      />
    </Modal>
  );
};

export default ModalPaymentEdit;
