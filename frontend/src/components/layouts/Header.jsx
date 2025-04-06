import { useState } from 'react' // Import useState

import { Layout, Menu, Dropdown, Avatar, Drawer, Button, Grid } from 'antd'
import { UserOutlined, DownOutlined, MenuOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
const { useBreakpoint } = Grid // Destructure useBreakpoint hook

const { Header } = Layout

const AppHeader = () => {
  const [drawerVisible, setDrawerVisible] = useState(false) // State for drawer visibility
  const screens = useBreakpoint() // Hook to get screen size info

  const showDrawer = () => {
    setDrawerVisible(true)
  }

  const closeDrawer = () => {
    setDrawerVisible(false)
  }

    // Define main menu items separately for reuse
    const mainMenuItems = (
      <>
        <Menu.Item key='home' style={styles.menuItem}>
          <Link to='/' onClick={closeDrawer}>Home</Link> {/* Close drawer on click */}
        </Menu.Item>
        <Menu.Item key='dashboard' style={styles.menuItem}>
          <Link to='/booking' onClick={closeDrawer}>Booking</Link> {/* Close drawer on click */}
        </Menu.Item>
        <Menu.Item key='movies' style={styles.menuItem}>
          <Link to='/movies' onClick={closeDrawer}>Movie</Link> {/* Close drawer on click */}
        </Menu.Item>
      </>
    )

  const userMenu = (
    <Menu>
      <Menu.Item key='profile'>
        <Link to='/profile'>Profile</Link>
      </Menu.Item>
      <Menu.Item key='myTicket'>
        <Link to='/my-ticket'>My Ticket</Link>
      </Menu.Item>
      <Menu.Item key='History'>
        <Link to='/my-history'>History</Link>
      </Menu.Item>
      <Menu.Item key='logout'>
        <a href='/login'>Logout</a>
      </Menu.Item>
    </Menu>
  )

  // Determine if we should show the mobile menu (drawer trigger)
  // Show drawer trigger on screens smaller than 'md' (medium)
  const isMobile = !screens.md

  return (
    <Header style={styles.header}>
      {/* Logo */}
      <div className='logo'>
        <Link to='/' style={styles.logoText}>
          Netflix
        </Link>
      </div>

      {isMobile ? (
        <div style={styles.mobileMenuContainer}>
          <Button
            type='text'
            icon={<MenuOutlined style={styles.menuIcon} />}
            onClick={showDrawer}
            style={styles.menuButton}
          />
        </div>
      ) : (
        <div className='flex gap-2'>
          {' '}
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
          </Menu>
          {/* User Dropdown */}
          <Dropdown overlay={userMenu} trigger={['click']}>
            <div style={styles.userSection}>
              <Avatar icon={<UserOutlined />} style={styles.avatar} />
              <span style={styles.username}>John Doe</span>
              <DownOutlined style={styles.icon} />
            </div>
          </Dropdown>
        </div>
      )}

      <Drawer
        title={
          <Link to='/' style={styles.logoText} onClick={closeDrawer}>
            Netflix
          </Link>
        }
        placement='right'
        onClose={closeDrawer}
        visible={drawerVisible}
        bodyStyle={styles.drawerBody} // Style drawer body
        headerStyle={styles.drawerHeader} // Style drawer header
        width={250} // Set a width for the drawer
      >
        <Menu mode='vertical' theme='dark' style={styles.drawerMenu}>
          {mainMenuItems}
          {/* Optional: Include user menu items directly in the drawer too */}
          <Menu.Divider style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
          <Menu.SubMenu
            key='userSubMenu'
            title='Account'
            icon={<UserOutlined />}
            style={styles.menuItem}
          >
            {userMenu.props.children} {/* Reuse user menu items */}
          </Menu.SubMenu>
        </Menu>
      </Drawer>
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
  }, // --- New Styles for Mobile/Drawer ---
  mobileMenuContainer: {
    // Container for mobile icons
    display: 'flex',
    alignItems: 'center',
    gap: '16px' // Add some space between user icon and menu button
  },
  menuButton: {
    // No specific style needed if type='text' is sufficient,
    // but you can add margin/padding if needed.
    // The icon color is set inline below.
  },
  menuIcon: {
    color: 'white', // Style for the MenuOutlined icon itself
    fontSize: '20px' // Make icon slightly larger if desired
  },
  drawerHeader: {
    background: '#141414', // Dark background for drawer header
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)' // Subtle border
  },
  drawerBody: {
    padding: 0, // Remove default padding to allow Menu to fill
    background: '#141414' // Dark background matching Netflix theme
  },
  drawerMenu: {
    background: 'transparent', // Menu background transparent within the drawer body
    borderRight: 'none' // Remove default border from vertical menu
  }
}

export default AppHeader
