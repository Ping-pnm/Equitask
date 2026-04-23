

export default function CreateGroupModal() {
    return (
        <div id="modal-create-group" className="modal-overlay hidden">
            <div className="modal-content modal-edit-content">
                {/* Header */}
                <div
                    className="modal-title-row">
                    <h2 className="modal-title-text">Create Group</h2>
                    <button type="button"
                        className="modal-close-symbol">&times;</button>
                </div>

                {/* Body */}
                <div className="create-group-body">
                    {/* Group Name Input */}
                    <div className="modal-input-wrapper">
                        <div className="modal-input-label">Group Name</div>
                        <input type="text"
                            className="input-group-name" />
                    </div>

                    {/* Members Box */}
                    <div className="members-section">
                        <div className="members-label">Members</div>

                        {/* Search / Dropdown Input Mockup */}
                        <div className="member-select-wrapper">
                            <select className="member-select">
                                <option value="" disabled selected></option>
                                <option value="1">6622780268@g.siit.tu.ac.th</option>
                                <option value="2">student.two@g.siit.tu.ac.th</option>
                                <option value="3">student.three@g.siit.tu.ac.th</option>
                            </select>
                            <div className="select-divider"></div>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"
                                stroke-linecap="round" stroke-linejoin="round" className="select-chevron">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>

                        {/* Member Chip */}
                        <div className="member-chip">
                            {/* Avatar */}
                            <div className="member-chip-avatar">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>
                            <span className="member-chip-email">6622780268@g.siit.tu.ac.th</span>
                            <span className="member-chip-remove">&times;</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="modal-footer-row">
                    <div className="meet-link-wrapper">
                        Google Meet Link
                        <input type="text" className="meet-link-input" />
                    </div>
                    <button type="button"
                        className="modal-submit-btn">Create</button>
                </div>
            </div>
        </div>
    );
}