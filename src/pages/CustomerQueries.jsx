import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../config/firebase";
import "./styles/Products.css"; // ✅ reuse table + layout styles
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import ProductSkeleton from "../components/ProductSkeleton"; // shimmer loader

export default function CustomerQueries() {
  const [isOpen, setIsOpen] = useState(false);
  const [queries, setQueries] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Most Recent");
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // 🔥 Fetch Queries from Firestore
  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const q = query(collection(db, "mobileAppContactFormQueries"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const queryList = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "Unknown",
            email: data.email || "N/A",
            phone: data.phone || "-",
            message: data.message || "No message provided",
            userId: data.userId || "-",
            createdAt: data.createdAt?.toDate
              ? data.createdAt.toDate().toLocaleString()
              : "",
          };
        });

        setQueries(queryList);
      } catch (error) {
        console.error("Error fetching customer queries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  const handleDelete = (id) => alert(`Delete query ${id}`);
  const handleView = (id) => alert(`View full query ${id}`);

  // 🔍 Filter + Sort
  const filtered = queries
    .filter((q) =>
      q.name.toLowerCase().includes(search.toLowerCase().trim()) ||
      q.email.toLowerCase().includes(search.toLowerCase().trim()) ||
      q.phone.toLowerCase().includes(search.toLowerCase().trim())
    )
    .sort((a, b) => {
      switch (sort) {
        case "Oldest First":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "Most Recent":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  // 💫 Shimmer while loading
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
      <Header toggleSidebar={toggleSidebar} />
      <div className="sidebar-mainsection">
        <Sidebar
          barStatus={isOpen ? "active-menu" : ""}
          customerQueries="active"
        />
        <section className="mainsection">
          <div className="section tables-section">
            <div className="top-bar">
              <input style={{width:'100%'}}
                type="text"
                placeholder="🔍 Search by name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <table className="product-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Message</th>
                  <th>User ID</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((q, i) => (
                  <React.Fragment key={q.id}>
                    <tr
                      onMouseEnter={() => setHovered(q.id)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <td>{String(i + 1).padStart(2, "0")}</td>
                      <td>{q.name}</td>
                      <td>{q.email}</td>
                      <td>{q.phone}</td>
                      <td className="truncate-text">
                        {q.message.length > 25
                          ? q.message.substring(0, 25) + "..."
                          : q.message}
                      </td>
                      <td>{q.userId}</td>
                      <td>{q.createdAt}</td>
                      <td className="actions">
                        <button onClick={() => handleView(q.id)}>👁️</button>
                        <button onClick={() => handleDelete(q.id)}>🗑️</button>
                      </td>
                    </tr>

                    {/* Hover card for details */}
                    {hovered === q.id && (
                      <div className="hover-card-cell">
                        <div className="hover-card">
                          <h4>{q.name}</h4>
                          <p>
                            <strong>Email:</strong> {q.email}
                          </p>
                          <p>
                            <strong>Phone:</strong> {q.phone}
                          </p>
                          <p>
                            <strong>User ID:</strong> {q.userId}
                          </p>
                          <p>
                            <strong>Message:</strong> {q.message}
                          </p>
                          <p>
                            <strong>Created:</strong> {q.createdAt}
                          </p>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
