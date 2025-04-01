import React, { useState } from "react";
import DynamicTable from "../../components/ui/DynamicTable";
import {
  Tag,
  Card,
  Space,
  Button,
  Badge,
  Table,
  Divider,
  Dropdown,
  Form,
  Input,
  Select,
  DatePicker,
} from "antd";
import {
  FireOutlined,
  GiftOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  FilterOutlined,
  EllipsisOutlined,
  SearchOutlined,
  DownOutlined,
} from "@ant-design/icons";
import ModalCouponAdd from "../../components/ui/Modal/ModalCouponAdd";
import ModalCouponEdit from "../../components/ui/Modal/ModalCouponEdit";
import CouponStatistics from "../../components/ui/Card/CouponStatistics";

const { Search } = Input;
const { RangePicker } = DatePicker;

const columns = (handleEdit) => [
  {
    title: "Coupon Code",
    dataIndex: "code",
    key: "code",
    render: (code) => (
      <Badge
        count={code}
        className="font-mono font-bold text-base"
        style={{ backgroundColor: "#1890ff" }}
      />
    ),
    width: 150,
  },
  {
    title: "Offer",
    dataIndex: "discount",
    key: "discount",
    render: (discount, record) => (
      <div className="flex items-center gap-2">
        {discount.includes("%") ? (
          <FireOutlined className="text-red-500 text-lg" />
        ) : (
          <GiftOutlined className="text-green-500 text-lg" />
        )}
        <span
          className={`font-semibold w-[5rem] ${
            discount.includes("%") ? "text-red-500" : "text-green-500"
          }`}
        >
          {discount}
        </span>
      </div>
    ),
    width: 100,
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    render: (description) => (
      <span className="text-gray-500 text-sm">
        {description || "No description provided"}
      </span>
    ),
    width: 200,
  },
  {
    title: "Conditions",
    key: "conditions",
    render: (_, record) => (
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-gray-600  ">Min. Order:</span>
          <span className="font-medium">
            {record.minOrderValue ? `$${record.minOrderValue}` : "None"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Usage Limit:</span>
          <span className="font-medium">
            {record.usageLimit ? `${record.usageLimit} uses` : "Unlimited"}
          </span>
        </div>
      </div>
    ),
    width: 200,
  },
  {
    title: "Validity",
    dataIndex: "expiry",
    key: "expiry",
    render: (date, record) => (
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <ClockCircleOutlined className="text-gray-500" />
          <span className="text-gray-700">{date}</span>
        </div>
        {record.start && (
          <span className="text-xs text-gray-500">From: {record.start}</span>
        )}
      </div>
    ),
    width: 150,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      let icon, color, text;
      switch (status) {
        case "Active":
          icon = <CheckCircleOutlined />;
          color = "#52c41a";
          text = "Active";
          break;
        case "Expired":
          icon = <CloseCircleOutlined />;
          color = "#f5222d";
          text = "Expired";
          break;
        case "Inactive":
          icon = <ClockCircleOutlined />;
          color = "#faad14";
          text = "Inactive";
          break;
        default:
          color = "#d9d9d9";
      }
      return <Badge color={color} />;
    },
    align: "center",
    width: 50,
    filters: [
      { text: "Active", value: "Active" },
      { text: "Expired", value: "Expired" },
      { text: "Inactive", value: "Inactive" },
    ],
    onFilter: (value, record) => record.status === value,
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: (_, record) => (
      <Dropdown
        menu={{
          items: [
            {
              key: "edit",
              label: "Edit",
              onClick: () => handleEdit(record),
            },
            {
              key: "delete",
              label: "Delete",
            },
          ],
        }}
        trigger={["click"]}
      >
        <Button
          icon={<EllipsisOutlined />}
          shape="default"
          style={{ padding: "0" }}
        />
      </Dropdown>
    ),
    width: 100,
  },
];

