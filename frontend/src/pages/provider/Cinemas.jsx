import React, { useState, useCallback, useEffect } from "react";
import { Card, Space, Button, Input, Select, message } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import ModalCinemaEdit from "../../components/ProviderManagement/Cinema/ModalCinemaEdit";
import ModalCinemaAdd from "../../components/ProviderManagement/Cinema/ModalCinemaAdd";
import CinemaStatistics from "../../components/ProviderManagement/Cinema/CinemaStatistics";
import ModalDelete from "../../components/ui/Modal/ModalDelete";
import {CinemaTable} from "../../components/ProviderManagement/Cinema/CinemaTable";
import axios from "axios";

const { Search } = Input;

const Cinemas = ({role="Admin"}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [state, setState] = useState({
    cinemas: [],
    filteredCinemas: [],
    filters: {
      search: "",
      status: null,
      statusOptions: [
        { value: "OPEN", label: "Open" },
        { value: "CLOSE", label: "Close" },
        { value: "MAINTENANCE", label: "Maintenance" },
      ],
    },
    modals: {
      add: false,
      edit: false,
      delete: false,
    },
    selectedCinema: null,
    loading: false,
  });

  const fetchData = useCallback(async (showSuccess = true) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      showSuccess && messageApi.loading("Fetching data...");

      const response = await axios.get("http://localhost:8080/api/cinemas", {
        withCredentials: true,
      });

      setState(prev => ({
        ...prev,
        cinemas: response.data,
        filteredCinemas: response.data,
      }));

      showSuccess && messageApi.destroy();
      showSuccess && messageApi.success("Data fetched successfully", 2);
    } catch (error) {
      showSuccess && messageApi.error("Failed to fetch data", 2);
      console.error("Fetch error:", error);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [messageApi]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (field, value) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, [field]: value },
    }));
  };

  const toggleModal = (modalName, isOpen, cinema = null) => {
    setState(prev => ({
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
        url: `http://localhost:8080/api/cinemas/${state.selectedCinema?.id}`,
      },
    };

    try {
      setState(prev => ({ ...prev, loading: true }));
      console.log(config[action].data)
      await axios({ ...config[action], withCredentials: true });
      messageApi.success(`Cinema ${action}ed successfully`, 2);
      await fetchData(false);
      toggleModal(action, false);
    } catch (error) {
      messageApi.error(`Failed to ${action} cinema`, 2);
      console.error(`${action} error:`, error);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const { filteredCinemas, filters, modals, selectedCinema, loading } = state;

  return (
    <>
      {contextHolder}
      <Card
        title={<span className="text-2xl font-bold">Cinema Management</span>}
        extra={
          <Space>
            <Select
              placeholder="Filter by Status"
              value={filters.status}
              onChange={(value) => handleFilterChange("status", value)}
              style={{ width: 150 }}
              allowClear
              options={filters.statusOptions}
            />

            <Search
              placeholder="Search cinemas..."
              allowClear
              enterButton={<SearchOutlined />}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              style={{ width: 300 }}
            />

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => toggleModal("add", true)}
            >
              Add Cinema
            </Button>
          </Space>
        }
        variant="borderless"
        style={{ boxShadow: "none" }}
        styles={{ header: { borderBottom: "none" } }}
      >
        <CinemaStatistics data={filteredCinemas} />
        <CinemaTable 
          data={filteredCinemas} 
          onEdit={(cinema) => toggleModal("edit", true, cinema)}
          onDelete={(cinema) => toggleModal("delete", true, cinema)}
          loading={loading}
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
        extra={<p>Deleting a cinema will also delete all screens and movies associated with it</p>}
      />
    </>
  );
};

export default Cinemas;