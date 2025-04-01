import { Form, Modal } from "antd";
import ModalCinemaForm from "./ModalCinemaForm";

const ModalCinemaAdd = ({ visible, onSuccess, onCancel }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    createCinema(values).then(onSuccess);
  };

  return (
    <Modal
      title="Add New Cinema"
      open={visible}
      onCancel={onCancel}
      onOk={onSuccess}
      width={800}
    >
      <ModalCinemaForm form={form} onFinish={handleSubmit} isEditing={false} />
    </Modal>
  );
};

export default ModalCinemaAdd;
