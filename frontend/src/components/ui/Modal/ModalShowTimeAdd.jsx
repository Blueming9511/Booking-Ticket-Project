import React from 'react';
import { Modal, Button, Form } from 'antd';
import ModalShowTimeForm from './ModalShowTimeForm';

const ModalShowTimeAdd = ({ visible, onCancel, onSuccess, cinemaOptions, roomOptions, movieOptions }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onSuccess(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Add New Showtime"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Add Showtime
        </Button>,
      ]}
      width={600}
    >
      <ModalShowTimeForm 
        form={form}
        onFinish={handleFinish}
        cinemaOptions={cinemaOptions}
        roomOptions={roomOptions}
        movieOptions={movieOptions}
      />
    </Modal>
  );
};

export default ModalShowTimeAdd;