import React, { useEffect } from "react";
import "./styles/Dashboard.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MoneyCardSkeleton from "../components/MoneyCardSkeleton";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setTotalUsers,
  setAdminUsers,
  setTotalProducts,
  setSuccessOrders,
  setFailedOrders,
  setDiscountCodes,
  setMobileQueries,
  resetDashboard,
  setLoading,
} from "../features/dashboardSlice";
import { useSidebar } from "../context/SidebarContext";
import { db } from "../config/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { collapsed } = useSidebar();

  const {
    totalUsers,
    adminUsers,
    totalProducts,
    successOrders,
    failedOrders,
    discountCodes,
    mobileQueries,
    loading,
  } = useSelector((state) => state.dashboard);

  const [isOpen, setIsOpen] = React.useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const { user, isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    // ⛔ DO NOT run listeners until admin is confirmed
    if (!isLoggedIn || !user?.admin) return;

    dispatch(setLoading(true));

    const unsubFns = [];

    // 🧍 Non-admin users
    const userQuery = query(collection(db, "users"), where("admin", "==", false));
    unsubFns.push(
      onSnapshot(
        userQuery,
        (snapshot) => dispatch(setTotalUsers(snapshot.size)),
        (error) => console.error("Users listener error:", error)
      )
    );

    // 🛡️ Admin users
    const adminQuery = query(collection(db, "users"), where("admin", "==", true));
    unsubFns.push(
      onSnapshot(
        adminQuery,
        (snapshot) => dispatch(setAdminUsers(snapshot.size)),
        (error) => console.error("Admin users listener error:", error)
      )
    );

    // 🎁 Products
    unsubFns.push(
      onSnapshot(
        collection(db, "products"),
        (snapshot) => dispatch(setTotalProducts(snapshot.size)),
        (error) => console.error("Products listener error:", error)
      )
    );

    // ✅ Success orders (admin only)
    unsubFns.push(
      onSnapshot(
        collection(db, "successOrders"),
        (snapshot) => dispatch(setSuccessOrders(snapshot.size)),
        (error) => console.error("Success orders listener error:", error)
      )
    );

    // ❌ Failed orders (admin only)
    unsubFns.push(
      onSnapshot(
        collection(db, "failedOrders"),
        (snapshot) => dispatch(setFailedOrders(snapshot.size)),
        (error) => console.error("Failed orders listener error:", error)
      )
    );

    // 🎟️ Discount codes (admin only)
    unsubFns.push(
      onSnapshot(
        collection(db, "discountCodes"),
        (snapshot) => dispatch(setDiscountCodes(snapshot.size)),
        (error) => console.error("Discount codes listener error:", error)
      )
    );

    // 📩 Mobile queries (admin only)
    unsubFns.push(
      onSnapshot(
        collection(db, "contactFormQueries"),
        (snapshot) => dispatch(setMobileQueries(snapshot.size)),
        (error) => console.error("Mobile queries listener error:", error)
      )
    );

    dispatch(setLoading(false));

    return () => {
      unsubFns.forEach((fn) => fn && fn());
      dispatch(resetDashboard());
    };
  }, [dispatch, isLoggedIn, user?.admin]);


  return (
    <div className="dashboard-container">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar
        barStatus={isOpen ? "active-menu" : "inactive-menu"}
        dashboard="active"
      />

      <section
        className={`mainsection ${collapsed ? "collapsed" : ""}`}>
        <div className="section">
          {/* 🛡️ Admin Users */}
          {loading ? (
            <MoneyCardSkeleton />
          ) : (
            <div
              className="money-card" onDoubleClick={() =>
                navigate("/users", { state: { userType: "admins" } })
              }
            >
              <div className="money-sub-card">
                <div className="money-info">
                  <p className="money-title">Admin Users</p>
                  <h2 className="money-amount">{adminUsers}</h2>
                </div>
                <div className="money-icon">
                  <i className="fa-solid fa-user-shield"></i>
                </div>
              </div>
              <p className="money-change">Verified admins</p>
            </div>
          )}

          {/* 🧍 Total Users */}
          {loading ? (
            <MoneyCardSkeleton />
          ) : (
            <div
              className="money-card" onDoubleClick={() =>
                navigate("/users", { state: { userType: "clients" } })
              }
            >
              <div className="money-sub-card">
                <div className="money-info">
                  <p className="money-title">Total Users</p>
                  <h2 className="money-amount">{totalUsers}</h2>
                </div>
                <div className="money-icon">
                  <i className="fa-solid fa-users"></i>
                </div>
              </div>
              <p className="money-change">Registered users</p>
            </div>
          )}

          {/* 🎁 Total Products */}
          {loading ? (
            <MoneyCardSkeleton />
          ) : (
            <div
              className="money-card" onDoubleClick={() => navigate("/products")}
            >
              <div className="money-sub-card">
                <div className="money-info">
                  <p className="money-title">Total Products</p>
                  <h2 className="money-amount">{totalProducts}</h2>
                </div>
                <div className="money-icon">
                  <i className="fa-solid fa-gift"></i>
                </div>
              </div>
              <p className="money-change">All handmade products</p>
            </div>
          )}
        </div>
        <div className="section">
          {/* ✅ Success Orders */}
          {loading ? (
            <MoneyCardSkeleton />
          ) : (
            <div className="money-card">
              <div className="money-sub-card">
                <div className="money-info">
                  <p className="money-title">Success Orders</p>
                  <h2 className="money-amount">{successOrders}</h2>
                </div>
                <div className="money-icon">
                  <i className="fa-solid fa-check-circle"></i>
                </div>
              </div>
              <p className="money-change">Completed successfully</p>
            </div>
          )}

          {/* ❌ Failed Orders */}
          {loading ? (
            <MoneyCardSkeleton />
          ) : (
            <div className="money-card">
              <div className="money-sub-card">
                <div className="money-info">
                  <p className="money-title">Failed Orders</p>
                  <h2 className="money-amount">{failedOrders}</h2>
                </div>
                <div className="money-icon">
                  <i className="fa-solid fa-xmark-circle"></i>
                </div>
              </div>
              <p className="money-change">Payment or delivery issues</p>
            </div>
          )}

          {/* 🎟️ Discount Codes */}
          {loading ? (
            <MoneyCardSkeleton />
          ) : (
            <div className="money-card">
              <div className="money-sub-card">
                <div className="money-info">
                  <p className="money-title">Discount Codes</p>
                  <h2 className="money-amount">{discountCodes}</h2>
                </div>
                <div className="money-icon">
                  <i className="fa-solid fa-tags"></i>
                </div>
              </div>
              <p className="money-change">Active promotional codes</p>
            </div>
          )}

          {/* 📩 Mobile Queries */}
          {loading ? (
            <MoneyCardSkeleton />
          ) : (
            <div
              className="money-card" onDoubleClick={() => navigate("/queries")}
            >
              <div className="money-sub-card">
                <div className="money-info">
                  <p className="money-title">Customer Queries</p>
                  <h2 className="money-amount">{mobileQueries}</h2>
                </div>
                <div className="money-icon">
                  <i className="fa-solid fa-envelope"></i>
                </div>
              </div>
              <p className="money-change">Messages from app</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;
