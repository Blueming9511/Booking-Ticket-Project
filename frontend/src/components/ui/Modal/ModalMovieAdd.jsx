import { Modal, Form } from "antd";
import ModalMovie from "./ModalMovie";
import dayjs from "dayjs";

const MovieAddModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    const [releaseDate, endDate] = values.dateRange || [];
    const movieData = {
      ...values,
      releaseDate: dayjs(releaseDate).format("YYYY-MM-DD"),
      endDate: dayjs(endDate).format("YYYY-MM-DD"),
      casts: values.cast.split(",").map((s) => s.trim()),
      dateRange: undefined,
    };

    createMovie(movieData).then(onSuccess);
  };

  return (
    <Modal
      title="Add New Movie"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={800}
      style={{ top: 20 }}
    >
      <ModalMovie form={form} onFinish={handleSubmit} isEditing={false} />
    </Modal>
  );
};

export default MovieAddModal;
