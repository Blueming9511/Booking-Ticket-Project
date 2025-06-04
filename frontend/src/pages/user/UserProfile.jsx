// UserProfile.js
import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Divider,
  Tabs,
  message,
  Form,
} from 'antd';
import {
  UserOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

import ProfileAvatar from '../../components/common/ProfileAvatar';
import UserInfo from '../../components/common/UserInfo';
import ProfileForm from '../../components/common/ProfileForm';
import TicketTable from '../../components/common/TicketTable';
import ChangePasswordModal from '../../components/common/ChangePasswordModal';
import { useAuth } from '../../context/AuthContext';
import dayjs from 'dayjs';
import axios from 'axios';

const UserProfile = () => {
  const location = useLocation();
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('profile');
  const [changePwdOpen, setChangePwdOpen] = useState(false);
  const [pwdForm] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [paginationBookings, setPaginationBookings] = useState({});
  const [paginationHistory, setPaginationHistory] = useState({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  useEffect(() => {
    console.log('User data:', user);
    const init = async () => {
      if (user) {
        setUserData({
          name: user.name || 'N/A',
          email: user.email || 'N/A',
          phone: user.phoneNumber || 'N/A',
          DOB: user.DOB ? dayjs(user.DOB).format('YYYY-MM-DD') : 'N/A',
          gender: 'N/A',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg' // Default avatar
        });

        await Promise.all([
          getBooking(),
          getHistory()
        ]);
      }
    }
    init();
  }, [user]);

  useEffect(() => {
    getBooking(paginationBookings.current || 1, paginationBookings.pageSize || 5);
  }, [paginationBookings.current, paginationBookings.pageSize]);

  useEffect(() => {
    getHistory(paginationHistory.current || 1, paginationHistory.pageSize || 5);
  }, [paginationHistory.current, paginationHistory.pageSize]);

  const getBooking = async (page = 1, size = 3) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/guest/my-bookings?page=${page - 1}&size=${size}`, { withCredentials: true });
      setBookingData(response.data.content);
      setPaginationBookings({
        current: response.data.pageable.pageNumber + 1,
        pageSize: response.data.pageable.pageSize,
        total: response.data.totalElements
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      message.error('Failed to fetch bookings.');
      return [];
    } finally {
      setLoading(false);
    }
  }

  const getHistory = async (page = 1, size = 3) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/guest/my-history?page=${page - 1}&size=${size}`, { withCredentials: true });
      setHistoryData(response.data.content);
      setPaginationHistory({
        current: response.data.pageable.pageNumber + 1,
        pageSize: response.data.pageable.pageSize,
        total: response.data.totalElements
      });
    } catch (error) {
      console.error('Error fetching history:', error);
      message.error('Failed to fetch history.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (location.pathname === '/my-ticket') {
      setActiveTab('tickets');
    }

    if (location.pathname === '/my-history') {
      setActiveTab('history');
    }

  }, [location.pathname]);

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

  const handleCancelTicket = ticketId => {
    message.success(`Ticket ${ticketId} cancelled successfully!`);
  };

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
        <ProfileForm
          form={form}
          isEditing={isEditing}
          onFinish={onFinish}
          onEditClick={handleEditClick}
          onSaveClick={handleSaveClick}
          onChangePasswordClick={() => setChangePwdOpen(true)}
          userData={userData}
        />
      )
    },
    {
      key: 'tickets',
      label: <span>My Tickets</span>,
      children: (
        <TicketTable
          data={bookingData || []}
          onCancelTicket={handleCancelTicket}
          pagination={paginationBookings}
          setPagination={(page) => setPaginationBookings(page)}
          loading={loading}
        />
      )
    },
    {
      key: 'history',
      label: (
        <span>
          <HistoryOutlined />
          History
        </span>
      ),
      children: (
        <TicketTable
          data={historyData || []}
          onCancelTicket={handleCancelTicket}
          pagination={paginationHistory}
          setPagination={(page) => setPaginationHistory(page)}
          loading={loading}
        />
      )
    }
  ];

  if (!userData) {
    return <div className="text-center my-20">Loading...</div>;
  }

  return (
    <div className="my-20 mx-10">
      <h1 className="font-bold text-[24px] mb-6">User Profile</h1>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card className="text-center">
            <ProfileAvatar
              avatar={userData.avatar}
              uploadProps={{
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
              }}
            />
            <h2 className="text-xl font-semibold">{userData.name}</h2>
            <Divider />
            <UserInfo user={userData} />
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card>
            <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
          </Card>
        </Col>
      </Row>

      <ChangePasswordModal
        visible={changePwdOpen}
        onCancel={() => setChangePwdOpen(false)}
        onFinish={onPwdChangeFinish}
        form={pwdForm}
      />
    </div>
  );
};

export default UserProfile;