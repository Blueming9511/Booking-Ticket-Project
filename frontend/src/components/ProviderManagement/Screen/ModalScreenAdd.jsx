import { Modal, Form } from "antd";
import ModalScreenForm from "./ModalScreenForm";

const ModalScreenAdd = ({ visible, initialValues, onCancel, onSuccess, loading, cinemas }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Edit Movie"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      width={500}
    >
      <ModalScreenForm
        form={form}
        initialValues={initialValues}
        onFinish={onSuccess}
        cinemas={cinemas}
      />
    </Modal>
  );
};

export default ModalScreenAdd;
