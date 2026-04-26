export default function MessagePopup({ theme, children, onClose }) {
    if (!children) return null;

    return (
        <div className="modal-overlay top-aligned">
            <div
                className={`message-modal-card ${theme === 'green' ? 'success' : 'error'}`}
            >
                <div className="modal-icon-circle">
                    {theme === 'green' ? '✓' : '!'}
                </div>
                <div className="modal-message-content">
                    {children}
                </div>
                <button className="modal-close-btn" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
}