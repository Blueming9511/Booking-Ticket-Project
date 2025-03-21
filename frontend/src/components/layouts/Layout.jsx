import { Outlet } from "react-router-dom";
import AppFooter from "./Footer";
import AppHeader from "./Header";

const Layout = () => {
  return (
    <div>
      <AppHeader />
      <main>
        <Outlet /> {/* This renders the current page */}
      </main>
      <AppFooter />
    </div>
  );
};

export default Layout;
