import React, {useEffect, useState} from 'react';
import {
    Form, Input, InputNumber, Select, Button, Row, Col,
} from 'antd';
import TheaterLayout from "../Layout/TheaterLayout.jsx";
import TheaterLayoutView from "../Layout/TheaterLayoutView.jsx";

const {Option} = Select;

const ModalScreenForm = ({form, onFinish, initialValues = {}, cinemas = []}) => {
    initialValues.id && form.setFieldsValue({...initialValues})
    console.log(initialValues.col)
    const typeOptions = [{value: 'STANDARD', label: 'Standard'}, {
        value: 'IMAX', label: 'IMAX'
    }, {value: 'FOUR_DX', label: 'FOUR_DX'}, {value: 'Deluxe', label: 'Deluxe'}, {
        value: 'PREMIUM', label: 'Premium'
    }, {value: 'THREE_D', label: '3D'},];

    const statusOptions = [{value: 'Active', label: 'Active'}, {
        value: 'Inactive', label: 'Inactive'
    }, {value: 'Renovating', label: 'Renovating'}, {value: 'Closed', label: 'Closed'},];


    const cinemaOptions = Object.entries(cinemas).map(([value, label]) => ({
        value, label
    }));

    const [row, setRow] = useState(initialValues.row || 5)
    const [col, setCol] = useState(initialValues.col || 5)
    const [capacity, setCapacity] = useState(25);
    useEffect(() => {
        setCapacity(row * col);
    }, [row, col]);
    const [edit, setEdit] = useState(false);

    const [seatMap, setSeatMap] = useState([]);
    const handleSeatChange = (updatedSeats) => {
        const flatSeats = updatedSeats.flatMap(row => row.map(({id, type, row}) => ({id, type, row})));
        setSeatMap(flatSeats);
    }


    return (<Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
            onFinish({
                ...values, capacity, seats: seatMap
            })
        }}
        initialValues={{
            row: 5,
            col: 5,
            ...initialValues
        }}
    >
        <Row gutter={[16, 16]}>
            <Col span={12}>
                <Form.Item
                    name="cinemaCode"
                    label="Cinema"
                    rules={[{required: true, message: 'Please select cinema!'}]}
                >
                    <Select placeholder="Select cinema">
                        {cinemaOptions.map((option) => (<Option key={option.value} value={option.value}>
                            {option.label}
                        </Option>))}
                    </Select>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    name="type"
                    label="Screen Type"
                    rules={[{required: true, message: 'Please select screen type!'}]}
                >
                    <Select placeholder="Select screen type">
                        {typeOptions.map((option) => (<Option key={option.value} value={option.value}>
                            {option.label}
                        </Option>))}
                    </Select>
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={[16, 16]}>
            <Col span={6}>
                <Form.Item
                    name={"row"}
                    label={"Row"}
                    rules={[{required: true, message: "Please enter this!"}]}
                >
                    <InputNumber min={1} max={20} style={{width: "100%"}} onChange={(e) => setRow(e)}/>
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name={"col"}
                    label={"Col"}
                    rules={[{required: true, message: "Please enter this!"}]}
                >
                    <InputNumber min={1} max={15} style={{width: "100%"}} onChange={(e) => setCol(e)}/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    name={"capacity"}
                    label={"Capacity"}
                >
                    <InputNumber min={1} max={1000} style={{width: "100%"}} placeholder={capacity} value={capacity}
                                 disabled={true}/>
                </Form.Item>
            </Col>
        </Row>
        {initialValues.id && (<div className={"justify-end flex"}>
            <Button type="primary" onClick={() => setEdit(!edit)}>Edit</Button>
        </div>)}
        {
            edit
                ? <TheaterLayout rows={row} seatsPerRow={col} onSeatChange={handleSeatChange}/>
                : initialValues.id
                    ? <TheaterLayoutView screen={initialValues}/>
                    : <TheaterLayout rows={row} seatsPerRow={col} onSeatChange={handleSeatChange}/>
        }
    </Form>)
        ;
};

export default ModalScreenForm;