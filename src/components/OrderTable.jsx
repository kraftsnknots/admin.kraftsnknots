// src/components/OrdersTable.jsx

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  collection,
  onSnapshot,
  query,
  doc,
  updateDoc,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { FiFileText } from "react-icons/fi";
import Swal from "sweetalert2";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import caretDown from "../assets/icons/caret-down-fill.svg";
import Pagination from "react-bootstrap/Pagination";
import { setOrders } from "../features/ordersSlice";
import "./styles/OrderTable.css";

const storage = getStorage();

const OrdersTable = ({ orderType }) => {
  const dispatch = useDispatch();
  

  const { allOrders, loading } = useSelector(
    (state) => state.orders
  );

  const [updatingStatus, setUpdatingStatus] = useState(null);

  // 🔥 Pagination states
  const ORDERS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  // 🔥 Search
  const [searchTerm, setSearchTerm] = useState("");

  // =====================================================
  // 1. REAL-TIME ORDERS FROM FIRESTORE
  // =====================================================
  useEffect(() => {
    const q = query(
      collection(db, "successOrders"),
      orderBy("createdAt", "desc"),
      limit(2000) // Optional: cap limit to avoid unnecessary load
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const ordersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      dispatch(setOrders(ordersList));
    });

    return () => unsub();
  }, [dispatch]);

  // =====================================================
  // 2. FILTER BY ORDER TYPE (processing, delivered, cancelled)
  // =====================================================
  const filteredOrders = useMemo(() => {
    if (!orderType) return allOrders;
    return allOrders.filter(
      (order) => order.status?.toLowerCase() === orderType.toLowerCase()
    );
  }, [allOrders, orderType]);

  // =====================================================
  // 3. SEARCH FILTER
  // =====================================================
  const searchedOrders = useMemo(() => {
    if (!searchTerm.trim()) return filteredOrders;

    const s = searchTerm.toLowerCase();

    return filteredOrders.filter((order) => {
      return (
        order.orderNumber?.toString().includes(s) ||
        order.customerInfo?.name?.toLowerCase().includes(s) ||
        order.customerInfo?.email?.toLowerCase().includes(s) ||
        order.customerInfo?.phone?.toLowerCase().includes(s) ||
        order.total?.toString().includes(s)
      );
    });
  }, [filteredOrders, searchTerm]);

  // =====================================================
  // 4. PAGINATION LOGIC
  // =====================================================
  const totalPages = Math.ceil(searchedOrders.length / ORDERS_PER_PAGE);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ORDERS_PER_PAGE;
    const end = start + ORDERS_PER_PAGE;
    return searchedOrders.slice(start, end);
  }, [searchedOrders, currentPage]);

  // Reset to page 1 on search/filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, orderType]);

  // =====================================================
  // 5. VIEW INVOICE
  // =====================================================
  const handleViewInvoice = async (invoiceUrl) => {
    try {
      if (!invoiceUrl) return;

      const fileRef = ref(storage, invoiceUrl);
      const secureUrl = await getDownloadURL(fileRef);
      window.open(secureUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error fetching invoice URL:", error);
      Swal.fire({
        icon: "error",
        title: "Unable to Load Invoice",
        text: "This file requires authentication. Please try again.",
        confirmButtonColor: "#000",
      });
    }
  };

  // =====================================================
  // 6. UPDATE ORDER STATUS (Admin)
  // =====================================================
  const updateOrderStatus = async (order, newStatus) => {
    if (order.status === newStatus) return;

    if (order.status === "delivered") {
      Swal.fire({
        icon: "info",
        title: "Locked",
        text: "Delivered orders cannot be updated.",
        confirmButtonColor: "#000",
      });
      return;
    }

    if (newStatus === "delivered") {
      const confirm = await Swal.fire({
        title: "Mark Order as Delivered?",
        text: "Once marked, you cannot change it again.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#16a34a",
        cancelButtonColor: "#d33",
      });

      if (!confirm.isConfirmed) return;
    }

    setUpdatingStatus(order.orderNumber);

    try {
      await updateDoc(doc(db, "successOrders", order.orderNumber), {
        status: newStatus,
        updatedAt: new Date(),
      });

      Swal.fire({
        icon: "success",
        title: "Updated",
        text: `Order marked as ${newStatus}`,
        confirmButtonColor: "#000",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Unable to update status. Try again later.",
        confirmButtonColor: "#000",
      });
    }

    setUpdatingStatus(null);
  };

  // =====================================================
  // 7. RENDER UI
  // =====================================================
  return (
    <div className="orders-table-container">

      {/* 🔍 SEARCH BAR */}
      <div className="orders-search-bar">
        <input
          type="text"
          placeholder="Search by order number, name, email, phone, total..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="orders-table">
        <thead>
          <tr>
            <th></th>
            <th>Order No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Date & Time</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedOrders.length === 0 ? (
            <tr>
              <td colSpan="10" className="no-orders">
                {loading
                  ? "Loading orders..."
                  : `No ${orderType || ""} orders found.`}
              </td>
            </tr>
          ) : (
            paginatedOrders.map((order) => {
              const created =
                order.createdAt?.seconds
                  ? new Date(order.createdAt.seconds * 1000)
                  : new Date();

              const formattedDate = created.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
              });

              const formattedTime = created.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              });

              return (
                <tr key={order.id}>
                  <td>
                    {order.sentFrom === "app" ? "📱" : "🌐"}
                  </td>

                  <td>{order.orderNumber || "-"}</td>
                  <td>{order.customerInfo?.name || "-"}</td>
                  <td>{order.customerInfo?.email || "-"}</td>
                  <td>{order.customerInfo?.phone || "-"}</td>

                  <td>₹{order.total?.toFixed(2) || "0.00"}</td>

                  <td>
                    <span
                      className={`status-chip ${order.payment?.status === "success" ||
                          order.payment?.status === "refunded"
                          ? "delivered"
                          : order.payment?.status === "failed"
                            ? "cancelled"
                            : "pending"
                        }`}
                    >
                      {order.payment?.status || "pending"}
                    </span>
                  </td>

                  <td>
                    {order.status === "delivered" ? (
                      <span className="status-chip delivered">delivered</span>
                    ) : (
                      <div className="status-dropdown">
                        <button className={`status-btn ${order.status}`}>
                          {updatingStatus === order.orderNumber ? (
                            <div className="spinner" />
                          ) : (
                            <span className="order-status">
                              {order.status} <img src={caretDown} />
                            </span>
                          )}
                        </button>

                        <div className="dropdown-content">
                          {["processing", "delivered", "cancelled"].map(
                            (status) => (
                              <div
                                key={status}
                                className="dropdown-item"
                                onClick={() =>
                                  updateOrderStatus(order, status)
                                }
                              >
                                {status}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </td>

                  <td>
                    {formattedDate} @ {formattedTime}
                  </td>

                  <td className="actions-cell">
                    {order.invoiceUrl ? (
                      <button
                        onClick={() => handleViewInvoice(order.invoiceUrl)}
                        className="invoice-btn"
                        title="View Invoice"
                      >
                        <FiFileText className="action-icon" />
                      </button>
                    ) : (
                      <FiFileText className="action-icon disabled" />
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* PAGINATION */}
      <Pagination className="justify-content-center mt-4">
        <Pagination.First
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(1)}
        />

        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        />

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Pagination.Item>
        ))}

        <Pagination.Next
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((p) => Math.min(totalPages, p + 1))
          }
        />

        <Pagination.Last
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(totalPages)}
        />
      </Pagination>
    </div>
  );
};

export default OrdersTable;
