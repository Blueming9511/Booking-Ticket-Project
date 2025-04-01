import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Upload,
  Button,
  Image,
  message,
  Divider,
  Row,
  Col,
} from "antd";
import {
  UploadOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  StarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const ModalMovie = ({ form, onFinish, initialValues = {}, isEditing }) => {
  const [imageUrl, setImageUrl] = useState(initialValues?.thumbnail || "");
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);

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

  // Xử lý upload ảnh
  const handleImageChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
        form.setFieldsValue({ image: e.target.result });
      };
      reader.readAsDataURL(newFileList[0].originFileObj);
    }
  };

  // Xử lý khi nhập URL ảnh
  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    form.setFieldsValue({ image: url });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        ...initialValues,
        dateRange: [
          initialValues.releaseDate ? dayjs(initialValues.releaseDate) : null,
          initialValues.endDate ? dayjs(initialValues.endDate) : null,
        ],
      }}
    >
      <Row gutter={24}>
        {/* Left Column */}
        <Col span={12}>
          <Form.Item
            name="title"
            label="Movie Title"
            rules={[{ required: true, message: "Please enter movie title" }]}
          >
            <Input placeholder="Enter movie title" />
          </Form.Item>

          <Form.Item
            name="genre"
            label="Genre"
            rules={[
              { required: true, message: "Please select at least one genre" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select genres"
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
            label="Release Period"
            rules={[
              { required: true, message: "Please select release period" },
            ]}
          >
            <RangePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="duration"
              label="Duration (minutes)"
              rules={[{ required: true, message: "Please enter duration" }]}
            >
              <InputNumber
                min={1}
                max={300}
                style={{ width: "100%" }}
                addonAfter={<ClockCircleOutlined />}
              />
            </Form.Item>

            <Form.Item
              name="rating"
              label="Rating"
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
                style={{ width: "100%" }}
                addonAfter={<StarOutlined />}
              />
            </Form.Item>
          </div>
          <Form.Item
            name="thumbnail"
            label="Movie Poster"
            rules={[{ required: true, message: "Please provide an image" }]}
          >
            <Row gutter={16}>
              <Col span={12} className="space-y-2">
                <Input
                  placeholder="Image URL"
                  value={imageUrl}
                  onChange={handleImageUrlChange}
                />
                <div className="text-sm text-gray-300 mt-3">OR</div>
                <Upload
                  listType="picture"
                  fileList={fileList}
                  onChange={handleImageChange}
                  beforeUpload={() => false}
                  accept="image/*"
                  maxCount={1}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />} style={{ width: "100%" }}>
                    Upload Image
                  </Button>
                </Upload>
              </Col>
              <Col span={12}>
                {imageUrl && (
                  <div>
                    <Image
                      src={imageUrl}
                      alt="Movie poster preview"
                      style={{
                        maxHeight: 100,
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                      preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                      }}
                    />
                  </div>
                )}
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            name="trailer"
            label="Trailer"
            rules={[{ required: true, message: "Please enter trailer URL" }]}
          >
            <Input placeholder="Enter trailer URL" />
          </Form.Item>
        </Col>

        {/* Right Column */}
        <Col span={12}>
          <Form.Item
            name="director"
            label="Director"
            rules={[{ required: true, message: "Please enter director" }]}
          >
            <Input placeholder="Enter director name" />
          </Form.Item>

          <Form.Item
            name="releasedBy"
            label="Distributor"
            rules={[{ required: true, message: "Please enter distributor" }]}
          >
            <Input placeholder="Enter distributor name" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="budget"
                label="Budget"
                rules={[{ required: true, message: "Please enter budget" }]}
              >
                <Input
                  placeholder="Enter budget"
                  addonAfter={<DollarOutlined />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="boxOffice"
                label="Box Office"
                rules={[{ required: true, message: "Please enter box office" }]}
              >
                <Input
                  placeholder="Enter box office"
                  addonAfter={<DollarOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="status"
            label="Status"
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
            label="Casts"
            rules={[{ required: true, message: "Please enter cast members" }]}
          >
            <TextArea
              rows={4}
              placeholder="Enter cast members, separated by commas"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea rows={4} placeholder="Enter movie description" />
          </Form.Item>
        </Col>
      </Row>

      <Divider />
    </Form>
  );
};

export default ModalMovie;
