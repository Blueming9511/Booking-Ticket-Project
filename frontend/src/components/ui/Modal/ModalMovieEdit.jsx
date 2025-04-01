import { Modal, Form } from "antd";
import ModalMovie from "./ModalMovie";

const MovieEditModal = ({ visible, initialValues, onCancel, onSuccess }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    // Xử lý dữ liệu và gọi API
    const [releaseDate, endDate] = values.dateRange || [];
    const movieData = {
      ...values,
      releaseDate: releaseDate?.format("YYYY-MM-DD"),
      endDate: endDate?.format("YYYY-MM-DD"),
      casts: values.cast.split(",").map((s) => s.trim()),
      id: initialValues.id,
      dateRange: undefined,
    };

    updateMovie(movieData).then(onSuccess);
  };


  return (
    <Modal
      title="Edit Movie"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={800}
      style={{ top: 20 }}
    >
      <ModalMovie
        form={form}
        initialValues={initialValues}
        onFinish={handleSubmit}
        isEditing={true}
      />
    </Modal>
  );
};

export default MovieEditModal;
