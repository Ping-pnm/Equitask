import { Outlet } from "react-router-dom";
import { AuthProvider } from "./AuthContext";


export default function RootLayout() {
    return (
        <AuthProvider>
            <Outlet />
        </AuthProvider>
    );
}