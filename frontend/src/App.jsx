import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MainRoutes from './routes/MainRoutes';
import AdminRoutes from './routes/AdminRoutes';
import ProviderRoutes from './routes/ProviderRoutes';

function App() {
  return (
    <Router>
      {/* Toast Notifications */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Application Routes */}
      <Routes>
        {/* User Routes */}
        <Route path="/*" element={<MainRoutes />} />
        
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Provider Routes */}
        <Route path="/provider/*" element={<ProviderRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
