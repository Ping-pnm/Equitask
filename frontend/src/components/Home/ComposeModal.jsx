import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../AuthContext';
import { useClass } from '../ClassContext';
import { postAnnouncement } from '../../services/classService';
import uploadIcon from '../../assets/UploadSign.png';
import linkIcon from '../../assets/LinkSign.png';

export default function ComposeModal({ fetchFeeds, onClose }) {
    const { userId } = useAuth();
    const { activeClassId } = useClass();
    const [content, setContent] = useState("");

    const handlePost = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            const response = await postAnnouncement(content, userId, activeClassId);

            if (response) {
                if (fetchFeeds) fetchFeeds();
                onClose();
            }
        } catch (err) {
            console.error("Post Error:", err);
        }
    };

    return createPortal(
        <div id="modal-compose" className="modal-overlay" onClick={onClose}>
            <div className="modal-content compose-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Post</h2>
                <form id="form-compose" onSubmit={handlePost}>
                    <div className="compose-area">
                        <textarea 
                            id="post-content" 
                            placeholder="Announce something to your class" 
                            required
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        ></textarea>
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
                            <button type="submit" className="btn-submit btn-post-cta">Post</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        , document.getElementById('portal-root'));
}