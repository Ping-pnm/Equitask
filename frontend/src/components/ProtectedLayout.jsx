import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

import HeaderBar from "./HeaderBar";
import Sidebar from "./Sidebar";
import TabHeader from "./TabHeader";

export default function ProtectedLayout() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return (
        <div className="homepage-body">
            <div className="layout-container">
                <HeaderBar />

                {/* Bottom layer: Sidebar + Main */}
                <div className="content-wrapper">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Content */}
                    <main className="main-content">
                        {/* Tabs Navbar */}
                        <TabHeader activeAt='Stream' />

                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}