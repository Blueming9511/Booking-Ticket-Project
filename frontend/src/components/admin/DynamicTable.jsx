import React, { useState } from "react";
import { Table, Dropdown, Menu, Button, Modal, Descriptions, Image } from "antd";
import { MoreOutlined } from "@ant-design/icons";

const DynamicTable = ({ columns, initData }) => {
  const [data, setData] = useState(initData);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDelete = (key) => {
    setData(data.filter((item) => item.key !== key));
  };

  const handleRowClick = (record) => {
    setSelectedMovie(record);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedMovie(null);
  };

  const modifiedColumns = [
    ...columns,
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="edit">Edit</Menu.Item>
              <Menu.Item key="delete" onClick={() => handleDelete(record.key)}>
                Delete
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={modifiedColumns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />

      {/* Movie Details Modal */}
      <Modal
        title={selectedMovie?.title}
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        {selectedMovie && (
          <Descriptions bordered column={1}>
            {Object.entries(selectedMovie).map(([key, value]) => {
              if (key === "key") return null; // Skip displaying key field
              if (key === "thumbnail") {
                return (
                  <Descriptions.Item key={key} label="Thumbnail">
                    <Image width={100} src={value} />
                  </Descriptions.Item>
                );
              }
              return (
                <Descriptions.Item key={key} label={key.replace(/([A-Z])/g, " $1").trim()}>
                  {Array.isArray(value) ? value.join(", ") : value}
                </Descriptions.Item>
              );
            })}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default DynamicTable;
