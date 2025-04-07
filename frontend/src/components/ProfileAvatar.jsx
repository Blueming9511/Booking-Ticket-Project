// ProfileAvatar.js
import React from 'react';
import { Avatar, Upload, Button } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';

const ProfileAvatar = ({ avatar, uploadProps }) => (
  <div className="mb-4 flex flex-col gap-2 justify-center items-center">
    <Avatar
      size={128}
      src={avatar}
      icon={<UserOutlined />}
      className="mb-3"
    />
    <Upload {...uploadProps}>
      <Button icon={<UploadOutlined />}>Change Avatar</Button>
    </Upload>
  </div>
);

export default ProfileAvatar;