import { useState } from 'react';

export default function CreateClassModal({ onClose }) {
    return (
        <div id="modal-create-class" className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Create class</h2>
                <form id="form-create-class">
                    <div className="input-group">
                        <input type="text" id="class-name" placeholder="Class name (required)" required />
                    </div>
                    <div className="input-group">
                        <input type="text" id="class-section" placeholder="Section" />
                    </div>
                    <div className="input-group">
                        <input type="text" id="class-subject" placeholder="Subject" />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit blue-text">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );

}