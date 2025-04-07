import React, { useState, useEffect, useCallback } from "react";
import { Card, Button, Space, Input, Select, message } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import ModalSeatAdd from "../../components/ProviderManagement/Seat/ModalSeatAdd";
import ModalSeatEdit from "../../components/ProviderManagement/Seat/ModalSeatEdit";
import SeatStatistics from "../../components/ProviderManagement/Seat/SeatStatistics";
import { SeatTable } from "../../components/ProviderManagement/Seat/SeatTable";
import ModalDelete from "../../components/ui/Modal/ModalDelete";
import axios from "axios";

const Seat = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [state, setState] = useState({
    seats: [],
    filteredSeats: [],
    filters: {
      search: "",
      status: null,
      type: null,
      cinema: null,
      room: null,
      cinemaOptions: [],
      roomOptions: [],
      statusOptions: [
        { value: "AVAILABLE", label: "Available" },
        { value: "BOOKED", label: "Booked" },
        { value: "MAINTENANCE", label: "Maintenance" },
      ],
      typeOptions: [
        { value: "STANDARD", label: "Standard" },
        { value: "VIP", label: "VIP" },
        { value: "COUPLE", label: "Couple" },
      ],
    },
    modals: {
      add: false,
      edit: false,
      delete: false,
    },
    selectedSeat: null,
    loading: false,
    cinemas: [],
    rooms: {},
  });

  const fetchData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      messageApi.loading("Fetching data...");

      const [seatsRes, cinemasRes, screensRes] = await Promise.all([
        axios.get("http://localhost:8080/api/seats", { withCredentials: true }),
        axios.get("http://localhost:8080/api/cinemas/names", {
          withCredentials: true,
        }),
        axios.get("http://localhost:8080/api/screens/v2/names", {
          withCredentials: true,
        }),
      ]);

      const formattedRooms = Object.fromEntries(
        Object.entries(screensRes.data).map(([cinemaId, screens]) => [
          cinemaId,
          screens.map((screen) => ({ value: screen, label: screen })),
        ])
      );

      setState((prev) => ({
        ...prev,
        seats: seatsRes.data,
        filteredSeats: seatsRes.data,
        cinemas: cinemasRes.data,
        rooms: formattedRooms,
        filters: {
          ...prev.filters,
          cinemaOptions: Object.entries(cinemasRes.data).map(
            ([value, label]) => ({
              value,
              label,
            })
          ),
          roomOptions: [],
        },
      }));

      messageApi.destroy();
      messageApi.success("Data fetched successfully", 2);
    } catch (error) {
      messageApi.error("Failed to fetch data", 2);
      console.error("Fetch error:", error);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [messageApi]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const { search, status, type, cinema, room } = state.filters;
    let result = [...state.seats];

    if (search)
      result = result.filter(
        (seat) =>
          seat.id.toLowerCase().includes(search.toLowerCase()) ||
          seat.row.toLowerCase().includes(search.toLowerCase())
      );
    if (status) result = result.filter((seat) => seat.status === status);
    if (type) result = result.filter((seat) => seat.type === type);
    if (room) result = result.filter((seat) => seat.screenCode === room);

    setState((prev) => ({ ...prev, filteredSeats: result }));
  }, [state.filters, state.seats]);

  const handleFilterChange = (field, value) => {
    setState((prev) => {
      const updatedFilters = { ...prev.filters, [field]: value };

      if (field === "cinema") {
        updatedFilters.room = value ? state.rooms[value][0]?.value : null;
        updatedFilters.roomOptions = state.rooms[value] || [];
      }

      return { ...prev, filters: updatedFilters };
    });
  };

  const toggleModal = (modalName, isOpen, seat = null) => {
    setState((prev) => ({
      ...prev,
      modals: { ...prev.modals, [modalName]: isOpen },
      selectedSeat: isOpen ? seat : null,
    }));
  };

  const handleSubmit = async (action, values = null) => {
    const config = {
      add: {
        method: "post",
        url: "http://localhost:8080/api/seats",
        data: values,
      },
      edit: {
        method: "put",
        url: `http://localhost:8080/api/seats/${state.selectedSeat?.id}`,
        data: values,
      },
      delete: {
        method: "delete",
        url: `http://localhost:8080/api/seats/${state.selectedSeat}`,
      },
    };

    try {
      setState((prev) => ({ ...prev, loading: true }));
      await axios({ ...config[action], withCredentials: true });
      messageApi.success(
        `Seat ${action === "add" ? "added" : action === "edit" ? "updated" : "deleted"} successfully`,
        2
      );
      await fetchData(false);
      toggleModal(action, false);
    } catch (error) {
      messageApi.error(
        `Failed to ${action} seat: ${error.response?.data?.message || error.message}`,
        2
      );
      console.error(`${action} error:`, error);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const { filteredSeats, filters, modals, selectedSeat, loading } = state;

  return (
    <>
      {contextHolder}
      <Card
        title={<span className="text-xl font-bold">Seat Management</span>}
        variant="borderless"
        style={{ boxShadow: "none" }}
        styles={{ header: { borderBottom: "none" } }}
        extra={
          <Space wrap>
            <Select
              placeholder="Cinema"
              value={filters.cinema}
              onChange={(v) => handleFilterChange("cinema", v)}
              options={filters.cinemaOptions}
              style={{ width: 200 }}
              allowClear
              disabled={loading}
            />
            <Select
              placeholder="Screen"
              value={filters.room}
              onChange={(v) => handleFilterChange("room", v)}
              options={filters.roomOptions}
              style={{ width: 150 }}
              allowClear
              disabled={!filters.cinema || loading}
            />
            <Input.Search
              placeholder="Search seats..."
              onSearch={(v) => handleFilterChange("search", v)}
              style={{ width: 250 }}
              disabled={loading}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => toggleModal("add", true)}
              loading={loading}
              disabled={loading}
            >
              Add Seat
            </Button>
          </Space>
        }
      >
        <SeatStatistics data={filteredSeats} loading={loading} />
        <SeatTable
          data={filteredSeats}
          onEdit={(seat) => toggleModal("edit", true, seat)}
          onDelete={(seat) => toggleModal("delete", true, seat)}
          loading={loading}
          cinemas={state.cinemas}
          screens={state.rooms}
        />
      </Card>

      <ModalSeatAdd
        visible={modals.add}
        onCancel={() => toggleModal("add", false)}
        onSuccess={(values) => handleSubmit("add", values)}
        cinemas={state.cinemas}
        rooms={state.rooms}
        loading={loading}
      />
      <ModalSeatEdit
        visible={modals.edit}
        onCancel={() => toggleModal("edit", false)}
        onSuccess={(values) => handleSubmit("edit", values)}
        initialValues={selectedSeat}
        cinemas={state.cinemas}
        rooms={state.rooms}
        loading={loading}
      />
      <ModalDelete
        visible={modals.delete}
        onCancel={() => toggleModal("delete", false)}
        onSuccess={() => handleSubmit("delete")}
        loading={loading}
        extra={
          <p>Deleting a seat will remove it permanently from the system.</p>
        }
      />
    </>
  );
};

export default Seat;
