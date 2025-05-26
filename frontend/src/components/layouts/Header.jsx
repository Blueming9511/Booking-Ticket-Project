import React, { useState, useEffect } from 'react';
import { Layout, Menu, Dropdown, Avatar, Drawer, Button, theme, message } from 'antd';
import { UserOutlined, DownOutlined, MenuOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';

const { Header } = Layout;

// Define the cookie name
const ACCESS_TOKEN_COOKIE_NAME = 'accessToken';

// --- Component ---
const AppHeader = () => {
  // --- State ---
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const { token } = theme.useToken();

  // Effect to update isLoggedIn if the cookie changes
  useEffect(() => {
    const decodeJWT = (token) => {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
          '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));
        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
      }
    };

    const checkAuthStatus = () => {
      const token = Cookies.get(ACCESS_TOKEN_COOKIE_NAME);
      console.log('Current token:', token);
      if (token) {
        const decoded = decodeJWT(token);
        if (decoded && decoded.name) {
          setUserName(decoded.name);
        }
      }
      setIsLoggedIn(!!token);
    };

    // Initial check
    checkAuthStatus();

    // Set up interval to check periodically (every 30 seconds)
    const interval = setInterval(checkAuthStatus, 30000);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

  // --- Handlers ---
  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  const handleLogout = () => {
    console.log('Logging out...');
    Cookies.remove(ACCESS_TOKEN_COOKIE_NAME, { path: '/' }); // Ensure same path as when cookie was set
    setIsLoggedIn(false);
    setUserName('');
    closeDrawer();
    message.success('Logged out successfully.');
    navigate('/login');
  };

  // --- Menu Definitions ---
  const mainMenuItemsConfig = [
    {
      key: 'home',
      label: <Link to='/' onClick={closeDrawer}>Home</Link>,
      style: styles.menuItem
    },
    {
      key: 'booking',
      label: <Link to='/booking' onClick={closeDrawer}>Booking</Link>,
      style: styles.menuItem
    },
    {
      key: 'movies',
      label: <Link to='/movies' onClick={closeDrawer}>Movies</Link>,
      style: styles.menuItem
    }
  ];

  const userMenu = (
    <Menu>
      <Menu.Item key='profile' icon={<UserOutlined />}>
        <Link to='/profile'>Profile</Link>
      </Menu.Item>
      <Menu.Item key='myTicket'>
        <Link to='/my-ticket'>My Tickets</Link>
      </Menu.Item>
      <Menu.Item key='History'>
        <Link to='/my-history'>History</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key='logout' icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  // --- Responsive Logic ---
  const isMobile = !screens.md;

  // --- Account Trigger Area (Conditional Logic Inside) ---
  const renderAccountTrigger = () => {
    const userTriggerElement = (
      <div style={{ ...styles.userSection, gap: '8px' }} className="hover:bg-[rgba(255,255,255,0.1)] transition-colors px-2 py-1 rounded">
        <Avatar size="small" icon={<UserOutlined />} style={styles.avatar} />
        {!screens.sm || !isLoggedIn ? (
             <span style={styles.username}>Account</span>
        ) : (
             <span style={styles.username}>{userName || 'User'}</span>
        )}
        <DownOutlined style={styles.icon} />
      </div>
    );

    if (isLoggedIn) {
      return (
        <Dropdown overlay={userMenu} trigger={['click']}>
          {userTriggerElement}
        </Dropdown>
      );
    } else {
      return (
        <Link to="/login" onClick={closeDrawer}> {/* Added closeDrawer here too for consistency */}
          {userTriggerElement}
        </Link>
      );
    }
  };

  // --- Drawer Menu Content (Account section is conditional inside) ---
  const renderDrawerMenuItems = () => (
    <>
      {mainMenuItemsConfig.map(item => (
        <Menu.Item key={`${item.key}Drawer`} style={item.style}>
            {item.label}
        </Menu.Item>
      ))}
      <Menu.Divider style={styles.divider} />
      <Menu.SubMenu
        key='userSubMenuDrawer'
        title='Account'
        icon={<UserOutlined />}
        style={styles.menuItem}
      >
        {isLoggedIn ? (
          <>
            <Menu.Item key='profileDrawer' icon={<UserOutlined />}>
              <Link to='/profile' onClick={closeDrawer}>Profile</Link>
            </Menu.Item>
            <Menu.Item key='myTicketDrawer'>
              <Link to='/my-ticket' onClick={closeDrawer}>My Tickets</Link>
            </Menu.Item>
            <Menu.Item key='HistoryDrawer'>
              <Link to='/my-history' onClick={closeDrawer}>History</Link>
            </Menu.Item>
            <Menu.Divider style={styles.divider} />
            <Menu.Item key='logoutDrawer' icon={<LogoutOutlined />} onClick={handleLogout}>
              Logout
            </Menu.Item>
          </>
        ) : (
          <Menu.Item key='loginRedirectDrawer' icon={<LoginOutlined />}>
            <Link to='/login' onClick={closeDrawer}>Login / Sign Up</Link>
          </Menu.Item>
        )}
      </Menu.SubMenu>
    </>
  );

  // --- Render ---
  return (
    <>
      <Header style={styles.header}>
        <div className='logo'>
          <Link to='/' style={styles.logoText}>
            Cinemaxx
          </Link>
        </div>

        {isMobile ? (
          <div className='flex items-center gap-x-4'>
             {renderAccountTrigger()}
             <Button
                type='text'
                icon={<MenuOutlined style={styles.menuIcon} />}
                onClick={showDrawer}
                style={styles.menuButton}
             />
          </div>
        ) : (
          <div className='flex items-center gap-x-5'>
            <Menu
              mode='horizontal'
              style={styles.menu}
              items={mainMenuItemsConfig}
            />
            {renderAccountTrigger()}
          </div>
        )}
      </Header>

      <Drawer
        title={
          <Link to='/' style={styles.logoText} onClick={closeDrawer}>
            Cinemaxx
          </Link>
        }
        placement='right'
        onClose={closeDrawer}
        open={drawerVisible}
        bodyStyle={styles.drawerBody}
        headerStyle={styles.drawerHeader}
        width={280}
        closable={true}
      >
        <Menu mode='vertical' theme='dark' style={styles.drawerMenu}>
          {renderDrawerMenuItems()}
        </Menu>
      </Drawer>
    </>
  );
};

// --- Styles --- (Keep your existing styles)
const styles = {
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0))',
      backdropFilter: 'blur(8px)',
      transition: 'background 0.3s ease-in-out',
      borderBottom: 'none',
      width: '100%',
      position: 'fixed',
      top: 0,
      padding: '0 50px', 
    '@media (min-width: 768px)': { padding: '0 20px' },
      zIndex: 1000,
      height: '68px'
    },
    logoText: {
      color: '#E50914',
      fontSize: '24px',
      fontWeight: 'bold',
      textDecoration: 'none',
      textTransform: 'uppercase',
      letterSpacing: '-1px',
    },
    menu: { 
      background: 'transparent',
      borderBottom: 'none',
      lineHeight: '68px', 
      flex: 1, 
      display: 'flex',
      justifyContent: 'flex-end', 
      marginRight: '20px', 
    },
    menuItem: { 
      color: '#E5E5E5',
      fontWeight: 500,
    },
    userSection: { 
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      color: 'white',
    },
    avatar: {},
    username: {
      color: 'white',
      fontSize: '14px',
      marginLeft: '8px', 
      marginRight: '4px',
    },
    icon: { 
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '12px',
    },
    menuButton: {},
    menuIcon: { 
      color: 'white',
      fontSize: '24px'
    },
    drawerHeader: {
      background: '#141414',
      borderBottom: '1px solid #303030'
    },
    drawerBody: {
      padding: 0,
      background: '#141414'
    },
    drawerMenu: { 
      background: 'transparent',
      borderRight: 'none',
    },
    divider: { 
        borderColor: 'rgba(255, 255, 255, 0.15)',
        margin: '12px 0'
    }
  };

export default AppHeader;