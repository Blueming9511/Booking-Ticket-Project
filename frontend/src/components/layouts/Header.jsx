import { Layout, Menu, Dropdown, Avatar } from 'antd'
import { UserOutlined, DownOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const { Header } = Layout

const AppHeader = () => {
  const userMenu = (
    <Menu>
      <Menu.Item key='profile'>
        <Link to='/profile'>Profile</Link>
      </Menu.Item>
      <Menu.Item key='settings'>
        <Link to='/settings'>Settings</Link>
      </Menu.Item>
      <Menu.Item key='logout'>
        <a href='/login'>Logout</a>
      </Menu.Item>
    </Menu>
  )

  return (
    <Header style={styles.header}>
      {/* Logo */}
      <div className='logo'>
        <Link to='/' style={styles.logoText}>
          Netflix
        </Link>
      </div>

      {/* Navigation Menu */}
      <Menu
        mode='horizontal'
        defaultSelectedKeys={['home']}
        style={styles.menu}
      >
        <Menu.Item key='home' style={styles.menuItem}>
          <Link to='/'>Home</Link>
        </Menu.Item>
        <Menu.Item key='dashboard' style={styles.menuItem}>
          <Link to='/booking'>Booking</Link>
        </Menu.Item>
        <Menu.Item key='movies' style={styles.menuItem}>
          <Link to='/movies'>Movie</Link>
        </Menu.Item>
        <Menu.Item key='cinema' style={styles.menuItem}>
          <Link to='/cinemas'>Cinema</Link>
        </Menu.Item>
      </Menu>

      {/* User Dropdown */}
      <Dropdown overlay={userMenu} trigger={['click']}>
        <div style={styles.userSection}>
          <Avatar icon={<UserOutlined />} style={styles.avatar} />
          <span style={styles.username}>John Doe</span>
          <DownOutlined style={styles.icon} />
        </div>
      </Dropdown>
    </Header>
  )
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    background: 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0))', // Gradient fades to none
    backdropFilter: 'blur(10px)', // Blur effect
    transition: 'background 0.5s ease-in-out', // Smooth transition effect
    borderBottom: 'none',
    width: '100%',
    position: 'fixed',
    top: 0,
    padding: '0 3em',
    zIndex: 1000
  },
  logoText: {
    color: 'white', // White text
    fontSize: '20px',
    fontWeight: 'bold',
    textDecoration: 'none'
  },
  menu: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: '1em',
    background: 'transparent',
    borderBottom: 'none'
  },
  menuItem: {
    color: 'white' // White text for menu items
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  avatar: {
    marginRight: '8px'
  },
  username: {
    color: 'white', // White text
    marginRight: '8px'
  },
  icon: {
    color: 'white' // White text
  }
}

export default AppHeader
