import { Modal, Form } from "antd";
import ModalScreenForm from "./ModalScreenForm";

const ModalScreenEdit = ({ visible, initialValues, onCancel, onSuccess }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    updateMovie(movieData).then(onSuccess);
  };

  return (
    <Modal
      title="Edit Movie"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={500}
    >
      <ModalScreenForm
        form={form}
        initialValues={initialValues}
        onFinish={handleSubmit}
      />
    </Modal>
  );
};

export default ModalScreenEdit;
