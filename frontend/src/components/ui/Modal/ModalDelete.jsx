import { Modal } from "antd";
import React from "react";

const ModalDelete = ({ visible, onCancel, onSuccess, loading, extra }) => {
  return (
    <Modal
      title="Delete Movie"
      open={visible}
      onCancel={onCancel}
      onOk={onSuccess}
      okText="Delete"
      okButtonProps={{ danger: true }}
      cancelText="Cancel"
      confirmLoading={loading}
      width={500}
      styles = {{header: {borderBottom: '1px solid gray'}}}
    >
      {extra}
      <p>This action cannot be undone.</p>
    </Modal>
  );
};

export default ModalDelete;