const initData = [
  {
    key: "1",
    code: "DISCOUNT10",
    discount: "10%",
    minOrderValue: 50,
    usageLimit: 1000,
    start: "01/01/2025",
    expiry: "30/06/2025",
    status: "Active",
    description: "10% off on orders above $50",
    condition: "Applies to all products",
  },
  {
    key: "2",
    code: "FREETICKET",
    discount: "Free Ticket",
    minOrderValue: 30,
    usageLimit: 500,
    start: "01/01/2025",
    expiry: "15/05/2025",
    status: "Expired",
    description: "Free ticket for VIP members",
    condition: "VIP members only",
  },
  {
    key: "3",
    code: "WELCOME20",
    discount: "20%",
    minOrderValue: 0,
    usageLimit: null,
    start: "01/01/2025",
    expiry: "31/12/2025",
    status: "Active",
    description: "New member exclusive",
    condition: "For new customers only",
  },
  {
    key: "4",
    code: "MOVIEDEAL",
    discount: "15%",
    minOrderValue: 20,
    usageLimit: 200,
    start: "01/01/2025",
    expiry: "10/08/2025",
    status: "Active",
    description: "Movie ticket discount",
    condition: "Max 2 tickets per order",
  },
  {
    key: "5",
    code: "SUMMER25",
    discount: "25%",
    minOrderValue: 100,
    usageLimit: 300,
    start: "01/01/2025",
    expiry: "20/07/2025",
    status: "Inactive",
    description: "Summer special",
    condition: "Selected items only",
  },
  {
    key: "6",
    code: "CGVVIP",
    discount: "30%",
    minOrderValue: 75,
    usageLimit: 100,
    start: "01/01/2025",
    expiry: "30/09/2025",
    status: "Active",
    description: "VIP exclusive",
    condition: "CGV VIP members only",
  },
  {
    key: "7",
    code: "EARLYBIRD",
    discount: "12%",
    minOrderValue: 40,
    usageLimit: 150,
    start: "01/01/2025",
    expiry: "15/04/2025",
    status: "Expired",
    description: "Early bird special",
    condition: "Valid before 10AM",
  },
  {
    key: "8",
    code: "POPCORN",
    discount: "Free Popcorn",
    minOrderValue: 25,
    usageLimit: null,
    start: "01/01/2025",
    expiry: "31/10/2025",
    status: "Active",
    description: "Free medium popcorn",
    condition: "With any ticket purchase",
  },
  {
    key: "9",
    code: "FAMILY10",
    discount: "10%",
    minOrderValue: 80,
    usageLimit: 50,
    start: "01/01/2025",
    expiry: "30/05/2025",
    status: "Inactive",
    description: "Family package",
    condition: "Minimum 4 tickets",
  },
  {
    key: "10",
    code: "WEEKEND15",
    discount: "15%",
    minOrderValue: 0,
    usageLimit: 400,
    start: "01/01/2025",
    expiry: "30/11/2025",
    status: "Active",
    description: "Weekend special",
    condition: "Valid Sat-Sun only",
  },
];

