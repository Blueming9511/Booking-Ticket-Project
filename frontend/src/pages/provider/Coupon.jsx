import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Space,
  Button,
  Table,
  Select,
  DatePicker,
  Input,
  message,
  Divider,
} from "antd";
import {
  PlusOutlined,
  FilterOutlined,
  SearchOutlined,
  DownOutlined,
} from "@ant-design/icons";
import ModalCouponAdd from "../../components/ProviderManagement/Coupon/ModalCouponAdd";
import ModalCouponEdit from "../../components/ProviderManagement/Coupon/ModalCouponEdit";
import CouponStatistics from "../../components/ProviderManagement/Coupon/CouponStatistics";
import axios from "axios";
import dayjs from "dayjs";
import ModalDelete from "../../components/ui/Modal/ModalDelete";
import CouponTable from "../../components/ProviderManagement/Coupon/CouponTable";

const { RangePicker } = DatePicker;
const { Search } = Input;

const Coupon = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [state, setState] = useState({
    coupons: [],
    filteredCoupons: [],
    filters: {
      status: null,
      discountType: null,
      dateRange: null,
      searchText: "",
      statusOptions: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
        { value: "Expired", label: "Expired" },
      ],
      discountTypeOptions: [
        { value: "percentage", label: "Percentage Discount" },
        { value: "fixed", label: "Fixed Value" },
      ],
    },
    modals: {
      add: false,
      edit: false,
    },
    selectedCoupon: null,
    loading: false,
  });

  const fetchData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      messageApi.loading("Fetching data...");

      const couponsRes = await axios.get("http://localhost:8080/api/coupons", {
        withCredentials: true,
      });

      setState((prev) => ({
        ...prev,
        coupons: couponsRes.data,
        filteredCoupons: couponsRes.data,
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
    const { status, discountType, dateRange, searchText } = state.filters;
    let result = [...state.coupons];

    if (status) result = result.filter((item) => item.status === status);
    if (discountType) {
      if (discountType === "percentage" && !item.discount.includes("%"))
        return false;
      if (discountType === "fixed" && item.discount.includes("%")) return false;
    }
    if (searchText)
      result = result.filter(
        (item) =>
          item.code.toLowerCase().includes(searchText.toLowerCase()) ||
          item.description.toLowerCase().includes(searchText.toLowerCase())
      );
    if (dateRange) {
      const [start, end] = dateRange;
      result = result.filter((item) => {
        const expiryDate = dayjs(item.expiry, "DD/MM/YYYY");
        return (
          (!start || !expiryDate.isBefore(start, "day")) &&
          (!end || !expiryDate.isAfter(end, "day"))
        );
      });
    }

    setState((prev) => ({ ...prev, filteredCoupons: result }));
  }, [state.filters, state.coupons]);

  const handleFilterChange = (field, value) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, [field]: value },
    }));
  };

  const toggleModal = (modalName, isOpen, coupon = null) => {
    setState((prev) => ({
      ...prev,
      modals: { ...prev.modals, [modalName]: isOpen },
      selectedCoupon: isOpen ? coupon : null,
    }));
  };

  const handleSubmit = async (action, values = null) => {
    const config = {
      add: {
        method: "post",
        url: "http://localhost:8080/api/coupons",
        data: values,
      },
      edit: {
        method: "put",
        url: `http://localhost:8080/api/coupons/${state.selectedCoupon?.id}`,
        data: values,
      },
      delete: {
        method: "delete",
        url: `http://localhost:8080/api/coupons/${state.selectedCoupon?.id}`,
      },
    };

    try {
      setState((prev) => ({ ...prev, loading: true }));
      await axios({ ...config[action], withCredentials: true });
      messageApi.success(
        `Coupon ${action === "add" ? "added" : "updated"} successfully`,
        2
      );
      await fetchData();
      toggleModal(action, false);
    } catch (error) {
      messageApi.error(`Failed to ${action} coupon`, 2);
      console.error(`${action} error:`, error);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const { filteredCoupons, filters, modals, selectedCoupon, loading } = state;

  return (
    <>
      {contextHolder}
      <Card
        title={<span className="text-xl font-bold">Coupon Management</span>}
        extra={
          <Space>
            <Select
              placeholder="Status"
              value={filters.status}
              onChange={(v) => handleFilterChange("status", v)}
              options={filters.statusOptions}
              style={{ width: 150 }}
              allowClear
            />
            <Select
              placeholder="Discount Type"
              value={filters.discountType}
              onChange={(v) => handleFilterChange("discountType", v)}
              options={filters.discountTypeOptions}
              style={{ width: 150 }}
              allowClear
            />
            <RangePicker
              style={{ width: 250 }}
              format="DD/MM/YYYY"
              value={filters.dateRange}
              onChange={(v) => handleFilterChange("dateRange", v)}
            />
            <Search
              placeholder="Search coupons..."
              allowClear
              enterButton={<SearchOutlined />}
              style={{ width: 250 }}
              value={filters.searchText}
              onChange={(e) => handleFilterChange("searchText", e.target.value)}
              onSearch={(value) => handleFilterChange("searchText", value)}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => toggleModal("add", true)}
            >
              Add Coupon
            </Button>
          </Space>
        }
      >
        <CouponStatistics data={filteredCoupons} />
        <CouponTable
          data={filteredCoupons}
          onEdit={(coupon) => toggleModal("edit", true, coupon)}
          onDelete={(coupon) => toggleModal("delete", true, coupon)}
          loading={loading}
        />
        <Divider />
      </Card>

      <ModalCouponAdd
        visible={modals.add}
        onCancel={() => toggleModal("add", false)}
        onSuccess={(values) => handleSubmit("add", values)}
      />

      <ModalCouponEdit
        visible={modals.edit}
        initialValues={selectedCoupon}
        onCancel={() => toggleModal("edit", false)}
        onSuccess={(values) => handleSubmit("edit", values)}
      />

      <ModalDelete
        visible={modals.delete}
        onCancel={() => toggleModal("delete", false)}
        onSuccess={() => handleSubmit("delete")}
        initialValues={selectedCoupon}
        loading={loading}
        title="Delete Coupon"
        extra={
          <p className="mt-2">
            Are you sure you want to delete coupon{" "}
            <strong>{selectedCoupon?.code}</strong>?
          </p>
        }
      />
    </>
  );
};

export default Coupon;
