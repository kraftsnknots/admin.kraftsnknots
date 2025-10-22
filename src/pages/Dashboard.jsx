import React, { useState } from "react";
import "../styles/Dashboard.css";
import Sidebar from "./Sidebar";
import Header from "../components/Header";

const Dashboard = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <div className="dashboard-container">

            {/* Main Content */}
            <main className="main-content">
                <Header toggleSidebar={toggleSidebar} />
                <div style={{ display: 'flex' }}>
                    <Sidebar barStatus={isOpen ? 'active-menu' : 'inactive-menu'} />
                    <section className="content">
                        <div className="card">
                            <h3>New Appointments</h3>
                            <hr />
                        </div>
                        <div className="card">
                            <h3>All Appointments</h3>
                            <hr />
                        </div>
                    </section>
                </div>

                <footer className="footer">
                    © Ujaas Aroma Inc. All rights reserved 2026.
                </footer>
            </main>
        </div>
    );
};

export default Dashboard;
