import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Card,
  Button,
  Space,
  Select,
  DatePicker,
  Input,
  message,
  Divider,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import ModalPaymentAdd from "../../components/ProviderManagement/Payment/ModalPaymentAdd";
import ModalPaymentEdit from "../../components/ProviderManagement/Payment/ModalPaymentEdit";
import PaymentStatistics from "../../components/ProviderManagement/Payment/PaymentStatistics";
import axios from "axios";
import dayjs from "dayjs";
import PaymentTable from "../../components/ProviderManagement/Payment/PaymentTable";
import ModalDelete from "../../components/ui/Modal/ModalDelete";

const { RangePicker } = DatePicker;
const { Search } = Input;

const Payment = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [state, setState] = useState({
    payments: [],
    filteredPayments: [],
    filters: {
      status: null,
      method: null,
      dateRange: null,
      searchText: "",
      statusOptions: [
        { value: "Completed", label: "Completed" },
        { value: "Pending", label: "Pending" },
        { value: "Failed", label: "Failed" },
      ],
      methodOptions: [
        { value: "Credit Card", label: "Credit Card" },
        { value: "E-Wallet", label: "E-Wallet" },
        { value: "Bank Transfer", label: "Bank Transfer" },
      ],
    },
    modals: {
      add: false,
      edit: false,
    },
    selectedPayment: null,
    loading: false,
  });

  const fetchData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      messageApi.loading("Fetching data...");

      const paymentsRes = await axios.get(
        "http://localhost:8080/api/payments",
        {
          withCredentials: true,
        }
      );

      setState((prev) => ({
        ...prev,
        payments: paymentsRes.data,
        filteredPayments: paymentsRes.data,
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
    const { status, method, dateRange, searchText } = state.filters;
    let result = [...state.payments];

    if (status) result = result.filter((item) => item.status === status);
    if (method) result = result.filter((item) => item.method === method);
    if (searchText)
      result = result.filter((item) =>
        item.id.toLowerCase().includes(searchText.toLowerCase())
      );
    if (dateRange) {
      const [start, end] = dateRange;
      result = result.filter((item) => {
        const paymentDate = dayjs(item.transactionDate);
        return (
          (!start || !paymentDate.isBefore(start, "day")) &&
          (!end || !paymentDate.isAfter(end, "day"))
        );
      });
    }

    setState((prev) => ({ ...prev, filteredPayments: result }));
  }, [state.filters, state.payments]);

  const handleFilterChange = (field, value) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, [field]: value },
    }));
  };

  const toggleModal = (modalName, isOpen, payment = null) => {
    setState((prev) => ({
      ...prev,
      modals: { ...prev.modals, [modalName]: isOpen },
      selectedPayment: isOpen ? payment : null,
    }));
  };

  const handleSubmit = async (action, values = null) => {
    const config = {
      add: {
        method: "post",
        url: "http://localhost:8080/api/payments",
        data: values,
      },
      edit: {
        method: "put",
        url: `http://localhost:8080/api/payments/${state.selectedPayment?.id}`,
        data: values,
      },
      delete: {
        method: "delete",
        url: `http://localhost:8080/api/payments/${state.selectedPayment?.id}`,
      }
    };

    try {
      setState((prev) => ({ ...prev, loading: true }));
      await axios({ ...config[action], withCredentials: true });
      messageApi.success(
        `Payment ${action === "add" ? "added" : "updated"} successfully`,
        2
      );
      await fetchData();
      toggleModal(action, false);
    } catch (error) {
      messageApi.error(`Failed to ${action} payment`, 2);
      console.error(`${action} error:`, error);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const { filteredPayments, filters, modals, selectedPayment, loading } = state;

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Transaction Date",
      dataIndex: "transactionDate",
      key: "transactionDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => toggleModal("edit", true, record)}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Card
        title={<span className="text-xl font-bold">Payment Management</span>}
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
              placeholder="Method"
              value={filters.method}
              onChange={(v) => handleFilterChange("method", v)}
              options={filters.methodOptions}
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
              placeholder="Search payments..."
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
              Add Payment
            </Button>
          </Space>
        }
      >
        <PaymentStatistics data={filteredPayments} />
        <PaymentTable
          data={filteredPayments}
          onEdit={(payment) => toggleModal('edit', true, payment)}
          onDelete={(payment) => toggleModal('delete', true, payment)}
          loading={loading}
        />
      </Card>

      <ModalPaymentAdd
        visible={modals.add}
        onCancel={() => toggleModal("add", false)}
        onSuccess={(values) => handleSubmit("add", values)}
      />

      <ModalPaymentEdit
        visible={modals.edit}
        initialValues={selectedPayment}
        onCancel={() => toggleModal("edit", false)}
        onSuccess={(values) => handleSubmit("edit", values)}
      />

      <ModalDelete 
        visible={modals.delete}
        onCancel={() => toggleModal("delete", false)}
        onSuccess={() => handleSubmit("delete")}
        title="Delete Payment"
        extra={<p className="mt-2">Are you sure you want to delete payment <strong>{selectedPayment?.id}</strong>?</p>}
      />
    </>
  );
};

export default Payment;
