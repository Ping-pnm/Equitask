

export default function AssignModal() {
    return (
        <div id="modal-assign" className="modal-overlay hidden">
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
                    <input type="text" placeholder="Title"
                        className="input-title-large" />
                    <textarea placeholder="Instructions (optional)"
                        className="input-instructions-large"></textarea>

                    {/* Rubrics Section */}
                    <div className="rubrics-config-section">
                        <div className="rubrics-config-header">
                            Rubrics
                            <div className="rubrics-config-controls">
                                Rows:
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="black" stroke="white" stroke-width="2" className="modal-config-icon"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                                <span id="rubric-rows-assign">3</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="black" stroke="white" stroke-width="2" className="modal-config-icon"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                            </div>
                            <div className="rubrics-config-controls">
                                Columns:
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="black" stroke="white" stroke-width="2" className="modal-config-icon"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                                <span id="rubric-cols-assign">3</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="black" stroke="white" stroke-width="2" className="modal-config-icon"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                            </div>
                        </div>
                        {/* Table */}
                        <div className="rubrics-table-wrapper">
                            <table className="rubrics-input-table">
                                <tbody id="rubric-table-assign">
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
                            <span id="due-display"
                                className="due-date-display">Apr
                                30</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3eb5cd" stroke-width="3"
                                stroke-linecap="round" stroke-linejoin="round"
                                className="chevron-icon">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                    </div>
                    <div className="file-info-group">
                        Group work
                        <div id="group-work-toggle"
                            className="toggle-switch"
                            data-toggled="false">
                            <div id="group-work-knob"
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
                        <button type="button" className="btn-cancel btn-cancel-custom">Cancle</button>
                        <button type="button"
                            className="btn-submit-custom">Assign</button>
                    </div>
                </div>
            </div>
        </div>
    );
}