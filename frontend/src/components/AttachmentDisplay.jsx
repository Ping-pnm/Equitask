export default function AttachmentDisplay({ files = [], onDelete }) {
    if (!Array.isArray(files) || files.length === 0) return null;

    return (
        <div className="announcement-attachments">
            {files.map((file, index) => {
                const isLocal = file instanceof File;
                const fileUrl = file.fileUrl || '';
                const fileName = isLocal ? file.name : (fileUrl.split('-').slice(1).join('-') || 'Attachment');
                const href = isLocal ? URL.createObjectURL(file) : `http://localhost:3000/${fileUrl}`;

                return (
                    <div key={index} className="attachment-pill">
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="attachment-link"
                        >
                            <span className="attachment-name">
                                {fileName}
                            </span>
                        </a>
                        <button
                            type="button"
                            className="btn-delete-file"
                            onClick={() => onDelete(index)}
                            aria-label="Delete attachment"
                        >
                            &times;
                        </button>
                    </div>
                );
            })}
        </div>
    )
}