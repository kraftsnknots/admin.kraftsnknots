import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Dropdown, Button, Container, Image } from "react-bootstrap";
import { performLogout } from "../features/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

import hamburgerMenu from "../assets/icons/burger-menu-left.svg";
import cross from "../assets/icons/cross.png";
import profilePicture from "../assets/icons/dummy_profile_picture.png";

import { FaUser, FaSignOutAlt } from "react-icons/fa";
import "./styles/header.css";

const logo = "https://firebasestorage.googleapis.com/v0/b/kraftsnknots-921a0.firebasestorage.app/o/logos%2Fknklogo2.png?alt=media&token=e3ba6239-845d-4d11-9976-120790ca53e3";

const Header = ({ toggleSidebar }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux user
  const user = useSelector((state) => state.auth.user);

  const username = user?.name || user?.displayName || user?.email || "Guest";
  const userPhoto = user?.photoURL || profilePicture;

  // Mobile menu toggle
  const handleMenuClick = () => {
    toggleSidebar();
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(performLogout());
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <Navbar bg="white" expand="lg" className="topbar">
      <Container fluid className="d-flex justify-content-between">

        {/* Mobile Menu Button */}
        <Button variant="light" className="d-lg-none p-1" onClick={handleMenuClick}>
          <img
            src={isMenuOpen ? cross : hamburgerMenu}
            alt="menu-toggle"
            width="28"
            height="28"
          />
        </Button>

        {/* Logo */}
        <Navbar.Brand className="ms-2 logo">
          <img
            src={logo}
            alt="Krafts & Knots Logo"
            style={{ objectFit: "contain" }}
          />
        </Navbar.Brand>

        <Nav className="ms-auto align-items-center">

          {/* Profile Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="link"
              id="profile-dropdown"
              className="p-0 border-0 bg-transparent"
            >
              <Image
                src={userPhoto}
                width="40"
                height="40"
                className="profile-img"
              />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <div className="px-3 py-2">
                <strong style={{fontSize:13}}>👋 Hello, {username}</strong>
              </div>

              <Dropdown.Divider />

              <Dropdown.Item>
                <FaUser className="me-2" /> Profile
              </Dropdown.Item>

              <Dropdown.Item className="text-danger" onClick={handleLogout}>
                <FaSignOutAlt className="me-2" /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