const Coupon = () => {
  const [form] = Form.useForm();
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [filterParams, setFilterParams] = useState({
    status: null,
    discountType: null,
    searchText: "",
    dateRange: null,
  });

  const filteredData = initData.filter((item) => {
    // Lọc theo trạng thái
    if (filterParams.status && item.status !== filterParams.status)
      return false;

    // Lọc theo loại giảm giá
    if (filterParams.discountType) {
      if (
        filterParams.discountType === "percentage" &&
        !item.discount.includes("%")
      )
        return false;
      if (filterParams.discountType === "fixed" && item.discount.includes("%"))
        return false;
    }

    // Lọc theo từ khóa tìm kiếm
    if (filterParams.searchText) {
      const searchLower = filterParams.searchText.toLowerCase();
      if (
        !item.code.toLowerCase().includes(searchLower) &&
        !item.description.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }

    // Lọc theo khoảng ngày
    if (filterParams.dateRange) {
      const [start, end] = filterParams.dateRange;
      const expiryDate = dayjs(item.expiry, "DD/MM/YYYY");
      if (start && expiryDate.isBefore(start, "day")) return false;
      if (end && expiryDate.isAfter(end, "day")) return false;
    }

    return true;
  });

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Expired", label: "Expired" },
  ];

  const discountTypeOptions = [
    { value: "percentage", label: "Percentage Discount" },
    { value: "fixed", label: "Fixed Value" },
  ];

  const handleEdit = (record) => {
    setEditingCoupon(record);
    form.setFieldsValue({ record });
    setIsModalEditOpen(true);
  };

  const handleEditSubmit = (values) => {
    console.log("Edited values:", values);
    setIsModalEditOpen(false);
  };

  const handleAddSubmit = (values) => {
    console.log("Added values:", values);
    setIsModalAddOpen(false);
  };

  const handleCancel = () => {
    setIsModalEditOpen(false);
    setIsModalAddOpen(false);
  };

  return (
    <>
      <Card
        title={<span className="text-xl font-bold">Mangement Cinema</span>}
        extra={
          <Space>
            {/* Dropdown lọc nâng cao */}
            <Dropdown
              dropdownRender={() => (
                <Card
                  title="Filter Coupons"
                  style={{ width: 300 }}
                  extra={
                    <Button
                      type="link"
                      size="small"
                      onClick={() =>
                        setFilterParams({
                          status: null,
                          discountType: null,
                          searchText: "",
                          dateRange: null,
                        })
                      }
                    >
                      Reset
                    </Button>
                  }
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div>
                      <div className="text-sm font-medium mb-1">Status</div>
                      <Select
                        placeholder="Select status"
                        options={statusOptions}
                        style={{ width: "100%" }}
                        value={filterParams.status}
                        onChange={(value) =>
                          setFilterParams({ ...filterParams, status: value })
                        }
                        allowClear
                      />
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-1">
                        Discount Type
                      </div>
                      <Select
                        placeholder="Select discount type"
                        options={discountTypeOptions}
                        style={{ width: "100%" }}
                        value={filterParams.discountType}
                        onChange={(value) =>
                          setFilterParams({
                            ...filterParams,
                            discountType: value,
                          })
                        }
                        allowClear
                      />
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-1">
                        Expiry Date
                      </div>
                      <RangePicker
                        style={{ width: "100%" }}
                        format="DD/MM/YYYY"
                        value={filterParams.dateRange}
                        onChange={(value) =>
                          setFilterParams({ ...filterParams, dateRange: value })
                        }
                      />
                    </div>
                  </Space>
                </Card>
              )}
              trigger={["click"]}
            >
              <Button icon={<FilterOutlined />}>
                <Space>
                  Filters
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>

            {/* Thanh tìm kiếm */}
            <Search
              placeholder="Search coupons..."
              allowClear
              enterButton={<SearchOutlined />}
              style={{ width: 250 }}
              value={filterParams.searchText}
              onChange={(e) =>
                setFilterParams({ ...filterParams, searchText: e.target.value })
              }
              onSearch={(value) =>
                setFilterParams({ ...filterParams, searchText: value })
              }
            />

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalAddOpen(true)}
            >
              Add Coupon
            </Button>
          </Space>
        }
        variant="borderless"
        styles={{ header: { borderBottom: "none" } }}
        style={{ boxShadow: "none" }}
      >
        <CouponStatistics data={filteredData} />
        <Table
          columns={columns(handleEdit)}
          dataSource={initData}
          pagination={{ pageSize: 4 }}
          rowClassName={(record) =>
            record.status === "Expired"
              ? "bg-red-50"
              : record.status === "Inactive"
                ? "bg-yellow-50"
                : ""
          }
        />
        <Divider />
        <div className="flex justify-between text-sm text-gray-500">
          <span>Total: {initData.length} coupons</span>
          <span className="flex gap-4">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              Active
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              Inactive
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              Expired
            </span>
          </span>
        </div>
      </Card>

      <ModalCouponAdd
        visible={isModalAddOpen}
        onCancel={handleCancel}
        onSuccess={handleAddSubmit}
      />
      <ModalCouponEdit
        visible={isModalEditOpen}
        initialValues={editingCoupon}
        onCancel={handleCancel}
        onSuccess={handleEditSubmit}
      />
    </>
  );
};

export default Coupon;
