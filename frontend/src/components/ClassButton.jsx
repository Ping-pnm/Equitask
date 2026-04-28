export default function ClassButton({ onClick, isActive, title, section, subject }) {
    return (
        <li>
            <a href="#" onClick={onClick} className={"class-item " + (isActive ? "active" : "")}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: isActive ? '700' : '600' }}>{title}</span>
                    <span style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>
                        {subject ? `${subject} - ` : ''}section {section}
                    </span>
                </div>
            </a>
        </li>
    );
}