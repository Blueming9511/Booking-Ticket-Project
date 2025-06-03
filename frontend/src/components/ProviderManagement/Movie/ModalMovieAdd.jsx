import { Modal, Form } from "antd";
import dayjs from "dayjs";
import { isString } from "antd/es/button";
import ModalMovie from "./ModalMovie";

const MovieAddModal = ({ visible, onCancel, onSuccess, loading }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    const [releaseDate, endDate] = values.dateRange || [];
    const movieData = {
      ...values,
      releaseDate: dayjs(releaseDate).format("YYYY-MM-DD"),
      endDate: dayjs(endDate).format("YYYY-MM-DD"),
      casts: isString(values.cast) ? values.cast.split(",").map((s) => s.trim()) : values.cast,
      dateRange: undefined,
    };
    onSuccess(movieData);
  };

  return (
    <Modal
      title="Add New Movie"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={800}
      style={{ top: 20 }}
      confirmLoading={loading}
    >
      <ModalMovie form={form} onFinish={handleSubmit} isEditing={false} />
    </Modal>
  );
};

export default MovieAddModal;
