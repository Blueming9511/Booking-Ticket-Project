// UserInfo.js
import React from 'react';
import { MailOutlined, CalendarOutlined, PhoneOutlined } from '@ant-design/icons';

const UserInfo = ({ user }) => (
  <div className="text-left space-y-3">
    <div className="flex items-center">
      <MailOutlined className="mr-2 text-gray-500" />
      <span>{user.email}</span>
    </div>
    <div className="flex items-center">
      <CalendarOutlined className="mr-2 text-gray-500" />
      <span>{user.DOB}</span>
    </div>
    <div className="flex items-center">
      <PhoneOutlined className="mr-2 text-gray-500" />
      <span>{user.phone}</span>
    </div>
  </div>
);

export default UserInfo;