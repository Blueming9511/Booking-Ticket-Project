import React, { useState } from "react";
import { Modal, Tabs } from "antd";
import DetailsTab from "./DetailsTab";
import EditTab from "./EditTab";

const { TabPane } = Tabs;
// Hii
const MovieModal = ({ visible, movie, onSave, onClose }) => {
  const [editData, setEditData] = useState(movie);
  const [imageUrl, setImageUrl] = useState(movie.thumbnail || "");

  const handleEditChange = (key, value) => {
    setEditData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(editData);
  };

  return (
    <Modal
      title={null}
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      bodyStyle={{ padding: 0 }}
      className="top-5 max-h-[85vh] rounded-lg overflow-hidden"
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-semibold m-0">
            {editData.title || "Movie Details"}
          </h2>
        </div>
        <div className="flex flex-1 gap-5 min-h-0">
          <div className="w-[250px] p-6 bg-gray-50 flex items-center justify-center">
            <img
              src={editData.thumbnail || "https://via.placeholder.com/250"}
              alt="thumbnail"
              className="w-full rounded-lg object-cover"
            />
          </div>
          <Tabs
            defaultActiveKey="1"
            className="flex-1 p-6 bg-white"
            tabBarStyle={{ marginBottom: "24px" }}
          >
            <TabPane tab={<span className="font-medium">Details</span>} key="1">
              <DetailsTab data={editData} />
            </TabPane>
            <TabPane tab={<span className="font-medium">Edit</span>} key="2">
              <EditTab
                data={editData}
                imageUrl={imageUrl}
                onEditChange={handleEditChange}
                onImageUrlChange={setImageUrl}
                onSave={handleSave}
                onCancel={onClose}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Modal>
  );
};

export default MovieModal;