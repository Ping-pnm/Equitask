export default function AttachmentDisplay({ files = [], onDelete }) {
    if (!Array.isArray(files) || files.length === 0) return null;

    return (
        <div className="announcement-attachments">
            {files.map((file, index) => {
                if (!file) return null;
                
                // Determine if it's a local File object or a server file object
                const isLocal = file instanceof File;
                const fileUrl = file.fileUrl;
                const fileName = file.name || file.fileName || (fileUrl ? fileUrl.split('/').pop() : 'Attachment');
                
                let href = '#';
                try {
                    if (isLocal) {
                        href = URL.createObjectURL(file);
                    } else if (fileUrl) {
                        href = fileUrl.startsWith('http') ? fileUrl : `http://localhost:3000/${fileUrl}`;
                    }
                } catch (e) {
                    console.error("URL generation error:", e);
                }

                return (
                    <div key={index} className="attachment-pill">
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="attachment-link"
                            title={fileName}
                        >
                            <div className="attachment-icon-wrapper">
                                <span className="attachment-icon">📄</span>
                            </div>
                            <div className="attachment-text">
                                <span className="attachment-name">
                                    {fileName}
                                </span>
                                <span className="attachment-subtitle">
                                    Attached File
                                </span>
                            </div>
                        </a>
                        {onDelete && (
                            <button
                                type="button"
                                className="attachment-delete"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onDelete(index);
                                }}
                                title="Remove attachment"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
}