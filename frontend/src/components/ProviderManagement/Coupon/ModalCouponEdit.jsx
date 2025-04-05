import { Form, Modal } from "antd";
import ModalCouponForm from "./ModalCouponForm";
import { useEffect } from "react";
import dayjs from "dayjs";

const ModalCouponEdit = ({ visible, initialValues, onCancel, onSuccess }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    onSuccess(values);
  };

  console.log(initialValues);

  return (
    <Modal
      title="Edit Cinema"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={800}
    >
      <ModalCouponForm
        form={form}
        initialValues={initialValues}
        onFinish={handleSubmit}
      />
    </Modal>
  );
};

export default ModalCouponEdit;
