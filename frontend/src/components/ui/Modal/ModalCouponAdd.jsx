import React from 'react';
import { Modal, Button, Form } from 'antd';
import ModalCouponForm from './ModalCouponForm';

const ModalCouponAdd = ({ visible, initialValues = {}, onCancel, onSuccess }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    const formattedValues = {
      ...values,
      start: values.start.format('DD/MM/YYYY'),
      expiry: values.expiry.format('DD/MM/YYYY'),
    };
    console.log('New coupon values:', formattedValues);
    onSuccess(formattedValues); // Trả dữ liệu về component cha
    form.resetFields();
  };

  return (
    <Modal
      title="Add New Coupon"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Add Coupon
        </Button>,
      ]}
    >
      <ModalCouponForm form={form} onFinish={handleFinish} initialValues={initialValues} />
    </Modal>
  );
};

export default ModalCouponAdd;