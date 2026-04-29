import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

import HeaderBar from "./HeaderBar";
import Sidebar from "./Sidebar";
import TabHeader from "./TabHeader";

export default function ProtectedLayout() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    useEffect(() => {
        document.body.classList.add('homepage-body');
        return () => document.body.classList.remove('homepage-body');
    }, []);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return (
        <div className="layout-container">
            <HeaderBar />

            {/* Bottom layer: Sidebar + Main */}
            <div className="content-wrapper">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <main className="main-content">
                    {/* Tabs Navbar */}
                    <TabHeader />

                    <Outlet />
                </main>
            </div>
        </div>
    );
}