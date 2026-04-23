

export default function TabHeader({ activeAt }) {
    return (
        <header className="top-nav">
            <nav className="tabs">
                <a href="homepage.html" className={`tab-item ${activeAt === "Stream" ? "active" : ""}`}>Stream</a>
                <a href="classwork.html" className={`tab-item ${activeAt === "Work" ? "active" : ""}`}>Work</a>
                <a href="people.html" className={`tab-item ${activeAt === "People" ? "active" : ""}`}>People</a>
                <a href="dashboard.html" className={`tab-item ${activeAt === "Dashboard" ? "active" : ""}`}>Dashboard</a>
            </nav>
        </header>
    );
}