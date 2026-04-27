import { createPortal } from 'react-dom';
import { useState } from 'react';
import { useClass } from '../ClassContext';
import { inviteToClass } from '../../services/classService';
import MessagePopup from '../MessagePopup';

export default function InviteModal({ onClose, type, onRefresh }) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const { activeClassId } = useClass();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await inviteToClass(email, activeClassId, type);
            if (onRefresh) onRefresh();
            onClose();
        } catch (err) {
            console.error("Invite Error:", err);
            setError(err.message || "Failed to invite user");
        }
    }

    return createPortal(
        <div id="modal-invite" className="modal-overlay" onClick={onClose}>
            <div className="invite-modal-container modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="invite-modal-top">
                    <div className="invite-heading-wrapper">
                        <h2 id="invite-modal-title" className="invite-modal-heading">
                            Invite {type === 'leader' ? 'Leader' : 'Student'}
                        </h2>
                        <div className="invite-blue-line"></div>
                    </div>
                    <svg onClick={onClose} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#56c4df" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="cursor-pointer-icon">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </div>

                <div id="invite-chips-container" className="invite-chips-area">
                </div>

                <form id="form-invite" className="invite-form-container" onSubmit={handleSubmit}>
                    <div className="invite-input-line">
                        <input
                            type="email"
                            id="invite-email"
                            placeholder="Email Address"
                            className="invite-email-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="invite-submit-btn">INVITE</button>
                </form>
            </div>
            {error && (
                <MessagePopup theme="red" onClose={() => setError(null)}>
                    {error}
                </MessagePopup>
            )}
        </div>
        , document.getElementById('portal-root'));
}