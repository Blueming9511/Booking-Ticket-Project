import React from "react";
import { Modal, Button, Form } from "antd";
import dayjs from "dayjs";
import ModalCouponForm from "./ModalCouponForm";

const ModalCouponAdd = ({
  visible,
  initialValues = {},
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    const updatedValues = {
      ...values,
      startDate: dayjs(values.dateRange?.[0]).format("YYYY-MM-DD"),
      expiryDate: dayjs(values.dateRange?.[1]).format("YYYY-MM-DD"),
    };
    delete updatedValues.dateRange;
    onSuccess(updatedValues);
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
      width={800}
    >
      <ModalCouponForm
        form={form}
        onFinish={handleFinish}
        initialValues={initialValues}
      />
    </Modal>
  );
};

export default ModalCouponAdd;
