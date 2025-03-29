import React, { useState } from "react";
import { Table, Dropdown, Menu, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import MovieModal from "./MovieModal";

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

  const handleSaveEdit = (updatedData) => {
    setData((prevData) =>
      prevData.map((item) => (item.key === updatedData.key ? updatedData : item))
    );
    setIsModalVisible(false);
    setSelectedMovie(null)
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
          menu={
            <Menu>
              <Menu.Item key="edit" onClick={() => handleRowClick(record)}>
                Edit
              </Menu.Item>
              <Menu.Item key="delete" onClick={() => handleDelete(record.key)}>
                Delete
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button icon={<MoreOutlined />} shape="circle" className="border-none shadow-none" />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Table
        columns={modifiedColumns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        className="rounded-lg shadow-md"
      />
      {selectedMovie && (
        <MovieModal
          visible={isModalVisible}
          movie={selectedMovie}
          onSave={handleSaveEdit}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default DynamicTable;