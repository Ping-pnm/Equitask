export default function Announcement({ author, date, content, files = [] }) {
    return (
        <div className="announcement-card">
            <div className="announcement-header">
                <div className="profile-wrapper">
                    {/* Custom SVG Profile Icon */}
                    <svg viewBox="0 0 24 24" className="profile-svg">
                        <circle cx="12" cy="12" r="12" fill="#e8eaed" />
                        <circle cx="12" cy="8" r="4" fill="#5f6368" />
                        <path d="M12 13c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z" fill="#5f6368" />
                    </svg>
                </div>
                <div className="author-info">
                    <h3 className="author-name">{author}</h3>
                    <p className="post-date">{date}</p>
                </div>
            </div>
            <div className="announcement-body">
                <p>{content}</p>
            </div>

            {/* File Attachments Display */}
            {files.length > 0 && (
                <div className="announcement-attachments">
                    {files.map((file, index) => (
                        <a
                            key={index}
                            href={`http://localhost:3000/${file.fileUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="attachment-pill"
                        >
                            <span className="attachment-name">
                                {file.fileUrl.split('-').slice(1).join('-') || 'Attachment'}
                            </span>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
