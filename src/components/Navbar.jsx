import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './styles/navbar.css';

export const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  if (!isAuthenticated) return null;

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        Shopping
      </Link>
      
      <div className="nav-links">
        <Link to="/dashboard" className="nav-item">
           Dashboard
        </Link>

        <Link to="/orders" className="nav-item">
           Pedidos
        </Link>

        <Link to="/cart" className="nav-item cart-link">
           Carrinho
        </Link>

        <button onClick={logout} className="logout-btn">
          Sair
        </button>
      </div>
    </nav>
  );
};