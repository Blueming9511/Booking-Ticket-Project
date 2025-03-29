import React, { useState } from "react";
import { Table, Dropdown, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import MovieModal from "./ModalMovie"; 
// import CinemaModal from "./CinemaModal";
import CouponModal from "./ModalCoupon";
// import UserModal from "./UserModal";
// import PaymentModal from "./PaymentModal";

const DynamicTable = ({
  columns,              // Cột của bảng
  initData,             // Dữ liệu ban đầu
  modalType = "movie",  // Loại modal: "movie", "cinema", "coupon", "user", "payment", v.v.
  onRowClick,           // Callback khi click vào hàng (tùy chọn)
  onSave,               // Callback khi lưu chỉnh sửa (tùy chọn)
  onDelete,             // Callback khi xóa (tùy chọn)
}) => {
  const [data, setData] = useState(initData);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Xử lý xóa
  const handleDelete = (key) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
    if (onDelete) onDelete(key, newData);
  };

  // Xử lý click vào hàng
  const handleRowClick = (record) => {
    setSelectedItem(record);
    setIsModalVisible(true);
    if (onRowClick) onRowClick(record);
  };

  // Xử lý lưu chỉnh sửa
  const handleSaveEdit = (updatedData) => {
    const newData = data.map((item) =>
      item.key === updatedData.key ? updatedData : item
    );
    setData(newData);
    setIsModalVisible(false);
    setSelectedItem(null);
    if (onSave) onSave(updatedData, newData);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
  };

  const modifiedColumns = [
    ...columns,
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "edit",
                label: "Edit",
                onClick: () => handleRowClick(record),
              },
              {
                key: "delete",
                label: "Delete",
                onClick: () => handleDelete(record.key),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button icon={<MoreOutlined />} shape="circle" className="border-none shadow-none" />
        </Dropdown>
      ),
    },
  ];

  const renderModal = () => {
    if (!selectedItem) return null;

    const modalProps = {
      visible: isModalVisible,
      movie: selectedItem,
      onSave: handleSaveEdit,
      onClose: handleCloseModal,
    };

    switch (modalType) {
      case "movie":
        return <MovieModal {...modalProps} />;
      // case "cinema":
      //   return <CinemaModal {...modalProps} />;
      // case "coupon":
      //   return <CouponModal {...modalProps} />;
      // case "user":
      //   return <UserModal {...modalProps} />;
      // case "payment":
      //   return <PaymentModal {...modalProps} />;
      default:
        return <MovieModal {...modalProps} />;
    }
  };

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
      {renderModal()}
    </div>
  );
};

export default DynamicTable;