import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Sidebar.css";
import Candle  from "../assets/images/candle.png"
import Logo  from "../assets/images/logo.png"

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Toggle Button (visible on small screens) */}
      <button
        className="btn btn-primary d-lg-none toggle-btn position-fixed top-0 start-0 m-3 shadow-sm"
        onClick={toggleSidebar}
      >
        <i className="bi bi-list fs-4"></i>
      </button>

      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      {/* Sidebar */}
      <div className={`sidebar bg-light p-3 ${isOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="d-flex align-items-center justify-content-center mb-4 w-100">
          <h5 className="fw-bold m-0"><img src={Logo} class="rounded float-start" alt="..." width={250}/></h5>
        </div>

        {/* Navigation */}
        <ul className="nav flex-column w-100">
          <li className="nav-item mb-2">
            <a href="#" className="nav-link active d-flex align-items-center rounded-3 menu-text">
              <i className="bi bi-speedometer2 me-2"></i> Dashboard
            </a>
          </li>
          <li className="nav-item mb-2">
            <a href="#" className="nav-link d-flex align-items-center menu-text">
              <i className="bi bi-table me-2"></i> Tables
            </a>
          </li>
          <li className="nav-item mb-2">
            <a href="#" className="nav-link d-flex align-items-center menu-text">
              <i className="bi bi-credit-card me-2"></i> Billing
            </a>
          </li>
          <li className="nav-item mb-2">
            <a href="#" className="nav-link d-flex align-items-center menu-text">
              <i className="bi bi-box me-2"></i> Virtual Reality
            </a>
          </li>
          <li className="nav-item mb-2">
            <a href="#" className="nav-link d-flex align-items-center menu-text">
              <i className="bi bi-translate me-2"></i> RTL
            </a>
          </li>
        </ul>

        {/* Section Title */}
        <small className="text-muted mt-3 mb-2 fw-bold account-pages">ACCOUNT PAGES</small>

        <ul className="nav flex-column w-100">
          <li className="nav-item mb-2">
            <a href="#" className="nav-link d-flex align-items-center menu-text">
              <i className="bi bi-person-circle me-2"></i> Profile
            </a>
          </li>
          <li className="nav-item mb-2">
            <a href="#" className="nav-link d-flex align-items-center menu-text">
              <i className="bi bi-box-arrow-in-right me-2"></i> Sign In
            </a>
          </li>
          <li className="nav-item mb-4">
            <a href="#" className="nav-link d-flex align-items-center menu-text">
              <i className="bi bi-person-plus me-2"></i> Sign Up
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
