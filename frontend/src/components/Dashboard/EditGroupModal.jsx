
// currently not used
export default function EditGroupModal() {
    return (
        <div id="modal-edit-group" className="modal-overlay hidden">
            <div className="modal-content modal-edit-content">
                {/* Header */}
                <div className="modal-title-row">
                    <h2 className="modal-title-text">Edit Group</h2>
                    <button type="button" onClick={() => { closeModal('modal-edit-group') }}
                        className="modal-close-symbol">&times;</button>
                </div>

                {/* Body */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px', }}>
                    {/* Group Name Input */}
                    <div className="modal-input-wrapper">
                        <div className="modal-input-label">Group Name</div>
                        <input type="text" value="Group 1" className="modal-input-field" />
                    </div>

                    {/* Members Box */}
                    <div className="modal-input-wrapper" style={{ padding: '15px', }}>
                        <div className="modal-input-label" style={{ position: 'static', marginBottom: '10px', }}>Members</div>

                        {/* Search / Dropdown Input Mockup */}
                        <div style={{ position: 'relative', maxWidth: '300px', marginBottom: '20px', }}>
                            <select
                                style={{ width: '100%', appearance: 'none', background: '#b8b8b8', color: 'white', border: 'none', borderRadius: '20px', padding: '8px 30px 8px 25px', fontSize: '14px', outline: 'none', cursor: 'pointer', fontFamily: 'inherit', }}>
                                <option value="" disabled selected></option>
                                <option value="1">6622780268@g.siit.tu.ac.th</option>
                                <option value="2">student.two@g.siit.tu.ac.th</option>
                                <option value="3">student.three@g.siit.tu.ac.th</option>
                            </select>
                            <div
                                style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', width: '1px', height: '16px', background: 'white', pointerEvents: 'none', }}>
                            </div>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"
                                strokeLinecap="round" strokeLinejoin="round"
                                style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', }}>
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>

                        {/* Member Chip */}
                        <div className="member-chip">
                            {/* Avatar */}
                            <div className="member-chip-avatar">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>
                            <span className="member-chip-email">6622780268@g.siit.tu.ac.th</span>
                            <span className="member-chip-remove" onClick={() => { removeParentElement(this) }}>&times;</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="modal-footer-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#666', }}>
                        Google Meet Link
                        <input type="text"
                            style={{ border: 'none', borderBottom: '1px solid #888', outline: 'none', background: 'transparent', width: '250px', fontFamily: 'inherit', fontSize: '14px', color: '#333', }} />
                    </div>
                    <button type="button" onClick={() => { closeModal('modal-edit-group') }} className="modal-submit-btn">Update</button>
                </div>
            </div>
        </div>
    );
}