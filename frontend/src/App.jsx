import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MainRoutes from './routes/MainRoutes';
import AdminRoutes from './routes/AdminRoutes';
import ProviderRoutes from './routes/ProviderRoutes';

import { useAuth } from './context/AuthContext';

function App() {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <>
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
                <Route path="/*" element={<MainRoutes/>}/>

                {/* Admin Routes */}
                <Route path="/admin/*" element={<AdminRoutes/>}/>

                {/* Provider Routes */}
                <Route path="/provider/*" element={<ProviderRoutes/>}/>
            </Routes>
        </>
    );
}

export default App;
