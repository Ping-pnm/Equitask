

export default function EditAssignmentModal() {
    return (
        <div id="modal-edit-assignment" className="modal-overlay hidden">
            <div className="modal-content modal-content-scrollable">
                {/* Header */}
                <div
                    className="modal-header-row">
                    <div className="modal-title-group">
                        <img src="../assets/checklist-icon.png" alt="Checklist"
                            className="" />
                        <span className="modal-title-text-custom">Assignment</span>
                    </div>
                    <button type="button"
                        className="modal-close-symbol">&times;</button>
                </div>

                {/* Body */}
                <div className="modal-body-section">
                    <div className="modal-input-wrapper">
                        <div className="input-label-floating">Title</div>
                        <input type="text" value="Group Project"
                            className="input-title-floating" />
                    </div>
                    <textarea placeholder="Instructions (optional)"
                        className="input-instructions-floating">[Group Project]
                        For the project proposal, prepare your topic and answer these questions.
                        1. The name of the application and what its main objectives?
                        2. Who are the stakeholders of your applications?
                        3. What pain points or problems that your application can solve for users?</textarea>

                    {/* Rubrics Section */}
                    <div className="rubrics-config-section">
                        <div className="rubrics-config-header">
                            Rubrics
                            <div className="rubrics-config-controls">
                                Rows:
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="black" stroke="white" stroke-width="2" className="modal-config-icon"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                                <span id="rubric-rows-edit">3</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="black" stroke="white" stroke-width="2" className="modal-config-icon"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                            </div>
                            <div className="rubrics-config-controls">
                                Columns:
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="black" stroke="white" stroke-width="2" className="modal-config-icon"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                                <span id="rubric-cols-edit">3</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="black" stroke="white" stroke-width="2" className="modal-config-icon"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                            </div>
                        </div>
                        {/* Table */}
                        <div className="rubrics-table-wrapper">
                            <table className="rubrics-input-table">
                                <tbody id="rubric-table-edit">
                                    <tr>
                                        <td contenteditable="true" className="rubrics-input-cell"></td>
                                        <td contenteditable="true" className="rubrics-input-cell"></td>
                                        <td contenteditable="true" className="rubrics-input-cell"></td>
                                    </tr>
                                    <tr>
                                        <td contenteditable="true" className="rubrics-input-cell"></td>
                                        <td contenteditable="true" className="rubrics-input-cell"></td>
                                        <td contenteditable="true" className="rubrics-input-cell"></td>
                                    </tr>
                                    <tr>
                                        <td contenteditable="true" className="rubrics-input-cell"></td>
                                        <td contenteditable="true" className="rubrics-input-cell"></td>
                                        <td contenteditable="true" className="rubrics-input-cell"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Options */}
                <div
                    className="modal-options-row">
                    <div className="file-info-group">
                        Points
                        <div
                            className="points-input-wrapper">
                            <input type="text" value="100"
                                className="points-input" />
                        </div>
                    </div>
                    <div className="file-info-group">
                        Due
                        <div className="due-date-wrapper">
                            <input type="date"
                                className="due-date-input" />
                            <span id="edit-due-display"
                                className="due-date-display">Apr 30</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3eb5cd" stroke-width="3"
                                stroke-linecap="round" stroke-linejoin="round"
                                className="chevron-icon">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                    </div>
                    <div className="file-info-group">
                        Group work
                        <div id="edit-group-work-toggle"
                            className="toggle-switch"
                            data-toggled="false">
                            <div id="edit-group-work-knob"
                                className="toggle-knob">
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="modal-footer-row">
                    <div className="compose-icons">
                        <button type="button"
                            className="icon-btn-custom">
                            <img src="../assets/UploadSign.png" alt="Upload"
                                className="hw1-checklist-icon" />
                        </button>
                        <button type="button"
                            className="icon-btn-custom">
                            <img src="../assets/LinkSign.png" alt="Link"
                                className="hw1-checklist-icon" />
                        </button>
                    </div>
                    <div className="modal-actions-right">
                        <button type="button" className="btn-cancel btn-cancel-custom">Cancel</button>
                        <button type="button"
                            className="btn-submit-custom">Update</button>
                    </div>
                </div>
            </div>
        </div>
    );
}