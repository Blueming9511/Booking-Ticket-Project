import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Image,
  DatePicker,
  Upload,
} from "antd";
import {
  DollarOutlined,
  ClockCircleOutlined,
  StarOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";

const { Option } = Select;

const ModalMovie = ({
  visible,
  onCancel,
  onOk,
  form,
  initialValues,
  title = "Movie Details",
  loading = false,
}) => {
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState("");
  const [fileList, setFileList] = React.useState([]);

  const genres = [
    "Action",
    "Comedy",
    "Drama",
    "Romance",
    "Thriller",
    "Sci-Fi",
    "Horror",
    "Fantasy",
  ];
  const statuses = ["Now Showing", "Coming Soon", "Ended", "Postponed"];

  // Khởi tạo giá trị form khi initialValues thay đổi
  useEffect(() => {
    if (initialValues) {
      const formattedValues = {
        ...initialValues,
        releaseDate: initialValues.releaseDate
          ? dayjs(initialValues.releaseDate, "YYYY-MM-DD")
          : null,
        endDate: initialValues.endDate
          ? dayjs(initialValues.endDate, "YYYY-MM-DD")
          : null,
        cast: initialValues.casts || initialValues.cast || "",
        dateRange: initialValues.releaseDate && initialValues.endDate
          ? [
              dayjs(initialValues.releaseDate, "YYYY-MM-DD"),
              dayjs(initialValues.endDate, "YYYY-MM-DD")
            ]
          : null
      };

      form.setFieldsValue(formattedValues);
      setImageUrl(initialValues.thumbnail || "");
      console.log("Form", form.getFieldsValue());
    } else {
      form.resetFields();
      setImageUrl("");
      setFileList([]);
    }
  }, [initialValues, form]);


  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    form.setFieldsValue({ image: url });
  };

  const handleImageUpload = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const file = newFileList[0].originFileObj;
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target.result;
        setImageUrl(url);
        form.setFieldsValue({ image: url });
      };
      reader.readAsDataURL(file);
    } else if (newFileList.length === 0) {
      setImageUrl("");
      form.setFieldsValue({ image: "" });
    }
  };

  return (
    <Modal
      title={<span className="text-xl font-semibold">{title}</span>}
      open={visible}
      onCancel={onCancel}
      width={700}
      centered
      footer={[
        <Button key="cancel" onClick={onCancel} className="min-w-[100px]">
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={onOk}
          className="min-w-[100px]"
          loading={loading}
        >
          Save Changes
        </Button>,
      ]}
      bodyStyle={{ padding: "24px 24px 0" }}
    >
      <Form form={form} layout="vertical" className="movie-form">
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <Form.Item
              name="title"
              label={<span className="font-medium">Movie Title</span>}
              rules={[{ required: true, message: "Please enter movie title" }]}
            >
              <Input placeholder="Avengers: Endgame" />
            </Form.Item>

            <Form.Item
              name="genre"
              label={<span className="font-medium">Genre</span>}
              rules={[{ required: true, message: "Please select genre" }]}
            >
              <Select
                placeholder="Select genre"
                mode="multiple"
                optionFilterProp="children"
                showSearch
              >
                {genres.map((genre) => (
                  <Option key={genre} value={genre}>
                    {genre}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="dateRange"
              label={<span className="font-medium">Release Period</span>}
              rules={[
                { required: true, message: "Please select release period" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || value.length !== 2) {
                      return Promise.reject(
                        "Please select both start and end dates"
                      );
                    }
                    const [start, end] = value;
                    if (start.isAfter(end)) {
                      return Promise.reject(
                        "End date must be after start date"
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <DatePicker.RangePicker
                className="w-full"
                placeholder={["Start date", "End date"]}
                format="YYYY-MM-DD"
                disabledDate={(current) =>
                  current && current > dayjs().endOf("day")
                }
              />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
           
            <Form.Item
              name="duration"
              label={<span className="font-medium">Duration (min)</span>}
              rules={[{ required: true, message: "Please enter duration" }]}
              >
              <InputNumber
                min={1}
                max={300}
                className="w-full"
                placeholder="120"
                addonAfter={<ClockCircleOutlined className="text-gray-400" />}
                />
            </Form.Item>

            <Form.Item
              name="rating"
              label={<span className="font-medium">Rating</span>}
              rules={[
                { required: true, message: "Please enter rating" },
                {
                  type: "number",
                  min: 0,
                  max: 10,
                  message: "Rating must be between 0-10",
                },
              ]}
              >
              <InputNumber
                min={0}
                max={10}
                step={0.1}
                className="w-full"
                placeholder="8.5"
                addonAfter={<StarOutlined className="text-yellow-400" />}
                />
            </Form.Item>
                </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Form.Item
                  name="thumbnail"
                  label={<span className="font-medium">Movie Poster</span>}
                  rules={[
                    { required: true, message: "Please provide an image" },
                  ]}
                >
                  <div className="space-y-2">
                    <Input
                      placeholder="https://example.com/image.jpg"
                      onChange={handleImageUrlChange}
                      value={imageUrl}
                    />
                    <div className="text-center text-gray-500">OR</div>
                    <Upload
                      name="poster"
                      listType="picture"
                      fileList={fileList}
                      onChange={handleImageUpload}
                      beforeUpload={() => false}
                      accept="image/*"
                      maxCount={1}
                      showUploadList={false}
                    >
                      <Button icon={<UploadOutlined />}>Upload Image</Button>
                    </Upload>
                  </div>
                </Form.Item>
              </div>
              <div>
                {imageUrl && (
                  <>
                    <div className="font-medium mb-2">Preview:</div>
                    <Image
                      src={imageUrl}
                      alt="Movie poster preview"
                      className="rounded border border-gray-200"
                      style={{
                        maxHeight: "100px",
                        objectFit: "contain",
                        display: "block",
                      }}
                      preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) =>
                          !visible && setPreviewOpen(false),
                      }}
                      onClick={() => setPreviewOpen(true)}
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <Form.Item
              name="director"
              label={<span className="font-medium">Director</span>}
              rules={[{ required: true, message: "Please enter director" }]}
            >
              <Input placeholder="Christopher Nolan" />
            </Form.Item>

            <Form.Item
              name="releasedBy"
              label={<span className="font-medium">Distributor</span>}
              rules={[{ required: true, message: "Please enter distributor" }]}
            >
              <Input placeholder="Warner Bros. Pictures" />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="budget"
                label={<span className="font-medium">Budget</span>}
                rules={[{ required: true, message: "Please enter budget" }]}
              >
                <Input
                  placeholder="$250,000,000"
                  addonAfter={<DollarOutlined className="text-gray-400" />}
                />
              </Form.Item>

              <Form.Item
                name="boxOffice"
                label={<span className="font-medium">Box Office</span>}
                rules={[{ required: true, message: "Please enter box office" }]}
              >
                <Input
                  placeholder="$2,320,000,000"
                  addonAfter={<DollarOutlined className="text-gray-400" />}
                />
              </Form.Item>
            </div>

            <Form.Item
              name="status"
              label={<span className="font-medium">Status</span>}
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select placeholder="Select status">
                {statuses.map((status) => (
                  <Option key={status} value={status}>
                    {status}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="casts"
              label={<span className="font-medium">Cast</span>}
              rules={[{ required: true, message: "Please enter cast" }]}
            >
              <TextArea
                placeholder="Tom Hanks, Margot Robbie"
                cols={4}
                rows={4}
              />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalMovie;