import { Form, Modal } from "antd";
import ModalCouponForm from "./ModalCouponForm";
import { useEffect } from "react";
import dayjs from "dayjs";

const ModalCouponEdit = ({ visible, initialValues, onCancel, onSuccess }) => {
    const [form] = Form.useForm();

    useEffect(() => {
      if (visible && initialValues) {
          form.resetFields();
          form.setFieldsValue({
              ...initialValues,
              dateRange: [
                  initialValues.start ? dayjs(initialValues.start, "DD/MM/YYYY") : null,
                  initialValues.expiry ? dayjs(initialValues.expiry, "DD/MM/YYYY") : null,
              ],
          });
      }
  }, [visible, initialValues, form]);

    const handleSubmit = (values) => {
        updateCinema(values).then(onSuccess);
    };

    console.log(initialValues);

    return (
        <Modal
            title="Edit Cinema"
            open={visible}
            onCancel={onCancel}
            onOk={() => form.submit()}
            width={700}
        >
            <ModalCouponForm form={form} initialValues={initialValues} onFinish={handleSubmit} />
        </Modal>
    );
}

export default ModalCouponEdit