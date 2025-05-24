import React, { useEffect } from 'react';
import {
    Modal,
    Form,
    Input,
    InputNumber,
    DatePicker,
    Select,
    Switch,
    Divider,
    Tag,
    Alert,
    Col,
    Row
} from 'antd';
import {
    FireOutlined,
    GiftOutlined,
    DollarOutlined,
    TeamOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const CouponModal = ({
    visible,
    onCancel,
    onFinish,
    initialValues,
    loading,
    title
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialValues) {
            // Format dates for RangePicker
            const values = {
                ...initialValues,
                dateRange: [
                    dayjs(initialValues.startDate),
                    dayjs(initialValues.expiryDate)
                ]
            };
            form.setFieldsValue(values);
        } else {
            form.resetFields();
            // Set default values for new coupon
            form.setFieldsValue({
                dateRange: [dayjs(), dayjs().add(1, 'month')],
                discountValue: 0,
                type: 'PERCENTAGE',
                isActive: false,
                minOrderValue: 0,
                usageLimit: 100
            });
        }
    }, [initialValues, form]);

    const handleSubmit = () => {
        form.validateFields()
            .then(values => {
                // Transform date range to startDate and expiryDate
                const transformedValues = {
                    ...values,
                    startDate: values.dateRange[0].format('YYYY-MM-DD'),
                    expiryDate: values.dateRange[1].format('YYYY-MM-DD'),
                };
                delete transformedValues.dateRange;
                onFinish(transformedValues);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    const discountType = Form.useWatch('type', form);

    return (
        <Modal
            title={`${initialValues ? "Edit" : "Add"} coupon`}
            open={visible}
            onOk={handleSubmit}
            onCancel={onCancel}
            confirmLoading={loading}
            width={700}
            okText="Submit"
            cancelText="Cancel"
            style={{ top: 30 }}
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Row gutter={[16, 16]}>
                    {/* Left Column */}
                    <Col lg={12} md={24}>
                        <Form.Item
                            name="couponCode"
                            label="Coupon Code"
                            rules={[
                                { required: true, message: 'Please input coupon code!' },
                                { pattern: /^[A-Z0-9]+$/, message: 'Only uppercase letters and numbers allowed' }
                            ]}
                        >
                            <Input
                                placeholder="e.g. SUMMER20"
                                className="font-mono font-bold"
                            />
                        </Form.Item>
                    </Col>
                    <Col lg={12} md={24}>
                        <Form.Item
                            name="type"
                            label="Discount Type"
                            initialValue="percentage"
                        >
                            <Select
                                options={[
                                    {
                                        value: 'PERCENTAGE', label: <span>< FireOutlined /> Percentage</span>
                                    },
                                    { value: 'FIXED', label: <span>< DollarOutlined /> Amount</span> },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col lg={12} md={24}>
                        <Form.Item
                            name="discountValue"
                            label={discountType === 'PERCENTAGE' ? 'Discount Percentage' : 'Discount Amount'}
                            rules={[
                                { required: true, message: 'Please input discount value!' },
                                {
                                    validator: (_, value) => {
                                        if (discountType === 'PERCENTAGE' && value > 100) {
                                            return Promise.reject('Percentage cannot exceed 100%');
                                        }
                                        return Promise.resolve();
                                    }
                                }
                            ]}
                        >
                            <InputNumber
                                min={1}
                                max={discountType === 'PERCENTAGE' ? 100 : undefined}
                                addonAfter={discountType === 'PERCENTAGE' ? '%' : '$'}
                                className="w-full"
                            />
                        </Form.Item>
                    </Col>
                    <Col lg={12} md={24}>
                        <Form.Item
                            name="dateRange"
                            label="Validity Period"
                            rules={[{ required: true, message: 'Please select date range!' }]}
                        >
                            <RangePicker
                                className="w-full"
                                disabledDate={(current) => current && current < dayjs().startOf('day')}
                                format="DD/MM/YYYY"
                            />
                        </Form.Item>
                    </Col>
                    <Col lg={12} md={24}>
                        <Form.Item
                            name="minOrderValue"
                            label="Minimum Order Value"
                            tooltip="Leave empty for no minimum order requirement"
                        >
                            <InputNumber
                                min={0}
                                addonBefore="$"
                                className="w-full"
                            />
                        </Form.Item>
                    </Col>
                    <Col lg={12} md={24}>
                        <Form.Item
                            name="usageLimit"
                            label="Usage Limit"
                            tooltip="Leave empty for unlimited usage"
                        >
                            <InputNumber
                                min={1}
                                addonAfter={<><TeamOutlined /> uses</>}
                                className="w-full"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ max: 200, message: 'Description cannot exceed 200 characters!' }]}
                >
                    <TextArea
                        rows={3}
                        placeholder="Describe the coupon for customers..."
                        showCount={{ max: 200 }}
                    />
                </Form.Item>

                <Form.Item
                    name="isActive"
                    label="Status"
                    valuePropName="checked"
                    initialValue={true}
                >
                    <Switch
                        checkedChildren="Active"
                        unCheckedChildren="Inactive"
                    />
                </Form.Item>

                {initialValues && (
                    <Alert
                        message="Coupon Usage Statistics"
                        description={
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                    <span className="text-gray-600">Times Used:</span>
                                    <Tag color="blue" className="ml-2">
                                        {initialValues.usage || 0}
                                    </Tag>
                                </div>
                                <div>
                                    <span className="text-gray-600">Remaining:</span>
                                    <Tag color="green" className="ml-2">
                                        {initialValues.usageLimit ?
                                            initialValues.usageLimit - (initialValues.usage || 0) : '∞'}
                                    </Tag>
                                </div>
                            </div>
                        }
                        type="info"
                        showIcon
                        className="mb-4"
                    />
                )}

            </Form>
        </Modal >
    );
};

export default CouponModal;