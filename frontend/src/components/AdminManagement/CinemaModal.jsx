import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Select, Row, Col, Modal } from "antd";

const { Option } = Select;


const statusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "APPROVED", label: "Confirmed" },
    { value: "OPEN", label: "Open" },
    { value: "MAINTAINED", label: "Maintenance" },
    { value: "CLOSED", label: "Closed" },
];

const CinemaModal = ({
    visible,
    onCancel,
    onFinish,
    initialValues,
    loading
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues
            });
        }
    }, [initialValues, form]);


    const handleSubmit = () => {
        form.validateFields()
            .then(values => {
                onFinish(values);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title={initialValues ? "Edit Cinema" : "Add New Cinema"}
            onCancel={onCancel}
            onOk={handleSubmit}
            confirmLoading={loading}
            open={visible}
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="cinemaName"
                            label="Cinema Name"
                            rules={[
                                { required: true, message: "Please input cinema name!" },
                                { max: 100, message: "Name cannot exceed 100 characters" },
                            ]}
                        >
                            <Input placeholder="e.g. CGV Vincom Mega Mall" />
                        </Form.Item>

                        <Form.Item
                            name="location"
                            label="Location"
                            rules={[
                                { required: true, message: "Please input location!" },
                                { max: 200, message: "Location cannot exceed 200 characters" },
                            ]}
                        >
                            <Input.TextArea rows={5} placeholder="e.g. Q. Bình Thạnh, TP.HCM" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="numberOfScreens"
                            label="Number of Screens"
                            rules={[
                                { required: true, message: "Please input number of screens!" },
                                {
                                    type: "number",
                                    min: 1,
                                    max: 50,
                                    message: "Must be between 1-50",
                                },
                            ]}
                        >
                            <InputNumber
                                min={1}
                                max={50}
                                style={{ width: "100%" }}
                                placeholder="e.g. 8"
                            />
                        </Form.Item>

                        <Col span={24}>
                            <Form.Item name="owner" label="Owner">
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="status"
                                label="Status"
                                rules={[{ required: true }]}
                            >
                                <Select>
                                    {statusOptions.map((option) => (
                                        <Option key={option.value} value={option.value}>
                                            {option.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default CinemaModal;
