import React, { useState, useEffect, useCallback } from "react";
import { Card, Button, Space, Input, Select, message } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import ModalScreenAdd from "../../components/ProviderManagement/Screen/ModalScreenAdd";
import ModalScreenEdit from "../../components/ProviderManagement/Screen/ModalScreenEdit";
import ScreenStatistics from "../../components/ProviderManagement/Screen/ScreenStatistics";
import ScreenTable from "../../components/ProviderManagement/Screen/ScreenTable";
import ModalDelete from "../../components/ui/Modal/ModalDelete";
import axios from "axios";

const Screen = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [state, setState] = useState({
    screens: [],
    filteredScreens: [],
    filters: {
      search: "",
      status: null,
      type: null,
      cinema: null,
      cinemaOptions: {},
      typeOptions: [],
      statusOptions: [
        { value: "ACTIVE", label: "Active" },
        { value: "INACTIVE", label: "Inactive" },
        { value: "MAINTENANCE", label: "Maintenance" },
      ],
    },
    modals: {
      add: false,
      edit: false,
      delete: false,
    },
    selectedScreen: null,
    loading: false,
  });

  const fetchData = useCallback(async (showSucess=true) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      showSucess && messageApi.loading("Fetching data...");
      
      const [screensRes, cinemaRes, typeRes, cinemas] = await Promise.all([
        axios.get("http://localhost:8080/api/screens", { withCredentials: true }),
        axios.get("http://localhost:8080/api/cinemas/names", { withCredentials: true }),
        axios.get("http://localhost:8080/api/screens/types", { withCredentials: true }),
        axios.get("http://localhost:8080/api/cinemas", { withCredentials: true }),
      ]);

      setState(prev => ({
        ...prev,
        screens: screensRes.data,
        filteredScreens: screensRes.data,
        filters: {
          ...prev.filters,
          cinemaOptions: Object.entries(cinemaRes.data).map(([value, label]) => ({ value, label })),
          typeOptions: Object.entries(typeRes.data).map(([value, label]) => ({ value, label })),
        },
        cinemas: cinemas.data
      }));
      showSucess && messageApi.destroy();
      showSucess && messageApi.success("Data fetched successfully", 2);
    } catch (error) {
      showSucess && messageApi.error("Failed to fetch data", 2);
      console.error("Fetch error:", error);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [messageApi]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const { search, status, type, cinema } = state.filters;
    let result = [...state.screens];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        screen =>
            screen.id.toLowerCase().includes(searchLower) ||
            screen.cinema.toLowerCase().includes(searchLower) ||
            screen.location.toLowerCase().includes(searchLower)
      );
    }
    if (status) result = result.filter(screen => screen.status === status);
    if (type) {
      const selectedType = filters.typeOptions.find(opt => opt.value === type);
      result = result.filter(screen => screen.type === selectedType?.label);
    }
    if (cinema) {
      result = result.filter(screen => screen.cinemaId === cinema);
    }

    setState(prev => ({ ...prev, filteredScreens: result }));
  }, [state.filters, state.screens]);

  const handleFilterChange = (field, value) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, [field]: value },
    }));
  };

  const toggleModal = (modalName, isOpen, screen = null) => {
    setState(prev => ({
      ...prev,
      modals: { ...prev.modals, [modalName]: isOpen },
      selectedScreen: isOpen ? screen : null,
    }));
  };

  const handleSubmit = async (action, values = null) => {
     console.log(state.selectedScreen);
    const config = {
      add: {
        method: "post",
        url: "http://localhost:8080/api/screens",
        data: values,
      },
      edit: {
        method: "put",
        url: `http://localhost:8080/api/screens/${state.selectedScreen?.id}`,
        data: values,
      },
      delete: {
        method: "delete",
        url: `http://localhost:8080/api/screens/${state.selectedScreen}`,
      },
    };

    try {
      setState(prev => ({ ...prev, loading: true }));
      await axios({ ...config[action], withCredentials: true });
      messageApi.success(`Screen ${action}ed successfully`, 2);
      await fetchData(false);
      toggleModal(action, false);
    } catch (error) {
      messageApi.error(`Failed to ${action} screen`, 2);
      console.error(`${action} error:`, error);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const {
    filteredScreens,
    filters,
    modals,
    selectedScreen,
    loading
  } = state;

  return (
    <>
      {contextHolder}
      <Card
        title="Screen Management"
        variant="borderless"
        styles = {{header: {borderBottom: 'none'}}}
        extra={
          <Space wrap>
            <Select
              placeholder="Status"
              value={filters.status}
              onChange={v => handleFilterChange("status", v)}
              style={{ width: 150 }}
              allowClear
              options={filters.statusOptions}
              disabled={loading}
            />
            <Select
              placeholder="Type"
              value={filters.type}
              onChange={v => handleFilterChange("type", v)}
              style={{ width: 150 }}
              allowClear
              options={filters.typeOptions}
              disabled={loading}
            />
            <Select
              placeholder="Cinema"
              value={filters.cinema}
              onChange={v => handleFilterChange("cinema", v)}
              style={{ width: 200 }}
              allowClear
              options={filters.cinemaOptions}
              disabled={loading}
            />
            <Input.Search
              placeholder="Search screens..."
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={v => handleFilterChange("search", v)}
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
              Add Screen
            </Button>
          </Space>
        }
      >
        <ScreenStatistics data={filteredScreens} loading={loading} />
        {console.log(state.cinemas)}
        <ScreenTable
          data={filteredScreens}
          onEdit={screen => toggleModal("edit", true, screen)}
          onDelete={screen => toggleModal("delete", true, screen)}
          loading={loading}
          cinemas={state.cinemas || []}
        />
      </Card>

      <ModalScreenAdd
        visible={modals.add}
        onCancel={() => toggleModal("add", false)}
        onSuccess={values => handleSubmit("add", values)}
        cinemas={state.cinemas || []}
        loading={loading}
      />
      <ModalScreenEdit
        visible={modals.edit}
        onCancel={() => toggleModal("edit", false)}
        onSuccess={values => handleSubmit("edit", values)}
        cinemas={state.cinemas || []}
        initialValues={selectedScreen}
        loading={loading}
      />
      <ModalDelete
        visible={modals.delete}
        onCancel={() => toggleModal("delete", false)}
        onSuccess={() => handleSubmit("delete")}
        initialValues={selectedScreen}
        loading={loading}
        extra={<p>Are you sure you want to delete this screen</p>}
      />
    </>
  );
};

export default Screen;