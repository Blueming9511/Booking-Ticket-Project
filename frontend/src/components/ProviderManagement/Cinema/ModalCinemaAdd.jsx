import { Form, Modal } from "antd";
import ModalCinemaForm from "./ModalCinemaForm";

const ModalCinemaAdd = ({ visible, onSuccess, onCancel, loading, role="Admin" }) => {
  const [form] = Form.useForm();
  const handleOk = async() => {
    onSuccess(form.validateFields())
  }
  return (
    <Modal
      title="Add New Cinema"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      width={600}
      confirmLoading={loading}
    >
      <ModalCinemaForm form={form} onFinish={onSuccess} role={role} />
    </Modal>
  );
};

export default ModalCinemaAdd;
