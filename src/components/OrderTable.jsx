// src/components/OrdersTable.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { collection, onSnapshot, query, doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { FiFileText } from "react-icons/fi";
import Swal from "sweetalert2";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import caretDown from "../assets/icons/caret-down-fill.svg";

const storage = getStorage();

import {
  setOrders,
  toggleSelectOrder,
  toggleSelectAllOrders,
} from "../features/ordersSlice";

import "./styles/OrderTable.css";

const OrdersTable = ({ orderType }) => {
  const dispatch = useDispatch();

  const { allOrders, loading, selectedOrderIds, selectAll } = useSelector(
    (state) => state.orders
  );
  const [updatingStatus, setUpdatingStatus] = useState(null); // orderNumber that is updating

  // 🔥 Real-time listener
  useEffect(() => {
    const q = query(collection(db, "successOrders"));
    const unsub = onSnapshot(q, (snapshot) => {
      const ordersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setOrders(ordersList));
    });

    return () => unsub();
  }, [dispatch]);

  // 🔍 Filter orders
  const filteredOrders = useMemo(() => {
    if (!orderType) return allOrders;
    return allOrders.filter(
      (order) => order.status?.toLowerCase() === orderType.toLowerCase()
    );
  }, [allOrders, orderType]);

  // 📄 View Invoice
  const handleViewInvoice = async (invoiceUrl) => {
    try {
      if (!invoiceUrl) return;

      // 🔥 Create a Storage reference from the stored path
      const fileRef = ref(storage, invoiceUrl);

      // 🔥 This automatically applies Firebase authentication tokens
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

  // 📌 Update Order Status (Admin only)
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
        text: "Once marked as Delivered, you will not be able to change the status again.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "I am Sure..",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#16a34a",
        cancelButtonColor: "#d33",
      });

      if (!confirm.isConfirmed) {
        return; // user cancelled
      }
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

  return (
    <div className="orders-table-container">
      <table className="orders-table">
        <thead>
          <tr>
            <th>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send-check-fill" viewBox="0 0 16 16">
                <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 1.59 2.498C8 14 8 13 8 12.5a4.5 4.5 0 0 1 5.026-4.47zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
                <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-1.993-1.679a.5.5 0 0 0-.686.172l-1.17 1.95-.547-.547a.5.5 0 0 0-.708.708l.774.773a.75.75 0 0 0 1.174-.144l1.335-2.226a.5.5 0 0 0-.172-.686" />
              </svg>
            </th>
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
          {filteredOrders.length === 0 ? (
            <tr>
              <td colSpan="10" className="no-orders">
                {loading
                  ? "Loading orders..."
                  : `No ${orderType || ""} orders found.`}
              </td>
            </tr>
          ) : (
            filteredOrders.map((order) => {
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
                    {order.sentFrom === 'app' || order.source === 'app' ?
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-phone-vibrate-fill" viewBox="0 0 16 16">
                        <path d="M4 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm5 7a1 1 0 1 0-2 0 1 1 0 0 0 2 0M1.807 4.734a.5.5 0 1 0-.884-.468A8 8 0 0 0 0 8c0 1.347.334 2.618.923 3.734a.5.5 0 1 0 .884-.468A7 7 0 0 1 1 8c0-1.18.292-2.292.807-3.266m13.27-.468a.5.5 0 0 0-.884.468C14.708 5.708 15 6.819 15 8c0 1.18-.292 2.292-.807 3.266a.5.5 0 0 0 .884.468A8 8 0 0 0 16 8a8 8 0 0 0-.923-3.734M3.34 6.182a.5.5 0 1 0-.93-.364A6 6 0 0 0 2 8c0 .769.145 1.505.41 2.182a.5.5 0 1 0 .93-.364A5 5 0 0 1 3 8c0-.642.12-1.255.34-1.818m10.25-.364a.5.5 0 0 0-.93.364c.22.563.34 1.176.34 1.818s-.12 1.255-.34 1.818a.5.5 0 0 0 .93.364C13.856 9.505 14 8.769 14 8s-.145-1.505-.41-2.182" />
                      </svg>
                      :
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-globe" viewBox="0 0 16 16">
                        <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z" />
                      </svg>
                    }
                  </td>
                  <td>{order.orderNumber || "-"}</td>
                  <td>{order.customerInfo?.name || "-"}</td>
                  <td>{order.customerInfo?.email || "-"}</td>
                  <td>{order.customerInfo?.phone || "-"}</td>

                  <td>₹{order.total?.toFixed(2) || "0.00"}</td>

                  <td>
                    <span
                      className={`status-chip ${order.payment?.status === "success" || order.payment?.status === "refunded"
                        ? "delivered"
                        : order.payment?.status === "failed"
                          ? "cancelled"
                          : "pending"
                        }`}
                    >
                      {order.payment?.status || "pending"}
                    </span>
                  </td>

                  {/* STATUS + ADMIN DROPDOWN */}
                  <td>
                    {order.status === "delivered" ? (
                      // 🔒 Delivered is locked
                      <span className="status-chip delivered">delivered</span>
                    ) : (
                      <div className="status-dropdown">
                        <button className={`status-btn ${order.status}`}>
                          {updatingStatus === order.orderNumber ? (
                            <div className="spinner" />
                          ) : (
                            <span className="order-status">{order.status} <img src={caretDown} /></span>
                          )}
                        </button>

                        <div className="dropdown-content">
                          <div
                            className="dropdown-item"
                            onClick={() => updateOrderStatus(order, "processing")}
                          >
                            Processing
                          </div>
                          <div
                            className="dropdown-item"
                            onClick={() => updateOrderStatus(order, "delivered")}
                          >
                            Delivered
                          </div>
                          <div
                            className="dropdown-item"
                            onClick={() => updateOrderStatus(order, "cancelled")}
                          >
                            Cancelled
                          </div>
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
    </div>
  );
};

export default OrdersTable;
