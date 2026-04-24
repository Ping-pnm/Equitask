import uploadIcon from '../../assets/UploadSign.png';
import linkIcon from '../../assets/LinkSign.png';

export default function ComposeModal({ onClose }) {
    const handlePost = (e) => {
        e.preventDefault();
        // Add your post logic here
        console.log("Posting content...");
        if (onClose) onClose();
    };

    return (
        <div id="modal-compose" className="modal-overlay" onClick={onClose}>
            <div className="modal-content compose-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Post</h2>
                <form id="form-compose" onSubmit={handlePost}>
                    <div className="compose-area">
                        <textarea id="post-content" placeholder="Announce something to your class" required></textarea>
                    </div>
                    <div className="modal-actions compose-actions">
                        <div className="compose-icons">
                            <input type="file" id="file-upload" style={{ display: 'none' }} />
                            <button type="button" className="icon-btn tool-btn"
                                onClick={() => document.getElementById('file-upload').click()}>
                                <img src={uploadIcon} alt="Upload" />
                            </button>
                            <button type="button" className="icon-btn tool-btn">
                                <img src={linkIcon} alt="Link" />
                            </button>
                        </div>
                        <div className="compose-btns">
                            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn-submit btn-post">Post</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}