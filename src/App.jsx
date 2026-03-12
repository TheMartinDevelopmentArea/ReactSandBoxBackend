import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Home } from './components/Home';
import { Cart } from './components/Cart';
import { Navbar } from './components/Navbar';
import { Orders } from './components/Orders';
import { AuthContext } from './components/AuthContext';
import { Dashboard } from './components/Dashboard';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />

        <Route path="/cart" element={
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        } />

        <Route path="/orders" element={
          <PrivateRoute>
            <Orders />
          </PrivateRoute>
        } />

        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Router>
  );
}