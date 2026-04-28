import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../AuthContext";
import { getGroupMembers, createGroup, updateGroup } from "../../services/workService";
import LoadingSpinner from "../LoadingSpinner";

export default function CreateGroupModal({ onClose, onSuccess, assignmentId, classId, initialGroup }) {
    const { userId } = useAuth();
    const [groupName, setGroupName] = useState(initialGroup?.groupName || "");
    const [meetLink, setMeetLink] = useState(initialGroup?.meetLink || "");
    const [allMembers, setAllMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState(
        initialGroup?.members ? initialGroup.members.filter(m => m.userId !== userId) : []
    );
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditMode = !!initialGroup;

    useEffect(() => {
        async function fetchMembers() {
            try {
                setIsLoading(true);
                const members = await getGroupMembers(classId, assignmentId);
                // Filter out the current user and anyone already in the group
                const currentMemberIds = selectedMembers.map(m => m.userId);
                setAllMembers(members.filter(m => m.userId !== userId && !currentMemberIds.includes(m.userId)));
            } catch (err) {
                console.error("Failed to fetch members:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchMembers();
    }, [classId, assignmentId, userId]);

    const handleAddMember = (e) => {
        const memberId = parseInt(e.target.value);
        if (!memberId) return;

        const member = allMembers.find(m => m.userId === memberId);
        if (!member) return;

        // Check if already selected (should be filtered out but just in case)
        if (selectedMembers.find(m => m.userId === memberId)) return;

        // Check if member already has a group (for new members being invited)
        if (member.hasGroup) {
            alert(`${member.firstName} is already in another group for this assignment.`);
            return;
        }

        setSelectedMembers([...selectedMembers, member]);
        setAllMembers(allMembers.filter(m => m.userId !== memberId)); // Remove from available
        e.target.value = ""; // Reset select
    };

    const handleRemoveMember = (memberId) => {
        const removedMember = selectedMembers.find(m => m.userId === memberId);
        setSelectedMembers(selectedMembers.filter(m => m.userId !== memberId));
        if (removedMember) {
            setAllMembers([...allMembers, removedMember]); // Put back to available
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!groupName.trim()) {
            alert("Group Name is required");
            return;
        }

        try {
            setIsSubmitting(true);
            const groupData = {
                groupName,
                assignmentId,
                classId,
                creatorId: userId,
                meetLink,
                memberIds: selectedMembers.map(m => m.userId)
            };

            if (isEditMode) {
                await updateGroup(initialGroup.groupId, groupData);
            } else {
                await createGroup(groupData);
            }
            
            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            alert(err.message || `Failed to ${isEditMode ? 'update' : 'create'} group`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return createPortal(
        <div id="modal-create-group" className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-edit-content" onClick={(e) => e.stopPropagation()} style={{ minHeight: '400px' }}>
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <form onSubmit={handleSubmit}>
                        {/* Header */}
                        <div className="modal-title-row">
                            <h2 className="modal-title-text">{isEditMode ? "Update Group" : "Create Group"}</h2>
                            <button type="button" className="modal-close-symbol" onClick={onClose}>&times;</button>
                        </div>

                        {/* Body */}
                        <div className="create-group-body">
                            {/* Group Name Input */}
                            <div className="modal-input-wrapper">
                                <div className="modal-input-label">Group Name *</div>
                                <input 
                                    type="text"
                                    className="input-group-name" 
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    placeholder="Enter your group name"
                                    required
                                />
                            </div>

                            {/* Members Box */}
                            <div className="members-section" style={{ marginTop: '20px' }}>
                                <div className="members-label">{isEditMode ? "Edit Members" : "Add Members"}</div>

                                {/* Search / Dropdown Input */}
                                <div className="member-select-wrapper">
                                    <select className="member-select" onChange={handleAddMember} defaultValue="">
                                        <option value="" disabled>Select a classmate...</option>
                                        {allMembers.map(member => (
                                            <option key={member.userId} value={member.userId}>
                                                {member.firstName} {member.lastName} ({member.email})
                                                {member.hasGroup ? " - [ALREADY IN GROUP]" : ""}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="select-divider"></div>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"
                                        strokeLinecap="round" strokeLinejoin="round" className="select-chevron">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </div>

                                {/* Selected Members Chips */}
                                <div className="selected-members-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '15px' }}>
                                    {selectedMembers.map(member => (
                                        <div key={member.userId} className="member-chip">
                                            <div className="member-chip-avatar">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                                    <circle cx="12" cy="7" r="4"></circle>
                                                </svg>
                                            </div>
                                            <span className="member-chip-email">{member.firstName}</span>
                                            <span className="member-chip-remove" onClick={() => handleRemoveMember(member.userId)}>&times;</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="modal-footer-row" style={{ marginTop: '30px' }}>
                            <div className="meet-link-wrapper">
                                Google Meet Link (Optional)
                                <input 
                                    type="text" 
                                    className="meet-link-input" 
                                    value={meetLink}
                                    onChange={(e) => setMeetLink(e.target.value)}
                                    placeholder="https://meet.google.com/..."
                                />
                            </div>
                            <button 
                                type="submit"
                                className="modal-submit-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update" : "Create")}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
        , document.getElementById('portal-root'));
}