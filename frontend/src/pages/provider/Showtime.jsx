import React, {useState, useEffect, useCallback} from "react";
import {Card, Space, Button, Select, message} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import ModalShowTimeAdd from "../../components/ProviderManagement/Showtime/ModalShowTimeAdd";
import ModalShowTimeEdit from "../../components/ProviderManagement/Showtime/ModalShowTimeEdit";
import ShowTimeStatistics from "../../components/ProviderManagement/Showtime/ShowtimeStatistics";
import ShowTimeTable from "../../components/ProviderManagement/Showtime/ShowtimeTable";
import axios from "axios";
import ModalDelete from "../../components/ui/Modal/ModalDelete";

const Showtime = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [state, setState] = useState({
        showtimes: null,
        pagination: {
            page: 0,
            size: 5,
            totalElements: 0
        },
        filters: {
            cinemaOptions: {},
            screenOptions: {},

        }
    })

    const fetchShowtime = async (page = 0, size = 5) => {
        try {
            const res = await axios.get("http://localhost:8080/api/showtimes", {withCredentials: true});
            setState(prev => ({
                ...prev,
                showtimes: res.data.content,
                pagination: {
                    ...prev.pagination,
                    totalElements: res.data.totalElements
                }
            }));
            messageApi.success("Successfully", 2)
        } catch (e) {
            messageApi.error("Fetching error!");
        }
    }

    useEffect(() => {
        fetchShowtime(state.pagination.page, state.pagination.size)
    }, [state.pagination.page])

    const toggleModal = (modalName, isOpen, showtime = null) => {
        setState((prev) => ({
            ...prev,
            modals: {...prev.modals, [modalName]: isOpen},
            selectedShowtime: isOpen ? showtime : null,
        }));
    };

    const handleSubmit = async (action, values = null) => {
        const config = {
            add: {
                method: "post",
                url: "http://localhost:8080/api/showtimes",
                data: values,
            },
            edit: {
                method: "put",
                url: `http://localhost:8080/api/showtimes/${state.selectedShowtime?.id}`,
                data: values,
            },
            delete: {
                method: "delete",
                url: `http://localhost:8080/api/showtimes/${state.selectedShowtime}`,
            },
        };

        try {
            setState((prev) => ({...prev, loading: true}));
            await axios({...config[action], withCredentials: true});
            messageApi.success(
                `Showtime ${action === "add" ? "added" : "updated"} successfully`,
                2
            );
            await fetchData(false);
            toggleModal(action, false);
        } catch (error) {
            messageApi.error(`Failed to ${action} showtime`, 2);
            console.error(`${action} error:`, error);
        } finally {
            setState((prev) => ({...prev, loading: false}));
        }
    };

    const {filteredShowtimes, filters, modals, selectedShowtime, loading} =
        state;

    return (
        <>
            {contextHolder}
            <Card
                title={<span className="text-xl font-bold">Showtime Management</span>}
                variant="borderless"
                style={{boxShadow: "none"}}
                styles={{header: {borderBottom: "none"}}}
                extra={
                    <Space>
                        <Select
                            placeholder="Cinema"
                            value={filters.cinema}
                            onChange={(v) => handleFilterChange("cinema", v)}
                            options={filters.cinemaOptions}
                            style={{width: 200}}
                            allowClear
                        />
                        <Select
                            placeholder="Room"
                            value={filters.room}
                            onChange={(v) => handleFilterChange("room", v)}
                            options={filters.roomOptions}
                            style={{width: 150}}
                            allowClear
                        />
                        <Select
                            placeholder="Status"
                            value={filters.status}
                            onChange={(v) => handleFilterChange("status", v)}
                            options={filters.statusOptions}
                            style={{width: 150}}
                            allowClear
                        />
                        <Button
                            type="primary"
                            icon={<PlusOutlined/>}
                            onClick={() => toggleModal("add", true)}
                        >
                            Add Showtime
                        </Button>
                    </Space>
                }
            >
                <ShowTimeStatistics data={state.showtimes} bookings={state.bookingDetailsRes}/>
                <ShowTimeTable
                    data={state.showtimes}
                    loading={loading}
                    onEdit={(showtime) => toggleModal("edit", true, showtime)}
                    onDelete={(showtime) => toggleModal("delete", true, showtime)}
                    movies={state.movies}
                    cinemas={filters.cinemaOptions}
                    rooms={filters.roomOptions}
                    bookingDetails={state.bookingDetailsRes}
                />
            </Card>

            <ModalShowTimeAdd
                visible={modals.add}
                onCancel={() => toggleModal("add", false)}
                onSuccess={(values) => handleSubmit("add", values)}
                cinemaOptions={filters.cinemaOptions}
                roomOptions={filters.roomOptions}
                movieOptions={filters.movieOptions}
            />

            <ModalShowTimeEdit
                visible={modals.edit}
                onCancel={() => toggleModal("edit", false)}
                onSuccess={(values) => handleSubmit("edit", values)}
                initialValues={selectedShowtime}
                cinemaOptions={filters.cinemaOptions}
                roomOptions={filters.roomOptions}
                movieOptions={filters.movieOptions}
            />

            <ModalDelete
                title={selectedShowtime?.cinema}
                visible={modals.delete}
                onSuccess={() => handleSubmit("delete")}
                onCancel={() => toggleModal("delete", false)}
                loading={loading}
                onDelete={() => handleSubmit("delete")}
                extra={<p>Are you sure you want to delete this showtime?</p>}
            />
        </>
    );
};

export default Showtime;
