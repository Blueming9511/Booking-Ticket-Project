import { Modal, Form, message } from "antd";
import ModalMovie from "./ModalMovie";
import { isString } from "antd/es/button";

const MovieEditModal = ({ visible, initialValues, onCancel, onSuccess, loading }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    const { dateRange, ...valuesWithOutDateRange } = values;
    const [releaseDate, endDate] = dateRange|| [];
    const movieData = {
      ...valuesWithOutDateRange,
      releaseDate: releaseDate?.format("YYYY-MM-DD"),
      endDate: endDate?.format("YYYY-MM-DD"),
      casts: isString(values.casts) ? values.casts.split(",").map((s) => s.trim()) : values.casts,
    };
    onSuccess(movieData);
  };


  return (
    <Modal
      title="Edit Movie"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={800}
      style={{ top: 20 }}
      confirmLoading={loading}
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
