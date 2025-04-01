import React, { useEffect } from 'react';
import { Modal, Form } from 'antd';
import ModalPaymentForm from './ModalPaymentForm';

const ModalPaymentEdit = ({ visible, initialValues, onCancel, onSuccess }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues) {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

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