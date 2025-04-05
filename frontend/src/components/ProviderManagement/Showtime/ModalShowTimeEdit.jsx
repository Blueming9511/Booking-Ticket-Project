import React from 'react';
import { Modal, Button, Form } from 'antd';
import ModalShowTimeForm from './ModalShowTimeForm';

const ModalShowTimeEdit = ({ 
  visible, 
  initialValues, 
  onCancel, 
  onSuccess, 
  cinemaOptions, 
  roomOptions,
  movieOptions,
  loading 
}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    onSuccess(values);
  };

  return (
    <Modal
      title="Edit Showtime"
      open={visible}
      onCancel={onCancel}
      confirmLoading={loading}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading}
          onClick={() => form.submit()}
        >
          Update
        </Button>,
      ]}
      width={600}
    >
      <ModalShowTimeForm
        form={form}
        initialValues={initialValues}
        onFinish={handleSubmit}
        cinemaOptions={cinemaOptions}
        roomOptions={roomOptions}
        movieOptions={movieOptions}
      />
    </Modal>
  );
};

export default ModalShowTimeEdit;