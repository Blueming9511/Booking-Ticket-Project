import React, { useState, useEffect, useCallback } from "react";
import { Card, Space, Button, Input, message, Modal, Table, Form } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import UserStatistics from "../../components/AdminManagement/User/UserStatistics";
import ModalUserForm from "../../components/AdminManagement/User/ModalUserForm";
import { columns } from "../../components/AdminManagement/User/ColumnsConfig";
import axios from "axios";
import ModalDelete from "../../components/ui/Modal/ModalDelete";

const { Search } = Input;

const Users = () => {
  const [state, setState] = useState({
    users: [],
    loading: false,
    selectedUser: null,
    modalVisible: false,
    modalAction: "add",
    searchQuery: "",
  });
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchData = useCallback(
    async (showSuccess = true) => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        showSuccess && messageApi.loading("Fetching users...");

        const response = await axios.get("http://localhost:8080/api/users", {
          withCredentials: true,
        });

        setState((prev) => ({
          ...prev,
          users: response.data,
        }));

        showSuccess && messageApi.destroy();
        showSuccess && messageApi.success("Users fetched successfully", 2);
      } catch (error) {
        showSuccess && messageApi.error("Failed to fetch users", 2);
        console.error("Fetch error:", error);
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [messageApi]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleModal = (action, visible) => {
    setState((prev) => ({
      ...prev,
      modalVisible: visible,
      modalAction: action,
      selectedUser: action === "edit" && visible ? prev.selectedUser : null,
    }));
    if (!visible) form.resetFields();
  };

  const handleUserAction = async (action, values) => {
    const config = {
      add: {
        method: "post",
        url: "http://localhost:8080/api/users",
        data: values,
      },
      edit: {
        method: "put",
        url: `http://localhost:8080/api/users/${state.selectedUser?.id}`,
        data: values,
      },
      delete: {
        method: "delete",
        url: `http://localhost:8080/api/users/${state.selectedUser?.id}`,
      },
    };

    try {
      setState((prev) => ({ ...prev, loading: true }));
      await axios({ ...config[action], withCredentials: true });
      messageApi.success(`User ${action}ed successfully`, 2);
      await fetchData(false);
      toggleModal(action, false);
    } catch (error) {
      messageApi.error(`Failed to ${action} user`, 2);
      console.error(`${action} error:`, error);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleEdit = (record) => {
    setState((prev) => ({ ...prev, selectedUser: record }));
    form.setFieldsValue(record);
    toggleModal("edit", true);
  };

  const handleDelete = (id) => {
    setState((prev) => ({ ...prev, selectedUser: { id } }));
    handleUserAction("delete");
  };

  const handleSearch = (value) => {
    setState((prev) => ({ ...prev, searchQuery: value }));
  };

  const filteredUsers = state.users.filter(
    (user) =>
      user.username.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  return (
    <>
      {contextHolder}
      <Card
        title={<span className="text-xl font-bold">User Management</span>}
        extra={
          <Space>
            <Search
              placeholder="Search by username or email..."
              allowClear
              enterButton={<SearchOutlined />}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => toggleModal("add", true)}
            >
              Add User
            </Button>
          </Space>
        }
        variant="borderless"
        style={{ boxShadow: "none" }}
        styles={{ header: { borderBottom: "none" } }}
      >
        <UserStatistics data={filteredUsers} />
        <Table
          columns={columns(handleEdit, handleDelete)}
          dataSource={filteredUsers}
          pagination={{ pageSize: 5, responsive: true }}
          className="rounded-lg"
          rowKey="id"
          loading={state.loading}
          rowClassName="hover:bg-gray-50 cursor-pointer"
          scroll={{ x: true }}
          size="middle"
        />
      </Card>
      <Modal
        title={state.modalAction === "add" ? "Add User" : "Edit User"}
        open={state.modalVisible}
        onCancel={() => toggleModal(state.modalAction, false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <ModalUserForm
          form={form}
          onFinish={(values) => handleUserAction(state.modalAction, values)}
          initialValues={state.selectedUser}
        />
      </Modal>

      <ModalDelete
        visible={!!state.selectedUser}
        onCancel={() => toggleModal("delete", false)}
        onSuccess={() => handleUserAction("delete")}
        loading={state.loading}
        title="Delete User"
        extra={<p>Are you sure you want to delete this user?</p>}
      />
    </>
  );
};

export default Users;
