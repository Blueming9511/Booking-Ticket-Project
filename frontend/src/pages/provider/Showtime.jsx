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
        showtimes: [],
        filteredShowtimes: [],
        filters: {
            cinema: null,
            room: null,
            status: null,
            cinemaOptions: [],
            roomOptions: [],
            statusOptions: [
                {value: "Active", label: "Active"},
                {value: "Inactive", label: "Inactive"},
            ],
        },
        modals: {
            add: false,
            edit: false,
        },
        pagination: {
            page: 0,
            size: 5,
            totalElements: 0
        },
        movies: null,
        selectedShowtime: null,
    });
    const [loading, setLoading] = useState(false)
    const fetchShowtime = async (page = 0, size = 5) => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:8080/api/showtimes/v2/?page=${page}&size=${size}`);
            setState((prev) => ({
                ...prev,
                showtimes: res.data.content,
                pagination: {...state.pagination, totalElements: res.data.totalElements}
            }))
            messageApi.success("Successfully!", 2)
        } catch (e) {
            messageApi.error("Fetching error", 2);
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const fetchData = useCallback(
        async (showSuccess = true) => {
            try {
                const [cinemasRes, roomsRes, moviesRes, movies] =
                    await Promise.all([
                        axios.get("http://localhost:8080/api/cinemas/names", {
                            withCredentials: true,
                        }),
                        axios.get("http://localhost:8080/api/screens/names", {
                            withCredentials: true,
                        }),
                        axios.get("http://localhost:8080/api/movies/names", {
                            withCredentials: true,
                        }),
                        axios.get("http://localhost:8080/api/movies", {
                            withCredentials: true,
                        }),
                    ]);
                setState((prev) => ({
                    ...prev,
                    movies: movies.data.content,
                    rooms: roomsRes.data,
                    filters: {
                        ...prev.filters,
                        cinemaOptions: Object.entries(cinemasRes.data).map(
                            ([value, label]) => ({
                                value,
                                label,
                            })
                        ),
                        roomOptions: Object.entries(roomsRes.data).map(
                            ([value, label]) => ({
                                value,
                                label,
                            })
                        ),
                        movieOptions: Object.entries(moviesRes.data).map(
                            ([value, label]) => ({
                                value,
                                label,
                            })
                        ),
                    },
                }));
            } catch (error) {
                console.error("Fetch error:", error);
            }
        },
        [messageApi]
    );

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        fetchShowtime(state.pagination.page, state.pagination.size)
    }, [state.pagination.page]);

    useEffect(() => {
        const {cinema, room, status} = state.filters;
        let result = [...state.showtimes];
        if (cinema) result = result.filter((item) => item.cinemaCode === cinema);
        if (room)
            result = result.filter((item) => item.screenCode === room.split("-")[1]);
        if (status) result = result.filter((item) => item.status === status);

        setState((prev) => ({...prev, filteredShowtimes: result}));
    }, [state.filters, state.showtimes]);

    useEffect(() => {
        if (state.movies) {
            console.log("✅ Movies updated:", state.movies);
        }
    }, [state.movies]);

    const handleFilterChange = (field, value) => {
        setState((prev) => {
            const updatedFilters = {...prev.filters, [field]: value};

            if (field === "cinema") {
                updatedFilters.room = value ? state.rooms[value] : null;
                updatedFilters.roomOptions = state.rooms[value] || [];
            }

            return {...prev, filters: updatedFilters};
        });
    };

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
            setLoading(true)
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
            setLoading(false)
        }
    };

    const {filteredShowtimes, filters, modals, selectedShowtime} =
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
                <ShowTimeStatistics data={filteredShowtimes}/>
                <ShowTimeTable
                    data={state.showtimes}
                    loading={loading}
                    onEdit={(showtime) => toggleModal("edit", true, showtime)}
                    onDelete={(showtime) => toggleModal("delete", true, showtime)}
                    movies={state.movies}
                    cinemas={filters.cinemaOptions}
                    rooms={filters.roomOptions}
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