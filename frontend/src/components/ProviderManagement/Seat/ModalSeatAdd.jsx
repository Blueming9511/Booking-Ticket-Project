import React from 'react';
import { Modal, Button, Form } from 'antd';
import ModalSeatForm from './ModalSeatForm';

const ModalSeatAdd = ({ visible, initialValues = {}, onCancel, onSuccess, cinemas=[], rooms=[] }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    console.log('New seat values:', values);
    onSuccess(values); // Trả dữ liệu về component cha để xử lý
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
      <ModalSeatForm form={form} onFinish={handleFinish} initialValues={initialValues} cinemas={cinemas} rooms={rooms} />
    </Modal>
  );
};

export default ModalSeatAdd;