import React from 'react';
import { Modal, Form } from 'antd';
import ModalPaymentForm from './ModalPaymentForm';

const ModalPaymentAdd = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    // Format transactionDate to ISO string
    const formattedValues = {
      ...values,
      transactionDate: values.transactionDate.toISOString(),
    };
    onSuccess(formattedValues);
  };

  return (
    <Modal
      title="Add New Payment"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={500}
      destroyOnClose
    >
      <ModalPaymentForm form={form} onFinish={handleSubmit} />
    </Modal>
  );
};

export default ModalPaymentAdd;