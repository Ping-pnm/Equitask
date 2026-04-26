import { Link } from 'react-router-dom';

export default function TabHeader({ activeAt }) {
    return (
        <header className="top-nav">
            <nav className="tabs">
                <Link to="/" className={`tab-item ${activeAt === "Stream" ? "active" : ""}`}>Stream</Link>
                <Link to="/classwork" className={`tab-item ${activeAt === "Work" ? "active" : ""}`}>Work</Link>
                <Link to="/people" className={`tab-item ${activeAt === "People" ? "active" : ""}`}>People</Link>
                <Link to="/dashboard" className={`tab-item ${activeAt === "Dashboard" ? "active" : ""}`}>Dashboard</Link>
            </nav>
        </header>
    );
}