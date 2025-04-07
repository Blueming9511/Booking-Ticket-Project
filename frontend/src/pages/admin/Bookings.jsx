import React, { useState, useEffect, useCallback } from "react";
import { Table, Modal, message, Form, Card, Space } from "antd";
import axios from "axios";
import BookingStatistics from "../../components/AdminManagement/Booking/BookingStatistics";
import ModalBookingForm from "../../components/AdminManagement/Booking/ModalBookingForm";
import { columns } from "../../components/AdminManagement/Booking/ColumnsConfig";
import Search from "antd/es/transfer/search";
import { SearchOutlined } from "@ant-design/icons";
import Showtime from "../provider/Showtime";
import ModalDelete from "../../components/ui/Modal/ModalDelete";

const Booking = () => {
  const [state, setState] = useState({
    bookings: [],
    seats: [],
    users: [],
    showtimes: [],
    loading: false,
    selectedBooking: null,
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
        showSuccess && messageApi.loading("Fetching bookings...");

        const [bookingDetailsRes, showtimeRes, seatsRes, usersRes] =
          await Promise.all([
            await axios.get("http://localhost:8080/api/bookingdetails"),
            await axios.get("http://localhost:8080/api/showtimes"),
            await axios.get("http://localhost:8080/api/seats"),
            await axios.get("http://localhost:8080/api/users"),
          ]);
        
        setState((prev) => ({
          ...prev,
          bookings: bookingDetailsRes.data,
          showtimes: showtimeRes.data,
          seats: seatsRes.data,
          users: usersRes.data,
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
  }, []);

  const toggleModal = (action, visible) => {
    setState((prev) => ({
      ...prev,
      modalVisible: visible,
      modalAction: action,
      selectedBooking:
        action === "edit" && visible ? prev.selectedBooking : null,
    }));
    if (!visible) form.resetFields();
  };

  const handleBookingAction = async (action, values) => {
    const config = {
      edit: {
        method: "put",
        url: `http://localhost:8080/api/bookingdetails/${state.selectedBooking?.id}`,
        data: values,
      },
      delete: {
        method: "delete",
        url: `http://localhost:8080/api/bookingdetails/${state.selectedBooking?.id}`,
      },
    };

    try {
      setState((prev) => ({ ...prev, loading: true }));
      console.log(state.selectedBooking)
      await axios({ ...config[action], withCredentials: true });
      messageApi.success(`Booking ${action}ed successfully`, 2);
      await fetchData(false);
      toggleModal(action, false);
    } catch (error) {
      messageApi.error(`Failed to ${action} booking`, 2);
      console.error(`${action} error:`, error);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleEdit = (record) => {
    setState((prev) => ({ ...prev, selectedBooking: record }));
    form.setFieldsValue(record);
    toggleModal("edit", true);
  };

  const handleDelete = (id) => {
    setState((prev) => ({ ...prev, selectedBooking: { id } }));
    handleBookingAction("delete");
  };

  const handleSearch = (value) => {
    setState((prev) => ({ ...prev, searchQuery: value }));
  };

  console.log(state.bookings);
  const filteredBookings = state.bookings?.filter(
    (booking) =>
      booking?.bookingCode?.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      booking.userCode.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  return (
    <div>
      {contextHolder}
      <Card
        title={<span className="text-xl font-bold">Booking Management</span>}
        extra={
          <Space>
            <Search
              placeholder="Search by booking code or user code..."
              allowClear
              enterButton={<SearchOutlined />}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300 }}
            />
          </Space>
        }
        variant="borderless"
        style={{ boxShadow: "none" }}
        styles={{ header: { borderBottom: "none" } }}
      >
        <BookingStatistics data={state.bookings} />
        <Table
          columns={columns(handleEdit, handleDelete, state.showtimes, state.seats, state.users)}  
          dataSource={filteredBookings}
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
        title={state.modalAction === "add" ? "Add Booking" : "Edit Booking"}
        open={state.modalVisible}
        onCancel={() => toggleModal(state.modalAction, false)}
        onOk={() => form.submit()}
      >
        <ModalBookingForm
          form={form}
          onFinish={(values) => handleBookingAction(state.modalAction, values)}
          initialValues={state.selectedBooking}
          seats = {state.seats}
          showtimes = {state.showtimes}
          users = {state.users}
        />
      </Modal>
      <ModalDelete
        open={state.modalVisible && state.modalAction === "delete"}
        onCancel={() => toggleModal("delete", false)}
        onOk={() => handleBookingAction("delete")}
        loading={state.loading}
      />
    </div>
  );
};

export default Booking;
