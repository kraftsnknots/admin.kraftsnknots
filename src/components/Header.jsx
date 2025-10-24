import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import hamburgerMenu from "../assets/icons/burger-menu-left.svg";
import cross from "../assets/icons/cross.png";
import profilePicture from "../assets/icons/dummy_profile_picture.png";
import Logo from "../assets/images/logo.png";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import "./styles/header.css";

const Header = ({ toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // ✅ Track sidebar state
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔥 Grab user info from Redux store
  const user = useSelector((state) => state.auth.user);
  const username = user?.name || user?.email || "Guest";

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  // ✅ Toggle both sidebar + icon state
  const handleMenuClick = () => {
    toggleSidebar(); // parent sidebar toggle
    setIsMenuOpen((prev) => !prev); // icon swap
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle logout
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
    <header className="topbar">
      {/* ✅ Toggle menu button */}
      <button className="mobile-menu-btn" onClick={handleMenuClick}>
        <img
          src={isMenuOpen ? cross : hamburgerMenu} // dynamically switch icon
          alt="menu-toggle"
          className="mobile-menu"
        />
      </button>

      <div className="logo">
        <img src={Logo} alt="Ujaas Logo" />
      </div>

      <div className="profiler" ref={dropdownRef}>
        <img
          src={profilePicture}
          alt="User"
          className="profile-img"
          onClick={toggleDropdown}
        />

        {isDropdownOpen && (
          <div className="dropdown-menu">
            <p className="dropdown-hello">👋 Hello, {username}</p>
            <hr />
            <button className="dropdown-item">
              <FaUser className="dropdown-icon" />
              Profile
            </button>
            <button className="dropdown-item logout" onClick={handleLogout}>
              <FaSignOutAlt className="dropdown-icon" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
