

export default function ComposeModal() {
    return (
        <div id="modal-compose" className="modal-overlay hidden">
            <div className="modal-content compose-modal">
                <h2>Post</h2>
                <form id="form-compose" onSubmit="handlePost(event)">
                    <div className="compose-area">
                        <textarea id="post-content" placeholder="Announce something to your class" required></textarea>
                    </div>
                    <div className="modal-actions compose-actions">
                        <div className="compose-icons">
                            <input type="file" id="file-upload" />
                            <button type="button" className="icon-btn tool-btn"
                                onClick="document.getElementById('file-upload').click()">
                                <img src="../assets/UploadSign.png" alt="Upload" />
                            </button>
                            <button type="button" className="icon-btn tool-btn">
                                <img src="../assets/LinkSign.png" alt="Link" />
                            </button>
                        </div>
                        <div className="compose-btns">
                            <button type="button" className="btn-cancel" onClick="closeModal('modal-compose')">Cancel</button>
                            <button type="submit" className="btn-submit btn-post">Post</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}