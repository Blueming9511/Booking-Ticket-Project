import React, { useState } from 'react';
import {
  Avatar,
  Card,
  Row,
  Col,
  Divider,
  Tabs,
  Button,
  Form,
  Input,
  Upload,
  message,
  Modal,
  Table,
  Tag,
  Radio
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  UploadOutlined,
  LockOutlined,
  SaveOutlined
} from '@ant-design/icons';

const { Password } = Input;

// Mock user data
const userData = {
  name: 'John Doe',
  email: 'john.doeexample.com',
  phone: '0928988254',
  DOB: '2004-02-05',
  gender: 'male',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
};

const UserProfile = () => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('profile');
  const [changePwdOpen, setChangePwdOpen] = useState(false);
  const [pwdForm] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  const uploadProps = {
    name: 'avatar',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text'
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    }
  };

  const onFinish = values => {
    console.log('Received values:', values);
    message.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const onPwdChangeFinish = values => {
    console.log('Password change values:', values);
    setChangePwdOpen(false);
    message.success('Password changed successfully!');
    pwdForm.resetFields();
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    form.submit();
  };

  // Add this to your existing mock data
const ticketData = [
  {
    key: '1',
    movie: 'Avengers: Endgame',
    date: '2023-05-15',
    time: '19:30',
    seats: ['A1', 'A2'],
    price: '$24.00',
    status: 'Upcoming'
  },
  {
    key: '2',
    movie: 'Spider-Man: No Way Home',
    date: '2023-06-20',
    time: '15:45',
    seats: ['B3'],
    price: '$12.00',
    status: 'Completed'
  },
  {
    key: '3',
    movie: 'The Batman',
    date: '2023-07-10',
    time: '21:00',
    seats: ['C4', 'C5'],
    price: '$20.00',
    status: 'Upcoming'
  }
];

// Add this to your component
const handleCancelTicket = (ticketId) => {
  message.success(`Ticket ${ticketId} cancelled successfully!`);
  // In a real app, you would call an API here to cancel the ticket
};

const ticketColumns = [
  {
    title: 'Movie',
    dataIndex: 'movie',
    key: 'movie',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: 'Seats',
    dataIndex: 'seats',
    key: 'seats',
    render: (seats) => (
      <>
        {seats.map(seat => (
          <Tag color="blue" key={seat}>{seat}</Tag>
        ))}
      </>
    ),
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      let color = status === 'Completed' ? 'green' : 'orange';
      return (
        <Tag color={color} key={status}>
          {status.toUpperCase()}
        </Tag>
      );
    },
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      record.status === 'Upcoming' ? (
        <Button 
          type="link" 
          danger 
          onClick={() => handleCancelTicket(record.key)}
        >
          Cancel
        </Button>
      ) : null
    ),
  },
];

  const items = [
    {
      key: 'profile',
      label: (
        <span>
          <UserOutlined />
          Profile
        </span>
      ),
      children: (
        <Form
          form={form}
          layout="vertical"
          initialValues={userData}
          onFinish={onFinish}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input prefix={<UserOutlined />} disabled={!isEditing} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="email" label="Email">
                <Input prefix={<MailOutlined />} disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  { required: true, message: 'Please enter your phone number' },
                  { pattern: /^[0-9]+$/, message: 'Please enter valid phone number' }
                ]}
              >
                <Input prefix={<PhoneOutlined />} disabled={!isEditing} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="DOB"
                label="Date of Birth"
                rules={[{ required: true, message: 'Please enter your date of birth' }]}
              >
                <Input type="date" disabled={!isEditing} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: 'Please select your gender' }]}
              >
                <Radio.Group disabled={!isEditing}>
                  <Radio value="male">Male</Radio>
                  <Radio value="female">Female</Radio>
                  <Radio value="other">Other</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Password">
                <div className="flex items-center">
                  <Password
                    placeholder="••••••••"
                    disabled
                    className="w-full mr-2"
                    autoComplete="current-password"
                  />
                  <Button
                    type="primary"
                    icon={<LockOutlined />}
                    onClick={() => setChangePwdOpen(true)}
                    disabled={!isEditing}
                  >
                    Change
                  </Button>
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            {!isEditing ? (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleEditClick}
                style={{ width: '100%' }}
              >
                Update Profile
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSaveClick}
                style={{ width: '100%' }}
              >
                Save Changes
              </Button>
            )}
          </Form.Item>
        </Form>
      )
    },
    {
      key: 'tickets',
      label: (
        <span>
          My Tickets
        </span>
      ),
      children: (
        <Table 
          columns={ticketColumns} 
          dataSource={ticketData} 
          pagination={{ pageSize: 5 }}
        />
      )
    }
  ];

  return (
    <div className="my-20 mx-10">
      <h1 className="font-bold text-[24px] mb-6">User Profile</h1>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card className="text-center">
            <div className="mb-4 flex flex-col gap-2 justify-center items-center">
              <Avatar
                size={128}
                src={userData.avatar}
                icon={<UserOutlined />}
                className="mb-3"
              />
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Change Avatar</Button>
              </Upload>
            </div>
            <h2 className="text-xl font-semibold">{userData.name}</h2>
            <Divider />
            <div className="text-left space-y-3">
              <div className="flex items-center">
                <MailOutlined className="mr-2 text-gray-500" />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center">
                <CalendarOutlined className="mr-2 text-gray-500" />
                <span>{userData.DOB}</span>
              </div>
              <div className="flex items-center">
                <PhoneOutlined className="mr-2 text-gray-500" />
                <span>{userData.phone}</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={items}
            />
          </Card>
        </Col>
      </Row>

      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        open={changePwdOpen}
        onCancel={() => setChangePwdOpen(false)}
        footer={null}
      >
        <Form form={pwdForm} layout="vertical" onFinish={onPwdChangeFinish}>
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[{ required: true, message: 'Please enter your current password' }]}
          >
            <Password 
              prefix={<LockOutlined />} 
              autoComplete="current-password" 
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[{ required: true, message: 'Please enter your new password' }]}
          >
            <Password 
              prefix={<LockOutlined />} 
              autoComplete="new-password" 
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfile;
// import { useEffect, useState } from 'react'

// function UserProfile() {
//   const [user, setUser] = useState(null)
//   const [error, setError] = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await fetch('http://localhost:8080/api/user', {
//           credentials: 'include', // Send cookies if needed
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         })

//         if (!response.ok) {
//           if (response.status === 401) {
//             throw new Error('Unauthorized: Please log in.')
//           }
//           throw new Error(`Error ${response.status}: ${response.statusText}`)
//         }

//         const data = await response.json()
//         setUser(data)
//       } catch (err) {
//         setError(err.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchUser()
//   }, [])

//   if (loading) {
//     return <div>Loading...</div>
//   }

//   if (error) {
//     return <div className="text-red-500">Error: {error}</div>
//   }

//   return (
//     <div className="container flex flex-col mx-auto p-4">
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <div className="mt-4">
//         <p>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//           <strong>Name:</strong> {user?.name || 'N/A'}
//         </p>
//         <p>
//           <strong>Email:</strong> {user?.email || 'N/A'}
//         </p>
//         <p>
//           <strong>Provider:</strong> {user?.provider || 'N/A'}
//         </p>
//         {user?.picture && (
//           <img
//             src={user.picture}
//             alt="Profile"
//             className="w-24 h-24 rounded-full mt-2"
//           />
//         )}
//       </div>
//     </div>
//   )
// }

// export default UserProfile
