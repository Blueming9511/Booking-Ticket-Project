import React, { useState } from 'react'; // Use React import
import { Layout, Menu, Dropdown, Avatar, Drawer, Button, Grid, message } from 'antd'; // Added message
import { UserOutlined, DownOutlined, MenuOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate

const { useBreakpoint } = Grid;
const { Header } = Layout;

// --- Component ---
const AppHeader = () => {
  // --- State ---
  const [drawerVisible, setDrawerVisible] = useState(false);
  // ** Simulate Authentication State **
  // !! In a real app, replace this with your actual auth check !!
  const [isLoggedIn, setIsLoggedIn] = useState(true); // <-- Set to false to test logged-out behaviour
  const screens = useBreakpoint();
  const navigate = useNavigate(); // Hook for navigation

  // --- Handlers ---
  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  // Placeholder for actual logout function
  const handleLogout = () => {
    console.log('Logging out...');
    setIsLoggedIn(false); // Simulate logout
    closeDrawer();
    message.success('Logged out successfully.');
    navigate('/login');
  };

  // --- Menu Definitions ---
  // Define main menu items as an array of objects for the Menu component's `items` prop
  const mainMenuItemsConfig = [
    {
      key: 'home',
      label: <Link to='/' onClick={closeDrawer}>Home</Link>,
      style: styles.menuItem // Apply style here if needed per item
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

  // User Dropdown Menu (Only used when logged in)
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
    // The visual trigger element is always rendered
    const userTriggerElement = (
      <div style={{ ...styles.userSection, gap: '8px' }} className="hover:bg-[rgba(255,255,255,0.1)] transition-colors px-2 py-1 rounded">
        <Avatar size="small" icon={<UserOutlined />} style={styles.avatar} />
        {/* Show 'Account' if not logged in or on small screens */}
        {!screens.sm || !isLoggedIn ? (
             <span style={styles.username}>Account</span>
        ) : (
             // Show placeholder username only if logged in AND on larger screens
             <span style={styles.username}>John Doe</span>
        )}
        <DownOutlined style={styles.icon} />
      </div>
    );

    if (isLoggedIn) {
      // Logged In: Wrap trigger in Dropdown
      return (
        <Dropdown overlay={userMenu} trigger={['click']}>
          {userTriggerElement}
        </Dropdown>
      );
    } else {
      // Logged Out: Wrap trigger in Link to login page
      return (
        <Link to="/login">
          {userTriggerElement}
        </Link>
      );
    }
  };

  // --- Drawer Menu Content (Account section is conditional inside) ---
  const renderDrawerMenuItems = () => (
    <>
      {/* Map main menu items for the drawer */}
      {mainMenuItemsConfig.map(item => (
        <Menu.Item key={`${item.key}Drawer`} style={item.style}>
            {/* Ensure the label (Link) itself handles closeDrawer */}
            {item.label}
        </Menu.Item>
      ))}
      <Menu.Divider style={styles.divider} />
      {/* Always render Account SubMenu */}
      <Menu.SubMenu
        key='userSubMenuDrawer'
        title='Account'
        icon={<UserOutlined />}
        style={styles.menuItem}
      >
        {isLoggedIn ? (
          // Logged In Drawer Items
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
          // Logged Out Drawer Item
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
        {/* Logo */}
        <div className='logo'>
          <Link to='/' style={styles.logoText}>
            Cinemaxx
          </Link>
        </div>

        {/* Conditional Rendering: Mobile Menu Button or Desktop Menu + Right Content */}
        {isMobile ? (
          // --- Mobile View ---
          <div className='flex items-center gap-x-4'>
             {/* Render Account trigger on mobile */}
             {renderAccountTrigger()}
             {/* Render Drawer button */}
             <Button
                type='text'
                icon={<MenuOutlined style={styles.menuIcon} />}
                onClick={showDrawer}
                style={styles.menuButton}
             />
          </div>
        ) : (
          // --- Desktop View ---
          <div className='flex items-center gap-x-5'>
            {/* Always render main navigation menu */}
            <Menu
              mode='horizontal'
              style={styles.menu}
              items={mainMenuItemsConfig} // Use the items prop
              // selectedKeys={...} // Add logic to determine selected key based on route
            />
            {/* Render the dynamic account trigger */}
            {renderAccountTrigger()}
          </div>
        )}
      </Header>

      {/* Drawer for Mobile */}
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

// --- Styles --- (Using previous refined styles)
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
      padding: '0 50px', // Base padding
    // Responsive padding can be handled via media queries in CSS/SCSS or Tailwind classes if preferred
    '@media (min-width: 768px)': { padding: '0 20px' },
      zIndex: 1000,
      height: '68px'
    },
    logoText: {
      color: '#E50914', // Netflix Red
      fontSize: '24px',
      fontWeight: 'bold',
      textDecoration: 'none',
      textTransform: 'uppercase',
      letterSpacing: '-1px',
    },
    menu: { // Styles for the main desktop navigation menu container
      background: 'transparent',
      borderBottom: 'none',
      lineHeight: '68px', // Align items vertically with header height
      flex: 1, // Allow menu to take up space
      display: 'flex',
      justifyContent: 'flex-end', // Push menu items to the right before the account trigger
      marginRight: '20px', // Space between main menu and account trigger
    },
    menuItem: { // Style for individual items within the <Menu> component (applies to desktop/drawer unless overridden)
      color: '#E5E5E5',
      fontWeight: 500,
      // AntD's Menu applies its own hover styles based on theme
    },
    userSection: { // Base style for the div containing avatar/text/icon
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      color: 'white',
    },
    avatar: {
      // Style for the avatar itself
    },
    username: {
      color: 'white',
      fontSize: '14px',
      marginLeft: '8px', // Add space if gap isn't sufficient or not using flex gap
      marginRight: '4px',
    },
    icon: { // Style for the DownOutlined icon
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '12px',
    },
    menuButton: { // Style for the mobile drawer toggle button
      // Keep simple or add specific needs
    },
    menuIcon: { // Style for the MenuOutlined icon itself
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
    drawerMenu: { // Style for the Menu component *inside* the drawer
      background: 'transparent',
      borderRight: 'none',
    },
    divider: { // Style for dividers in menus/drawers
        borderColor: 'rgba(255, 255, 255, 0.15)',
        margin: '12px 0'
    }
  };

export default AppHeader;