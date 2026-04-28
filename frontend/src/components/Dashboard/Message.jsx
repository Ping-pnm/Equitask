export default function Message({ name, date, time, text }) {
    return (
        <div className="extracted-style-75">
            <div className="extracted-style-76">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </div>
            <div className="extracted-style-77">
                <div className="extracted-style-78">
                    <span className="extracted-style-79">{name}</span>
                    <span className="extracted-style-80">{date}<br />{time}</span>
                </div>
                <span className="extracted-style-81">{text}</span>
            </div>
        </div>
    );
}
