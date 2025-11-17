import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { collection, query, orderBy, onSnapshot, where, doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import "./styles/Products.css";
import "./styles/CustomerQueries.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import ProductSkeleton from "../components/ProductSkeleton";
import { useSidebar } from "../context/SidebarContext";
import Swal from "sweetalert2";
import Details from "../assets/icons/details.png";
import TopBar from "../components/TopBar";
import {
  setQueries,
  setSearch,
  setSort,
  toggleSelect,
  toggleSelectAll,
  setSelectedQuery,
  deleteQueries,
  replyToQuery
} from "../features/queriesSlice";
import { toggleSidebar as toggleSidebarAction } from "../features/uiSlice";

export default function CustomerQueries() {
  const dispatch = useDispatch();
  const { collapsed } = useSidebar();
  const [adminReplyText, setAdminReplyText] = useState("");


  // Redux state
  const {
    queries,
    loading,
    search,
    sort,
    selectedIds,
    selectAll,
    selectedQuery,
  } = useSelector((state) => state.queries);
  const { isOpen } = useSelector((state) => state.ui);

  // 🔥 Fetch Queries with real-time listener
  useEffect(() => {
    const q = query(
      collection(db, "contactFormQueries"),
      where("deleted", "==", 0),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const queryList = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
          status: data.status,
          deleted: data.deleted,
          sentFrom: data.sentFrom,
          adminReply: data.adminReply || "",
          createdAt: data.createdAt?.toDate
            ? (() => {
              const date = data.createdAt.toDate();
              const datePart = date.toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              });
              const timePart = date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              });
              return `${datePart} @ ${timePart}`;
            })()
            : "",
        };
      });

      // Filter out deleted ones before setting state
      dispatch(setQueries(queryList.filter((q) => q.deleted !== 1)));
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [dispatch]);

  // ✅ Handle delete (single or multiple)
  const handleDelete = async (ids) => {
    if (!ids.length) return;

    const result = await Swal.fire({
      title:
        ids.length > 1
          ? `Delete ${ids.length} selected queries?`
          : "Delete this query?",
      text: `Deletion is permanent, it can't be restored later..`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
    });

    if (result.isConfirmed) {
      dispatch(deleteQueries(ids));
    }
  };

  // ✅ Handle single view
  const handleView = (query) => {
    dispatch(setSelectedQuery(query));
    setAdminReplyText(""); // reset textarea
  };
  const closeModal = () => dispatch(setSelectedQuery(null));

  // 🔍 Filter + Sort
  const filtered = queries
    .filter((q) => {
      try {
        const name = (q?.name || "").toString().toLowerCase();
        const email = (q?.email || "").toString().toLowerCase();
        const phone = (q?.phone || "").toString().toLowerCase();
        const searchText = (search || "").toLowerCase().trim();

        return (
          name.includes(searchText) ||
          email.includes(searchText) ||
          phone.includes(searchText)
        );
      } catch (error) {
        console.error("Filter error for query:", q, error);
        return false;
      }
    })
    .sort((a, b) => {
      try {
        switch (sort) {
          case "Oldest First":
            return new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0);
          default:
            return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
        }
      } catch (error) {
        console.error("Sort error:", error);
        return 0;
      }
    });

  // 💫 Shimmer
  if (loading) {
    return (
      <div className="loading-shimmer">
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{ marginBottom: "10px" }}>
            <ProductSkeleton />
          </div>
        ))}
      </div>
    );
  }


  return (
    <div className="products-container">
      <Header toggleSidebar={() => dispatch(toggleSidebarAction())} />
      <Sidebar
        barStatus={isOpen ? "active-menu" : "inactive-menu"}
        customerQueries="active"
      />

      <section className={`mainsection ${collapsed ? "collapsed" : ""}`}>
        <div className="tables-section">
          <TopBar
            search={search}
            inpchange={(e) => dispatch(setSearch(e.target.value))}
            sort={sort}
            selchange={(e) => dispatch(setSort(e.target.value))}
            delete={() => handleDelete(selectedIds)}
            length={selectedIds.length}
            addwidth="20%"
            delwidth="25%"
            data={selectedIds.length}
            display="none"
            page="queries"
            searchBy="🔍 Search by name, email, or phone..."
          />
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
                  <th>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={() =>
                        dispatch(toggleSelectAll(filtered.map((q) => q.id)))
                      }
                    />
                  </th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Received At</th>
                  <th>Replied Status</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="no-orders">
                      No matching item found..
                    </td>
                  </tr>
                ) : (<>

                  {filtered.map((q) => (
                    <tr key={q.id}>
                      <td>
                        {q.sentFrom === 'app' ?
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-phone-vibrate-fill" viewBox="0 0 16 16">
                            <path d="M4 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm5 7a1 1 0 1 0-2 0 1 1 0 0 0 2 0M1.807 4.734a.5.5 0 1 0-.884-.468A8 8 0 0 0 0 8c0 1.347.334 2.618.923 3.734a.5.5 0 1 0 .884-.468A7 7 0 0 1 1 8c0-1.18.292-2.292.807-3.266m13.27-.468a.5.5 0 0 0-.884.468C14.708 5.708 15 6.819 15 8c0 1.18-.292 2.292-.807 3.266a.5.5 0 0 0 .884.468A8 8 0 0 0 16 8a8 8 0 0 0-.923-3.734M3.34 6.182a.5.5 0 1 0-.93-.364A6 6 0 0 0 2 8c0 .769.145 1.505.41 2.182a.5.5 0 1 0 .93-.364A5 5 0 0 1 3 8c0-.642.12-1.255.34-1.818m10.25-.364a.5.5 0 0 0-.93.364c.22.563.34 1.176.34 1.818s-.12 1.255-.34 1.818a.5.5 0 0 0 .93.364C13.856 9.505 14 8.769 14 8s-.145-1.505-.41-2.182" />
                          </svg>
                          :
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-globe" viewBox="0 0 16 16">
                            <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z" />
                          </svg>
                        }
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(q.id)}
                          onChange={() => dispatch(toggleSelect(q.id))}
                        />
                      </td>
                      <td>{q.name}</td>
                      <td>{q.email}</td>
                      <td>{q.phone}</td>
                      <td>{q.createdAt}</td>
                      <td style={{ textTransform: 'capitalize' }}>
                        <span
                          className={`status-chip ${q.status === 'replied' ? "replied" : "pending"}`}
                        >
                          {q.status === 'replied' ? "replied" : "pending"}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          onClick={() => handleView(q)}
                          className="query-view-btn"
                        >
                          <img src={Details} alt="👁️" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Footer />

      {/* 💬 Modal for Full Query */}
      {/* 💬 Modal for Full Query */}
      {selectedQuery && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            {/* Top — Title */}
            <div className="section-top">
              <h2>Customer Query</h2>
            </div>

            <div className="section-modal">
              <div className="section-left">
                <table className="query-details-table">
                  <tbody>
                    <tr><td><strong>Name:</strong></td><td>{selectedQuery.name}</td></tr>
                    <tr><td><strong>Email:</strong></td><td>{selectedQuery.email}</td></tr>
                    <tr><td><strong>Phone:</strong></td><td>{selectedQuery.phone}</td></tr>
                    <tr><td><strong>Received At:</strong></td><td>{selectedQuery.createdAt}</td></tr>
                    <tr>
                      <td><strong>Status:</strong></td>
                      <td style={{
                        textTransform: "capitalize",
                        color: selectedQuery.status === "pending" ? "red" : "green"
                      }}>
                        {selectedQuery.status}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Right side */}
              <div className="section-right">
                <p style={{ paddingLeft: 10 }}>
                  <strong>Message:</strong>
                </p>
                <p className="modal-message-box">{selectedQuery.message}</p>
              </div>
            </div>

            {/* reply or show reply */}
            <div className="section-modal">
              {selectedQuery.status === "pending" ? (
                <div className="section-bottom">
                  <p><small>Reply:</small></p>

                  <textarea
                    className="reply-text"
                    id="adminReplyInput"
                    placeholder="Type your reply..."
                  ></textarea>
                </div>
              ) : (
                <div className="section-bottom">
                  <p><small>Replied:</small></p>
                  <p className="modal-message-box">{selectedQuery.adminReply}</p>
                </div>
              )}
            </div>

            {/* Buttons */}
            {selectedQuery.status === "pending" && (
              <button
                className="button-85"
                role="button"
                onClick={() => {
                  const replyText = document.getElementById("adminReplyInput").value.trim();
                  if (!replyText) return Swal.fire("Empty", "Reply cannot be empty.", "warning");

                  dispatch(
                    replyToQuery({
                      id: selectedQuery.id,
                      replyText,
                    })
                  );
                }}
              >
                Send Reply
              </button>
            )}

            <button className="button-86" role="button" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
