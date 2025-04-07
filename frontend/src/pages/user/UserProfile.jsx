// UserProfile.js
import React, { useState,  useEffect } from 'react';
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
import { useLocation } from 'react-router-dom';  // Make sure this import is correct

import ProfileAvatar from '../../components/ProfileAvatar';
import UserInfo from '../../components/UserInfo';
import ProfileForm from '../../components/ProfileForm';
import TicketTable from '../../components/TicketTable';
import ChangePasswordModal from '../../components/ChangePasswordModal';

const userData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '0928988254',
  DOB: '2004-02-05',
  gender: 'male',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
};

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
  },
  {
    key: '4',
    movie: 'Inception',
    date: '2023-08-01',
    time: '18:00',
    seats: ['D1'],
    price: '$15.00',
    status: 'Cancelled'
  },
  {
    key: '5',
    movie: 'Interstellar',
    date: '2023-09-15',
    time: '20:00',
    seats: ['E2', 'E3'],
    price: '$22.00',
    status: 'Completed'
  },
  {
    key: '6',
    movie: 'Dune',
    date: '2023-10-05',
    time: '14:30',
    seats: ['F7', 'F8', 'F9'],
    price: '$36.00',
    status: 'Upcoming'
  },
  {
    key: '7',
    movie: 'Black Panther: Wakanda Forever',
    date: '2023-11-11',
    time: '17:15',
    seats: ['G12'],
    price: '$14.50',
    status: 'Completed'
  },
  {
    key: '8',
    movie: 'Top Gun: Maverick',
    date: '2023-12-25',
    time: '13:00',
    seats: ['H4', 'H5'],
    price: '$28.00',
    status: 'Cancelled'
  },
  {
    key: '9',
    movie: 'Avatar: The Way of Water',
    date: '2024-01-07',
    time: '19:45',
    seats: ['J10', 'J11', 'J12'],
    price: '$42.00',
    status: 'Upcoming'
  },
  {
    key: '10',
    movie: 'Jurassic World Dominion',
    date: '2024-02-14',
    time: '20:30',
    seats: ['K6'],
    price: '$16.00',
    status: 'Upcoming'
  },
  {
    key: '11',
    movie: 'The Super Mario Bros. Movie',
    date: '2024-03-10',
    time: '11:00',
    seats: ['L3', 'L4'],
    price: '$24.00',
    status: 'Completed'
  },
  {
    key: '12',
    movie: 'Oppenheimer',
    date: '2024-04-22',
    time: '21:15',
    seats: ['M8', 'M9'],
    price: '$30.00',
    status: 'Upcoming'
  },
  {
    key: '13',
    movie: 'Barbie',
    date: '2024-05-30',
    time: '16:20',
    seats: ['N1', 'N2', 'N3', 'N4'],
    price: '$48.00',
    status: 'Cancelled'
  },
  {
    key: '14',
    movie: 'Mission: Impossible - Dead Reckoning',
    date: '2024-06-18',
    time: '18:45',
    seats: ['O7'],
    price: '$18.00',
    status: 'Upcoming'
  },
  {
    key: '15',
    movie: 'Guardians of the Galaxy Vol. 3',
    date: '2024-07-05',
    time: '14:00',
    seats: ['P5', 'P6'],
    price: '$26.00',
    status: 'Completed'
  },
  {
    key: '16',
    movie: 'Fast X',
    date: '2024-08-12',
    time: '20:00',
    seats: ['Q9', 'Q10'],
    price: '$32.00',
    status: 'Upcoming'
  },
  {
    key: '17',
    movie: 'The Little Mermaid',
    date: '2024-09-09',
    time: '15:30',
    seats: ['R2'],
    price: '$14.00',
    status: 'Cancelled'
  },
  {
    key: '18',
    movie: 'Indiana Jones and the Dial of Destiny',
    date: '2024-10-28',
    time: '19:00',
    seats: ['S4', 'S5', 'S6'],
    price: '$36.00',
    status: 'Upcoming'
  },
  {
    key: '19',
    movie: 'Elemental',
    date: '2024-11-15',
    time: '12:45',
    seats: ['T8'],
    price: '$12.00',
    status: 'Completed'
  },
  {
    key: '20',
    movie: 'The Marvels',
    date: '2024-12-20',
    time: '22:00',
    seats: ['U3', 'U4'],
    price: '$28.00',
    status: 'Upcoming'
  }
];

const UserProfile = () => {
  const location = useLocation(); // Get current location
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

  // Filter tickets for My Tickets tab (excluding Completed and Cancelled)
  const activeTickets = ticketData.filter(
    ticket => ticket.status !== 'Completed' && ticket.status !== 'Cancelled'
  );

  // Filter tickets for History tab (Completed and Cancelled only)
  const historyTickets = ticketData.filter(
    ticket => ticket.status === 'Completed' || ticket.status === 'Cancelled'
  );

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
          userData={userData}  // Add this prop
        />
      )
    },
    {
      key: 'tickets',
      label: <span>My Tickets</span>,
      children: (
        <TicketTable 
          data={activeTickets} 
          onCancelTicket={handleCancelTicket} 
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
          data={historyTickets} 
          onCancelTicket={handleCancelTicket} 
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
            <ProfileAvatar 
              avatar={userData.avatar} 
              uploadProps={uploadProps} 
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