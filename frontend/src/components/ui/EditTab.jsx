import React from "react";
import { Row, Col, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import FieldInput from "./FieldInput";
import { GENRE_OPTIONS } from "../constants";

const EditTab = ({ data, imageUrl, onEditChange, onImageUrlChange, onSave, onCancel }) => {
  const handleImageUpload = (info) => {
    if (info.file.status === "done") {
      const url = URL.createObjectURL(info.file.originFileObj);
      onEditChange("thumbnail", url);
      onImageUrlChange(url);
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    onImageUrlChange(url);
    onEditChange("thumbnail", url);
  };

  return (
    <div className="max-h-[50vh] overflow-y-auto pr-4">
      <Row gutter={[16, 16]}>
        <FieldInput label="Title" value={data.title} onChange={(val) => onEditChange("title", val)} placeholder="Title" />
        <FieldInput
          label="Genre"
          value={data.genre}
          onChange={(val) => onEditChange("genre", val)}
          type="select"
          options={GENRE_OPTIONS}
        />
        <FieldInput
          label="Release Year"
          value={data.releaseYear}
          onChange={(val) => onEditChange("releaseYear", val)}
          placeholder="Release Year"
        />
        <FieldInput
          label="Director"
          value={data.director}
          onChange={(val) => onEditChange("director", val)}
          placeholder="Director"
        />
        <FieldInput
          label="Rating"
          value={data.rating}
          onChange={(val) => onEditChange("rating", val)}
          placeholder="Rating (0-10)"
          type="number"
          step="0.1"
          min="0"
          max="10"
        />
        <FieldInput
          label="Duration (minutes)"
          value={data.duration}
          onChange={(val) => onEditChange("duration", val)}
          placeholder="Duration"
          type="number"
        />
        <FieldInput
          label="Language"
          value={data.language}
          onChange={(val) => onEditChange("language", val)}
          placeholder="Language"
        />
        <FieldInput
          label="Released By"
          value={data.releasedBy}
          onChange={(val) => onEditChange("releasedBy", val)}
          placeholder="Released By"
        />
        <FieldInput
          label="Budget"
          value={data.budget}
          onChange={(val) => onEditChange("budget", val)}
          placeholder="Budget"
        />
        <FieldInput
          label="Box Office"
          value={data.boxOffice}
          onChange={(val) => onEditChange("boxOffice", val)}
          placeholder="Box Office"
        />
        <FieldInput
          label="Cast"
          value={data.casts?.join(", ")}
          onChange={(val) => onEditChange("casts", val.split(", "))}
          placeholder="Cast (comma-separated)"
          type="textarea"
          span={24}
        />
        <FieldInput
          label="Release Date"
          value={data.releaseDate}
          onChange={(val) => onEditChange("releaseDate", val)}
          type="datepicker"
        />
        <FieldInput
          label="End Date"
          value={data.endDate}
          onChange={(val) => onEditChange("endDate", val)}
          type="datepicker"
        />
        <Col span={12}>
          <label className="block mb-1 font-medium text-gray-700">Upload Image</label>
          <Upload showUploadList={false} beforeUpload={() => false} onChange={handleImageUpload}>
            <Button icon={<UploadOutlined />} className="rounded-md border-gray-300" style={{ padding: "0 4.5rem" }}>
              Upload Image
            </Button>
          </Upload>
        </Col>
        <FieldInput
          label="Image URL"
          value={imageUrl}
          onChange={handleImageUrlChange}
          placeholder="Or enter image URL"
        />
      </Row>
      <div className="mt-6 text-right">
        <Button onClick={onCancel} className="mr-2 rounded-md border-gray-300">
          Cancel
        </Button>
        <Button type="primary" onClick={onSave} className="rounded-md bg-blue-600 text-white">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditTab;