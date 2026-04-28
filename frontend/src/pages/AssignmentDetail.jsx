import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAssignment, getUserGroup, deleteGroup, getAllGroupsForAssignment } from '../services/workService';
import checkListIcon from '../assets/checklist-icon.png';
import LoadingSpinner from '../components/LoadingSpinner';
import Rubric from '../components/Rubric';
import CreateGroupModal from '../components/Work/CreateGroupModal';
import MessagePopup from '../components/MessagePopup';
import { useAuth } from '../components/AuthContext';
import { useClass } from '../components/ClassContext';
import ProgressBar from '../components/ProgressBar';
import AssignModal from '../components/Work/AssignModal';
import editIcon from '../assets/editSign.png';
import groupSign from '../assets/groupSign.png';

export default function AssignmentDetail() {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const { userId } = useAuth();
    const { isLeader } = useClass();
    const [assignment, setAssignment] = useState(null);
    const [userGroup, setUserGroup] = useState(null);
    const [allGroups, setAllGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [modalConfig, setModalConfig] = useState({ show: false, message: '', theme: 'green' });

    const fetchData = useCallback(async () => {
        if (!assignmentId) return;
        try {
            setIsLoading(true);
            const [assignmentData, groupData, allGroupsData] = await Promise.all([
                getAssignment(assignmentId),
                userId ? getUserGroup(userId, assignmentId) : null,
                isLeader ? getAllGroupsForAssignment(assignmentId) : []
            ]);
            setAssignment(assignmentData);
            setUserGroup(groupData);
            setAllGroups(allGroupsData);
        } catch (err) {
            console.error("Failed to fetch data:", err);
        } finally {
            setIsLoading(false);
        }
    }, [assignmentId, userId, isLeader]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDeleteGroup = async (groupId) => {
        if (!window.confirm("Are you sure you want to delete this group?")) return;
        try {
            await deleteGroup(groupId);
            if (isLeader) {
                setAllGroups(prev => prev.filter(g => g.groupId !== groupId));
            } else {
                setUserGroup(null);
            }
            setModalConfig({ show: true, message: "Group deleted successfully", theme: 'green' });
        } catch (err) {
            console.error("Delete Group Error:", err);
            setModalConfig({ show: true, message: "Failed to delete group", theme: 'red' });
        }
    };

    if (isLoading) return <LoadingSpinner />;
    if (!assignment) return <div className="people-content-area" style={{ textAlign: 'center', padding: '50px' }}>Assignment not found.</div>;

    const groupsToDisplay = isLeader ? allGroups : (userGroup ? [userGroup] : []);

    return (
        <div className="assignment-detail-page">
            <div id="assignment-detail-view" className="assignment-detail-container">
                {/* Title Area */}
                <div className="assignment-detail-header">
                    <div className="assignment-title-group">
                        <img src={checkListIcon} alt="Checklist" className="assignment-title-icon" />
                        <div>
                            <h1 className="assignment-title-text">{assignment.title}</h1>
                            <div className="assignment-due-text">
                                Due {new Date(assignment.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </div>
                        </div>
                    </div>
                    <div className="assignment-points-group" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div className="assignment-points-text">{assignment.points} points</div>
                        {isLeader && (
                            <div className="post-card-actions">
                                <img src={editIcon} alt="Edit"
                                    className="post-card-edit-icon"
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    onClick={() => setIsEditing(true)} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Body Text */}
                <div className="assignment-body-text">
                    <div style={{ whiteSpace: 'pre-wrap', marginBottom: '30px' }}>{assignment.instructions}</div>

                    {/* Attachments */}
                    {assignment.files && assignment.files.length > 0 && (
                        <div className="attachments-section" style={{ marginTop: '20px' }}>
                            <div className="rubrics-label">Attachments:</div>
                            <div className="files-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {assignment.files.map((file, idx) => (
                                    <a key={idx}
                                        href={`http://localhost:3000/${file.fileUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="file-attachment-link"
                                        style={{ padding: '8px 15px', background: '#f0f4f8', borderRadius: '8px', fontSize: '13px', color: '#374b75', textDecoration: 'none', border: '1px solid #d1d9e6' }}
                                    >
                                        {file.fileName || file.fileUrl.split('/').pop()}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Rubric Display */}
                    {assignment.criteria && assignment.criteria.length > 0 && (
                        <div style={{ marginTop: '25px' }}>
                            <div className="rubrics-label">Rubrics:</div>
                            <Rubric
                                criterias={assignment.criteria.map(c => c.title)}
                                levels={assignment.levels.map(l => l.title)}
                                cells={assignment.rubricCells}
                                readOnly={true}
                            />
                        </div>
                    )}
                </div>

                {/* Groups Section (Only for Group Work) */}
                {!!assignment.isGroupWork && (
                    <div className="groups-section" style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h3 style={{ fontSize: '16px', color: '#333' }}>Groups</h3>
                            <button className="btn-create-group" onClick={() => setIsGroupModalOpen(true)}>Join / Create Group</button>
                        </div>

                        <div className="groups-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {groupsToDisplay.length > 0 ? (
                                groupsToDisplay.map(group => (
                                    <div
                                        key={group.groupId}
                                        className="group-status-container"
                                        onClick={() => navigate(`/group-project/${group.groupId}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="group-info-left">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '100px' }}>
                                                <img src={groupSign} alt="Group" style={{ width: '32px', height: '32px', opacity: 0.8 }} />
                                                <span className="group-name-display" style={{ fontSize: '16px' }}>{group.groupName}</span>
                                            </div>
                                            <ProgressBar progress={group.progress || 0} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {isLeader && (
                                                <button
                                                    className="btn-delete-group"
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteGroup(group.groupId); }}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ fontSize: '14px', color: '#999', textAlign: 'center' }}>No groups joined yet.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {isGroupModalOpen && (
                <CreateGroupModal
                    onClose={() => setIsGroupModalOpen(false)}
                    onSuccess={fetchData}
                    assignmentId={assignmentId}
                    classId={assignment.classId}
                />
            )}

            {isEditing && (
                <AssignModal
                    onClose={(refresh) => {
                        setIsEditing(false);
                        if (refresh) fetchData();
                    }}
                    classId={assignment.classId}
                    isCreate={false}
                    assignmentId={assignmentId}
                />
            )}

            {modalConfig.show && (
                <MessagePopup
                    theme={modalConfig.theme}
                    onClose={() => setModalConfig({ ...modalConfig, show: false })}
                >
                    {modalConfig.message}
                </MessagePopup>
            )}
        </div>
    );
}