import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../AuthContext';
import { useClass } from '../ClassContext';
import { postAnnouncement } from '../../services/classService';
import uploadIcon from '../../assets/UploadSign.png';
import AttachmentDisplay from '../AttachmentDisplay.jsx';

export default function ComposeModal({ fetchFeeds, onClose }) {
    const { userId } = useAuth();
    const { activeClassId } = useClass();
    const [content, setContent] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
        e.target.value = "";
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handlePost = async (e) => {
        e.preventDefault();

        if (!content.trim() && selectedFiles.length === 0) return;

        try {
            const response = await postAnnouncement(content, userId, activeClassId, selectedFiles);

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

                    {/* File Preview List */}
                    <div className="selected-files-list">
                        <AttachmentDisplay files={selectedFiles} onDelete={removeFile} />
                    </div>

                    <div className="modal-actions compose-actions">
                        <div className="compose-icons">
                            <input
                                type="file"
                                id="file-upload"
                                style={{ display: 'none' }}
                                multiple
                                onChange={handleFileChange}
                            />
                            <button type="button" className="icon-btn tool-btn"
                                onClick={() => document.getElementById('file-upload').click()}>
                                <img src={uploadIcon} alt="Upload" />
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