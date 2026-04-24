

export default function InviteModal() {
    return (
        <div id="modal-invite" className="modal-overlay hidden">
            <div className="invite-modal-container modal-content">
                <div className="invite-modal-top">
                    <h2 id="invite-modal-title" className="invite-modal-heading">Invite student</h2>
                    <svg onclick="closeModal('modal-invite')" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#56c4df" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="cursor-pointer-icon">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </div>

                <div id="invite-chips-container" className="invite-chips-area">
                    {/**/}
                </div>

                <form id="form-invite" onsubmit="handleInvite(event)" className="invite-form-container">
                    <div className="invite-input-line">
                        <input type="text" id="invite-email" placeholder="Email Address" className="invite-email-input" />
                    </div>
                    <button type="submit" className="invite-submit-btn">INVITE</button>
                </form>
            </div>
        </div>
    );
}