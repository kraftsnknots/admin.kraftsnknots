import { useState } from "react";
import "./styles/Sidebar.css";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useDispatch } from "react-redux";

const Sidebar = (props) => {
  const navigate = useNavigate();
  const [openOrders, setOpenOrders] = useState(false);
  const [status, setStatus] = useState(0)
  const dispatch = useDispatch();

  const toggleOrders = () => setOpenOrders((prev) => !prev);

  const handleDashboard = () => {
    setStatus(0);
    navigate('/dashboard');
  }

  const handleProducts = () => {
    setStatus(1);
    navigate('/products');
  }

  const handleCustomerQueries = () => {
    setStatus(3);
    navigate('/queries');
  }

  const handleUsers = () => {
    setStatus(4);
    navigate('/users');
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <aside className={`sidebar ${props.barStatus}`}>
      <nav className="menu">
        <div className={`menu-item ${props.dashboard}`} onClick={() => handleDashboard()}>
          <span>🏠</span> <span>Dashboard</span>
        </div>

        <div className={`menu-item ${props.products}`} onClick={() => handleProducts()}>
          <span>📂</span> <span>Products</span>
        </div>

        <div className={`menu-item ${openOrders ? "open" : ""}`} onClick={toggleOrders}>
          <span>💈</span> <span>Orders ▾</span>
        </div>

        {openOrders && (
          <div className="submenu">
            <div className={`menu-item ${status === 2.1 ? 'active' : ''}`} onClick={() => setStatus(2.1)}><span>✅</span> <span>Success Orders</span></div>
            <div className={`menu-item ${status === 2.2 ? 'active' : ''}`} onClick={() => setStatus(2.2)}><span>❌</span> <span>Failed Orders</span></div>
          </div>
        )}

        <div className={`menu-item ${props.customerQueries}`} onClick={() => handleCustomerQueries()}>
          <span>📅</span> <span>Customer Queries</span>
        </div>

        <div className={`menu-item ${props.users}`} onClick={() => handleUsers()}>
          <span>👥</span> <span>Users</span>
        </div>
      </nav>
      <nav className="menu">
        <div className="menu-item active-menu" onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Logout</span>
        </div>
      </nav>

    </aside>
  );
};

export default Sidebar;
