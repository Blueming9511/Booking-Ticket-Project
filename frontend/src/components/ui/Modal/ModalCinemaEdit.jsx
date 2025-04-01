import { Form, Modal } from "antd";
import ModalCinemaForm from "./ModalCinemaForm";

const ModalCinemaEdit = ({ visible, initialValues, onCancel, onSuccess }) => {
    const [form] = Form.useForm();

    const handleSubmit = (values) => {
        updateCinema(values).then(onSuccess);
    };

    return (
        <Modal
            title="Edit Cinema"
            open={visible}
            onCancel={onCancel}
            onOk={() => form.submit()}
            width={800}
        >
            <ModalCinemaForm form={form} initialValues={initialValues} onFinish={handleSubmit} isEditing={true} />
        </Modal>
    );
}

export default ModalCinemaEdit