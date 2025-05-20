import React, { useState, useCallback, useEffect } from "react";
import { Card, Space, Button, Input, Select, message } from "antd";
import { PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import ModalCinemaEdit from "../../components/ProviderManagement/Cinema/ModalCinemaEdit";
import ModalCinemaAdd from "../../components/ProviderManagement/Cinema/ModalCinemaAdd";
import CinemaStatistics from "../../components/ProviderManagement/Cinema/CinemaStatistics";
import ModalDelete from "../../components/ui/Modal/ModalDelete";
import { CinemaTable } from "../../components/ProviderManagement/Cinema/CinemaTable";
import axios from "axios";
import cinemas from "../admin/Cinemas.jsx";

const { Search } = Input;

const Cinemas = ({ role = "Admin" }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [state, setState] = useState({
    cinemas: [],
    pagination: {
      page: 0,
      size: 5,
      totalElements: 0,
    },
    search: "",
    modals: {
      add: false,
      edit: false,
      delete: false,
    },
    selectedCinema: null,
    loading: false,
  });

  const fetchData = useCallback(
    async (showSuccess = true, page = 0, size = 5) => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        showSuccess && messageApi.loading("Fetching data...");

        const response = await axios.get(`http://localhost:8080/api/cinemas?page=${page}&size=${size}`, {
          withCredentials: true,
        });

        setState((prev) => ({
          ...prev,
          cinemas: response.data.content,
          filteredCinemas: response.data.content,
          pagination: {
            ...prev.pagination,
            totalElements: response.data.totalElements,
          }
        }));

        showSuccess && messageApi.destroy();
        showSuccess && messageApi.success("Data fetched successfully", 2);
      } catch (error) {
        showSuccess && messageApi.error("Failed to fetch data", 2);
        console.error("Fetch error:", error);
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [messageApi, state.pagination.page]
  );

  useEffect(() => {
    fetchData(true, state.pagination.page, state.pagination.size);
  }, [fetchData]);

  const handleFilterChange = (field, value) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, [field]: value },
    }));

  };

  const toggleModal = (modalName, isOpen, cinema = null) => {
    setState((prev) => ({
      ...prev,
      modals: { ...prev.modals, [modalName]: isOpen },
      selectedCinema: isOpen ? cinema : null,
    }));
  };

  const handleSubmit = async (action, values = null) => {
    const config = {
      add: {
        method: "post",
        url: "http://localhost:8080/api/cinemas",
        data: values,
      },
      edit: {
        method: "put",
        url: `http://localhost:8080/api/cinemas/${state.selectedCinema?.id}`,
        data: values,
      },
      delete: {
        method: "delete",
        url: `http://localhost:8080/api/cinemas/${state.selectedCinema}`,
      },
    };

    try {
      setState((prev) => ({ ...prev, loading: true }));
      console.log(selectedCinema)
      await axios({ ...config[action], withCredentials: true });
      messageApi.success(`Cinema ${action}ed successfully`, 2);
      await fetchData(false);
      toggleModal(action, false);
    } catch (error) {
      messageApi.error(`Failed to ${action} cinema`, 2);
      console.error(`${action} error:`, error);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handlePageChange = async (page) => {
    setState((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        page,
      },
    }));
  };



  const { filteredCinemas, filters, modals, selectedCinema, loading } = state;

  return (
    <>
      {contextHolder}
      <Card
        title={<span className="text-xl font-bold">Cinema Management</span>}
        variant="borderless"
        style={{ boxShadow: "none" }}
        styles={{ header: { borderBottom: "none" } }}
      >

        <CinemaStatistics data={state.cinemas} />
        <div className="flex justify-end mb-5">
          <Space>
            <Search
              placeholder="Search cinemas..."
              allowClear
              enterButton={<SearchOutlined />}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              style={{ width: 300 }}
            />

            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={() => setState((prev) => ({ ...prev, pagination: { ...prev.pagination, page: 0 } }))}
            >
            </Button>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => toggleModal("add", true)}
            >
              Add Cinema
            </Button>
          </Space>
        </div>

        <CinemaTable
          data={state.cinemas}
          onEdit={(cinema) => toggleModal("edit", true, cinema)}
          onDelete={(cinema) => toggleModal("delete", true, cinema)}
          loading={loading}
          pagination={state.pagination}
          onPageChange={handlePageChange}
        />
      </Card>

      <ModalCinemaAdd
        visible={modals.add}
        onCancel={() => toggleModal("add", false)}
        onSuccess={(values) => handleSubmit("add", values)}
        loading={loading}
        role={role}
      />

      <ModalCinemaEdit
        visible={modals.edit}
        onCancel={() => toggleModal("edit", false)}
        onSuccess={(values) => handleSubmit("edit", values)}
        initialValues={selectedCinema}
        loading={loading}
      />

      <ModalDelete
        visible={modals.delete}
        onCancel={() => toggleModal("delete", false)}
        onSuccess={() => handleSubmit("delete")}
        loading={loading}
        extra={
          <p>
            Deleting a cinema will also delete all screens and movies associated
            with it
          </p>
        }
      />
    </>
  );
};

export default Cinemas;
