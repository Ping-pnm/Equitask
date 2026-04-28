import AttachmentDisplay from "../AttachmentDisplay";

export default function Announcement({ author, date, content, files = [], onDelete, canDelete, onDeleteFile, currentUserId, creatorId }) {
    const isCreator = currentUserId === creatorId;

    return (
        <div className="announcement-card" style={{ position: 'relative' }}>
            <div className="announcement-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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

                {canDelete && (
                    <button
                        onClick={onDelete}
                        title="Delete Announcement"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#999',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#ff4d4d'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
                )}
            </div>
            <div className="announcement-body">
                <p>{content}</p>
            </div>

            <AttachmentDisplay 
                files={files} 
                onDelete={isCreator ? (idx) => onDeleteFile(files[idx].fileId) : null} 
            />
        </div>
    );
}
