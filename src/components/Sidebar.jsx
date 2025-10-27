import { useState, useEffect, useRef } from "react";
import "./styles/Sidebar.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSidebar } from "../context/SidebarContext";


const Sidebar = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openOrders, setOpenOrders] = useState(false);
  const [status, setStatus] = useState(0);
  const { collapsed, setCollapsed } = useSidebar();
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef(null);

  // ✅ Load persisted collapse state
  useEffect(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  // ✅ Save collapse state
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", collapsed);
  }, [collapsed]);

  // ✅ Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowPopover(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOrders = () => {
    if (collapsed) {
      // when collapsed, open popover instead
      setShowPopover((prev) => !prev);
    } else {
      setOpenOrders((prev) => !prev);
    }
  };

  const toggleCollapse = () => setCollapsed((prev) => !prev);

  const handleDashboard = () => {
    setStatus(0);
    navigate("/dashboard");
  };

  const handleProducts = () => {
    setStatus(1);
    navigate("/products");
  };

  const handleCustomerQueries = () => {
    setStatus(3);
    navigate("/queries");
  };

  const handleUsers = () => {
    setStatus(4);
    navigate("/users");
  };

  const handleSuccessOrders = () => {
    setStatus(2.1);
    navigate("/orders/success");
    setShowPopover(false);
  };

  const handleFailedOrders = () => {
    setStatus(2.2);
    navigate("/orders/failed");
    setShowPopover(false);
  };

  return (
    <aside
      className={`sidebar ${props.barStatus} ${collapsed ? "collapsed" : ""
        }`}
    >
      {/* Collapse / Expand Button */}
      <div className="collapse-toggle" onClick={toggleCollapse}>
        <i
          className={`fa-solid ${collapsed ? "fa-angles-right" : "fa-angles-left"
            }`}
        ></i>
      </div>

      <nav className="menu">
        {/* Dashboard */}
        <div
          className={`menu-item ${props.dashboard}`}
          data-title="Dashboard"
          onClick={handleDashboard}
        >
          <i className="fa-solid fa-house-user"></i>
          {!collapsed && <span>Dashboard</span>}
        </div>

        {/* Products */}
        <div
          className={`menu-item ${props.products}`}
          data-title="Products"
          onClick={handleProducts}
        >
          <i className="fa-solid fa-folder-closed"></i>
          {!collapsed && <span>Products</span>}
        </div>

        {/* Orders */}
        <div
          className={`menu-item ${openOrders ? "open" : ""}`}
          data-title="Orders"
          onClick={toggleOrders}
        >
          <i className="fa-solid fa-list"></i>
          {!collapsed && <span>Orders ▾</span>}
        </div>

        {/* Submenu when expanded */}
        {!collapsed && openOrders && (
          <div className="submenu">
            <div
              className={`submenu-item ${status === 2.1 ? "active" : ""
                }`}
              data-title="Success Orders"
              onClick={handleSuccessOrders}
            >
              <i
                className="fa-solid fa-check"
                style={{ color: "green", fontSize: 15, width: 20 }}
              ></i>
              <span>Success Orders</span>
            </div>
            <div
              className={`submenu-item ${status === 2.2 ? "active" : ""
                }`}
              data-title="Failed Orders"
              onClick={handleFailedOrders}
            >
              <i
                className="fa-solid fa-xmark"
                style={{ color: "red", fontSize: 17, width: 20 }}
              ></i>
              <span>Failed Orders</span>
            </div>
          </div>
        )}

        {/* Customer Queries */}
        <div
          className={`menu-item ${props.customerQueries}`}
          data-title="Customer Queries"
          onClick={handleCustomerQueries}
        >
          <i className="fa-solid fa-calendar-days"></i>
          {!collapsed && <span>Customer Queries</span>}
        </div>

        {/* Users */}
        <div
          className={`menu-item ${props.users}`}
          data-title="Users"
          onClick={handleUsers}
        >
          <i className="fa-solid fa-users"></i>
          {!collapsed && <span>Users</span>}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
