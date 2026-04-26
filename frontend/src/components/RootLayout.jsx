import { Outlet } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { ClassProvider } from "./ClassContext";


export default function RootLayout() {
    return (
        <AuthProvider>
            <ClassProvider>
                <Outlet />
            </ClassProvider>
        </AuthProvider>
    );
}