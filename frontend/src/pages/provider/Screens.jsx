import React, { useState, useEffect, useCallback } from "react";
import { Card, Button, Space, Input, Select, message } from "antd";
import { PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
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
        pagination: {
            page: 0,
            size: 5,
            totalElements: 0,
        },
        modals: {
            add: false,
            edit: false,
            delete: false,
        },
        selectedScreen: null,
        loading: false,
    });

    useEffect(() => {
        const fetchCinemaOptions = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/provider/cinemaOptions", { withCredentials: true });
                setState(prev => ({
                    ...prev,
                    filters: { ...prev.filters, cinemaOptions: response.data },
                }));
            } catch (error) {
                messageApi.error("Failed to fetch data", 2);
                console.error("Fetch error:", error);
            }
        };
        fetchCinemaOptions();
    }, [])

    const fetchScreen = async (page = 0, size = 5, cinema = "") => {
        try {
            const response = await axios.get(`http://localhost:8080/api/provider/screens?page=${page}&size=${size}&cinema=${cinema ? cinema : ""}`, { withCredentials: true });
            setState(prev => ({
                ...prev,
                screens: response.data.content,
                pagination: { ...prev.pagination, totalElements: response.data.totalElements }
            }));
        } catch (error) {
            messageApi.error("Failed to fetch data", 2);
            console.error("Fetch error:", error);
        }
    }

    useEffect(() => {
        fetchScreen(state.pagination.page, 5, state.filters.cinema);
    }, [state.pagination.page, state.filters.cinema]);

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
                url: "http://localhost:8080/api/provider/screens/v2",
                data: values,
            },
            edit: {
                method: "put",
                url: `http://localhost:8080/api/provider/screens/v2/${state.selectedScreen?.id}`,
                data: values,
            },
            delete: {
                method: "delete",
                url: `http://localhost:8080/api/provider/screens/${state.selectedScreen}`,
            },
        };

        try {
            setState(prev => ({ ...prev, loading: true }));
            // console.log(values)
            await axios({ ...config[action], withCredentials: true });
            await fetchScreen(0, 5, "");
            messageApi.success(`Screen ${action}ed successfully`, 2);
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
                title={<span className="text-xl font-bold">Screen Management</span>}
                variant="borderless"
                styles={{ header: { borderBottom: 'none' } }}
                style={{ boxShadow: 'none' }}
            >
                {/* <ScreenStatistics data={state.screens} loading={loading} /> */}
                <div className="flex mb-5">
                    <Space wrap>
                        <Select
                            placeholder="Cinema"
                            value={filters.cinema}
                            onChange={v => handleFilterChange("cinema", v)}
                            style={{ width: 200 }}
                            allowClear
                            options={Object.entries(filters.cinemaOptions).map(([value, label]) => ({
                                label,
                                value
                            }))}
                            disabled={loading}
                        />
                        <Button
                            type="primary"
                            icon={<ReloadOutlined />}
                            onClick={() => fetchScreen(0, 5, "")}
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
                </div>
                <ScreenTable
                    data={state.screens}
                    onEdit={screen => toggleModal("edit", true, screen)}
                    onDelete={screen => toggleModal("delete", true, screen)}
                    loading={loading}
                    cinemas={state.cinemas || []}
                    pagination={state.pagination}
                    onSetPage={page => setState(prev => ({ ...prev, pagination: { ...prev.pagination, page } }))}
                />
            </Card>

            <ModalScreenAdd
                visible={modals.add}
                onCancel={() => toggleModal("add", false)}
                onSuccess={values => handleSubmit("add", values)}
                cinemas={state.filters.cinemaOptions || []}
                loading={loading}
            />
            <ModalScreenEdit
                visible={modals.edit}
                onCancel={() => toggleModal("edit", false)}
                onSuccess={values => handleSubmit("edit", values)}
                cinemas={state.filters.cinemaOptions || []}
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