import React, { useState } from "react";
import { Table, Tag, Card, Space, Button, Dropdown, Divider } from "antd";
import {
  CrownOutlined,
  TeamOutlined,
  PlusOutlined,
  DownOutlined,
} from "@ant-design/icons";

const columns = [
  {
    title: "Seat ID",
    dataIndex: "id",
    key: "id",
    render: (id) => <span className="font-mono font-bold">#{id}</span>,
    width: 120,
    sorter: (a, b) => a.id.localeCompare(b.id),
  },
  {
    title: "Seat Number",
    dataIndex: "number",
    key: "number",
    render: (number) => <span className="font-medium">{number}</span>,
    width: 120,
  },
  {
    title: "Row",
    dataIndex: "row",
    key: "row",
    render: (row) => <Tag className="font-bold">{row}</Tag>,
    width: 100,
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    render: (type) => (
      <Tag
        icon={type === "VIP" ? <CrownOutlined /> : <TeamOutlined />}
        color={type === "VIP" ? "gold" : "blue"}
        className="flex items-center gap-1"
      >
        {type}
      </Tag>
    ),
    filters: [
      { text: "Standard", value: "Standard" },
      { text: "VIP", value: "VIP" },
      { text: "Couple", value: "Couple" },
    ],
    onFilter: (value, record) => record.type === value,
    width: 150,
  },
  {
    title: "Room",
    dataIndex: "room",
    key: "room",
    render: (room) => <span className="text-blue-600">{room}</span>,
    width: 150,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      let color, text;
      switch (status) {
        case "Available":
          color = "green";
          text = "Available";
          break;
        case "Booked":
          color = "red";
          text = "Booked";
          break;
        case "Maintenance":
          color = "orange";
          text = "Maintenance";
          break;
        default:
          color = "gray";
      }
      return (
        <Tag color={color} className="flex items-center gap-1">
          {text}
        </Tag>
      );
    },
    filters: [
      { text: "Available", value: "Available" },
      { text: "Booked", value: "Booked" },
      { text: "Maintenance", value: "Maintenance" },
    ],
    onFilter: (value, record) => record.status === value,
    width: 150,
  },

];

const initData = [
    {
      key: "1",
      id: "A101",
      number: "01",
      row: "A",
      type: "VIP",
      status: "Available",
      room: "Screen 1",
      cinema: "CGV Vincom Mega Mall"
    },
    {
      key: "2",
      id: "A102",
      number: "02",
      row: "A",
      type: "VIP",
      status: "Booked",
      room: "Screen 1",
      cinema: "CGV Vincom Mega Mall"
    },
    {
      key: "3",
      id: "B101",
      number: "01",
      row: "B",
      type: "Standard",
      status: "Available",
      room: "Screen 1",
      cinema: "CGV Vincom Plaza"
    },
    {
      key: "4",
      id: "B102",
      number: "02",
      row: "B",
      type: "Standard",
      status: "Available",
      room: "Screen 1",
      cinema: "CGV Vincom Plaza"
    },
    {
      key: "5",
      id: "C101",
      number: "01",
      row: "C",
      type: "Couple",
      status: "Booked",
      room: "Screen 2",
      cinema: "CGV Vincom City"
    },
    {
      key: "6",
      id: "C102",
      number: "02",
      row: "C",
      type: "Couple",
      status: "Available",
      room: "Screen 2",
      cinema: "CGV Vincom City"
    },
    {
      key: "7",
      id: "D101",
      number: "01",
      row: "D",
      type: "Standard",
      status: "Maintenance",
      room: "Screen 2",
      cinema: "CGV Vincom Plaza 2"
    },
    {
      key: "8",
      id: "D102",
      number: "02",
      row: "D",
      type: "Standard",
      status: "Available",
      room: "Screen 3",
      cinema: "CGV Vincom Plaza 2"
    },
    {
      key: "9",
      id: "E101",
      number: "01",
      row: "E",
      type: "VIP",
      status: "Booked",
      room: "Screen 3",
      cinema: "CGV Vincom Mega Mall"
    },
    {
      key: "10",
      id: "E102",
      number: "02",
      row: "E",
      type: "VIP",
      status: "Available",
      room: "Screen 3",
      cinema: "CGV Vincom Mega Mall"
    },
  ];
  
  const cinemas = [
    {
      key: "1",
      label: "CGV Vincom Mega Mall",
    },
    {
      key: "2",
      label: "CGV Vincom Plaza",
    },
    {
      key: "3",
      label: "CGV Vincom City",
    },
    {
      key: "4",
      label: "CGV Vincom Plaza 2",
    },
  ];

  const Seat = () => {
    const [selectedCinema, setSelectedCinema] = useState(cinemas[0].label);
    const [selectedRoom, setSelectedRoom] = useState("Select room");
    const [filteredData, setFilteredData] = useState(initData.filter((item) => item.cinema === cinemas[0].label));
  
    const rooms = [...new Set(
      initData
        .filter(item => item.cinema === selectedCinema)
        .map(item => item.room)
    )].map((room, index) => ({
      key: index.toString(),
      label: room,
    }));
  
    const handleCinemaSelect = ({ key }) => {
      const selected = cinemas.find(c => c.key === key)?.label || cinemas[0].label;
      setSelectedCinema(selected);
      setSelectedRoom(null);
      setFilteredData(
        initData.filter(item => 
          item.cinema === selected      ));
    };
  
    const handleRoomSelect = ({ key }) => {
      const room = rooms.find(r => r.key === key)?.label || rooms[0]?.label;
      setSelectedRoom(room);
      setFilteredData(
        initData.filter(item => 
          item.cinema === selectedCinema && 
          item.room === room
        )
      );
    };
  
    const cinemaItems = cinemas.map(cinema => ({
      ...cinema,
      onClick: () => handleCinemaSelect({ key: cinema.key })
    }));
  
    const roomItems = rooms.map(room => ({
      ...room,
      onClick: () => handleRoomSelect({ key: room.key })
    }));
  
    return (
      <Card
        title={<span className="text-xl font-bold">Seat Management</span>}
        extra={
          <Space>
            <Dropdown
              menu={{ items: cinemaItems }}
              trigger={['click']}
            >
              <Button>
                <Space>
                  {selectedCinema}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
            
            <Dropdown
              menu={{ items: roomItems }}
              trigger={['click']}
              disabled={!selectedCinema}
            >
              <Button>
                <Space>
                  {selectedRoom || "Select room"}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
            
            <Button type="primary" icon={<PlusOutlined />}>
              Add Seat
            </Button>
          </Space>
        }
        variant="borderless"
        styles={{
          header: { borderBottom: 'none' },
        }}
        style={{'boxShadow': 'none'}}
      >
        <Table 
          columns={columns} 
          dataSource={filteredData}
          pagination={{ pageSize: 8 }}
          rowClassName={(record) => 
            record.status === 'Booked' ? 'bg-red-50' : 
            record.status === 'Maintenance' ? 'bg-orange-50' : ''
          }
        />
        <Divider />
        <div className="flex justify-between text-sm text-gray-500">
          <span>Total: {filteredData.length} seats</span>
        </div>
      </Card>
    );
  };
  
  export default Seat;
