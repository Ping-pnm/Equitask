import { Link, useLocation } from 'react-router-dom';

export default function TabHeader() {
    const location = useLocation();

    return (
        <header className="top-nav">
            <nav className="tabs">
                <Link to="/" className={`tab-item ${location.pathname === "/" ? "active" : ""}`}>Stream</Link>
                <Link to="/classwork" className={`tab-item ${location.pathname === "/classwork" ? "active" : ""}`}>Work</Link>
                <Link to="/people" className={`tab-item ${location.pathname === "/people" ? "active" : ""}`}>People</Link>
                <Link to="/dashboard" className={`tab-item ${location.pathname === "/dashboard" ? "active" : ""}`}>Dashboard</Link>
            </nav>
        </header>
    );
}