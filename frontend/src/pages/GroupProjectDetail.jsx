import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import groupSign from '../assets/groupSign.png';
import googlemeetSign from '../assets/googlemeetSign.png';
import gearEditSign from '../assets/gearEditSign.png';
import aiSign from '../assets/Ai-sign.png';
import uploadSign from '../assets/UploadSign.png';
import {
    getGroup, getAssignment, getGroupComments, addGroupComment,
    trackMeetJoin, getMeetTracking, uploadGroupWork, deleteGroupWork, submitGroupWork, gradeGroup, addLink, deleteLink
} from '../services/workService';
import LoadingSpinner from '../components/LoadingSpinner';
import CreateGroupModal from '../components/Work/CreateGroupModal';
import Rubric from '../components/Rubric';
import Message from '../components/Dashboard/Message';
import { useAuth } from '../components/AuthContext';
import { useClass } from '../components/ClassContext';
import MessagePopup from '../components/MessagePopup';
import AttachmentDisplay from '../components/AttachmentDisplay';
import TaskCard from '../components/Dashboard/TaskCard';
import AddTaskModal from '../components/Dashboard/AddTaskModal';
import LinkModal from '../components/Work/LinkModal';
// TaskDetail is now a page, not a component used here

export default function GroupProjectDetail() {
    const { userId } = useAuth();
    const { isLeader } = useClass();
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [assignment, setAssignment] = useState(null);
    const [comments, setComments] = useState([]);
    const [meetTracking, setMeetTracking] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [popupMessage, setPopupMessage] = useState(null);

    // Work Section States
    const [isWorkMenuOpen, setIsWorkMenuOpen] = useState(false);
    const [uploadedWork, setUploadedWork] = useState([]);
    const [uploadedLinks, setUploadedLinks] = useState([]);
    const [isWorkSubmitted, setIsWorkSubmitted] = useState(false);
    const [isAddingLink, setIsAddingLink] = useState(false);
    const [newLinkUrl, setNewLinkUrl] = useState('');
    const [rubricSelections, setRubricSelections] = useState(null);
    const [gradeValue, setGradeValue] = useState('');

    const fetchGroupData = async () => {
        try {
            const groupData = await getGroup(groupId);
            setGroup(groupData);
            setUploadedWork(groupData.files || []);
            setUploadedLinks(groupData.links || []);
            setIsWorkSubmitted(!!groupData.isSubmitted);
            setGradeValue(groupData.grades || '');

            // Also fetch assignment for rubrics
            if (groupData.assignmentId) {
                const assignmentData = await getAssignment(groupData.assignmentId);
                setAssignment(assignmentData);
            }

            const commentsData = await getGroupComments(groupId);
            setComments(commentsData);

            const trackingData = await getMeetTracking(groupId);
            setMeetTracking(trackingData);
        } catch (err) {
            console.error("Error fetching group data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMeetHistory = async () => {
        try {
            const history = await getMeetTracking(groupId);
            setMeetTracking(history);
        } catch (err) {
            console.error("Failed to fetch meet history:", err);
        }
    };

    const students = group?.members || [];
    const pivotTracking = meetTracking.reduce((acc, curr) => {
        const date = new Date(curr.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        if (!acc[date]) acc[date] = {};
        if (!acc[date][curr.userId]) {
            acc[date][curr.userId] = new Date(curr.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        }
        return acc;
    }, {});
    const sortedPivotDates = Object.keys(pivotTracking).sort((a, b) => new Date(b) - new Date(a));

    const fetchComments = async () => {
        try {
            const commentData = await getGroupComments(groupId);
            setComments(commentData);
        } catch (err) {
            console.error("Failed to fetch group comments:", err);
        }
    };

    const handleAddComment = async (e) => {
        if (e.key === 'Enter' && newComment.trim()) {
            try {
                await addGroupComment(groupId, userId, newComment.trim());
                setNewComment('');
                fetchComments();
            } catch (err) {
                console.error("Failed to add comment:", err);
            }
        }
    };

    const handleJoinMeet = async () => {
        if (!group.meetLink) {
            setPopupMessage({ message: "No Meet link available for this group.", theme: 'red' });
            return;
        }

        try {
            await trackMeetJoin(groupId, userId);
            fetchMeetHistory(); // Refresh history
            window.open(group.meetLink, '_blank');
        } catch (err) {
            console.error("Failed to track meet join:", err);
        }
    };

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        try {
            const response = await uploadGroupWork(groupId, group.assignmentId, files);
            setUploadedWork(prev => [...prev, ...response.files]);
            setIsWorkMenuOpen(false);
            setPopupMessage({ message: "Files uploaded successfully", theme: 'green' });
        } catch (err) {
            console.error("Upload error:", err);
            setPopupMessage({ message: "Failed to upload files", theme: 'red' });
        }
    };

    const handleRemoveWork = async (idx) => {
        const fileToDelete = uploadedWork[idx];
        if (!fileToDelete.fileId) {
            // Local fallback if needed
            setUploadedWork(prev => prev.filter((_, i) => i !== idx));
            return;
        }

        try {
            await deleteGroupWork(fileToDelete.fileId);
            setUploadedWork(prev => prev.filter((_, i) => i !== idx));
            setPopupMessage({ message: "File removed successfully", theme: 'green' });
        } catch (err) {
            console.error("Remove error:", err);
            setPopupMessage({ message: "Failed to remove file", theme: 'red' });
        }
    };

    const handleLinkAdd = async (url) => {
        const linkUrl = url || newLinkUrl;
        if (!linkUrl.trim()) return;
        try {
            const res = await addLink({
                linkUrl: linkUrl,
                assignmentId: group.assignmentId,
                groupId: groupId
            });
            setUploadedLinks(prev => [...prev, { linkId: res.linkId, linkUrl: linkUrl }]);
            setNewLinkUrl('');
            setIsAddingLink(false);
            setIsWorkMenuOpen(false);
            setPopupMessage({ message: "Link added successfully", theme: 'green' });
        } catch (err) {
            console.error("Link add error:", err);
            setPopupMessage({ message: "Failed to add link", theme: 'red' });
        }
    };

    const handleRemoveLink = async (linkId) => {
        try {
            await deleteLink(linkId);
            setUploadedLinks(prev => prev.filter(l => l.linkId !== linkId));
            setPopupMessage({ message: "Link removed successfully", theme: 'green' });
        } catch (err) {
            console.error("Remove link error:", err);
            setPopupMessage({ message: "Failed to remove link", theme: 'red' });
        }
    };

    const toggleWorkSubmission = async () => {
        const newStatus = !isWorkSubmitted;
        try {
            const result = await submitGroupWork(groupId, group.assignmentId, newStatus);
            setIsWorkSubmitted(newStatus);

            // Update local rubric selections
            if (newStatus && result.selections && assignment?.criteria && assignment?.levels) {
                const newIndices = assignment.criteria.map(c => {
                    const sel = (result.selections || []).find(s => s.criteriaId === c.criteriaId);
                    if (!sel) return -1;
                    return assignment.levels.findIndex(l => l.levelId === sel.levelId);
                });
                setRubricSelections(newIndices);
            } else if (!newStatus) {
                setRubricSelections(null);
            }

            setPopupMessage({
                message: newStatus ? "Work submitted successfully!" : "Work unsubmitted",
                theme: 'green'
            });

            // Re-fetch to update GroupCard and other stats
            fetchGroupData();
        } catch (err) {
            console.error("Submission error:", err);
            setPopupMessage({ message: "Failed to update submission status", theme: 'red' });
        }
    };

    const handleGradeUpdate = async (e) => {
        if (e.key === 'Enter') {
            try {
                await gradeGroup(groupId, gradeValue);
                setPopupMessage({ message: "Grade updated successfully!", theme: 'green' });
                fetchGroupData();
            } catch (err) {
                console.error("Grade update error:", err);
                setPopupMessage({ message: "Failed to update grade", theme: 'red' });
            }
        }
    };

    const navigate = useNavigate();

    const openTaskDetail = (student, task) => {
        navigate(`/task/${task.taskId}`);
    };

    const openAddTaskModal = (member) => {
        setSelectedMember(member);
        setIsAddTaskModalOpen(true);
    };

    const studentsTasksData = group?.members?.map((member, index) => {
        const totalTasks = member.tasks?.length || 0;
        const totalProgress = member.tasks?.reduce((acc, task) => acc + (task.progress || 0), 0) || 0;
        const overallProgress = totalTasks > 0 ? Math.round(totalProgress / totalTasks) : 0;

        return {
            name: `${member.firstName} ${member.lastName}`,
            member: member,
            overallProgress: overallProgress,
            tasks: member.tasks || []
        };
    }) || [];

    useEffect(() => {
        if (isWorkSubmitted && assignment?.criteria) {
            const currentSelections = assignment.criteria.map((c) => {
                if (c.selectedLevelId) {
                    const levelIdx = assignment.levels.findIndex(l => l.levelId === c.selectedLevelId);
                    if (levelIdx !== -1) return levelIdx;
                }
                return -1;
            });

            if (currentSelections.some(idx => idx >= 0)) {
                setRubricSelections(currentSelections);
            } else {
                setRubricSelections(null);
            }
        } else if (!isWorkSubmitted) {
            setRubricSelections(null);
        }
    }, [isWorkSubmitted, assignment]);

    useEffect(() => {
        async function initialFetch() {
            setIsLoading(true);
            await fetchGroupData();
            setIsLoading(false);
        }
        initialFetch();
    }, [groupId]);

    const handleEditSuccess = () => {
        fetchGroupData();
    };

    if (isLoading) return <LoadingSpinner />;
    if (!group) return <div style={{ padding: '50px', textAlign: 'center' }}>Group not found.</div>;

    return (
        <section id="dashboard-group-detail-view" className="stream-content extracted-style-19">
            <div className="main-dashboard-wrapper" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 20px' }}>
                <Link to={isLeader ? `/project/${group.assignmentId}` : "/dashboard"} id="extracted-el-2" className="extracted-style-20" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    {isLeader ? "Back to Group Project" : "Back to Dashboard"}
                </Link>

                {/* Consolidated Header & Main Content Grid */}
                <div className="detail-content-grid" style={{ alignItems: 'flex-start', marginTop: '10px' }}>

                    {/* Left Side: Title & Members */}
                    <div className="column-main" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        {/* Group Title Area */}
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: '16px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img src={groupSign} alt="Group Sign" style={{ width: '50px', height: '50px', marginRight: '12px' }} />
                                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>Group Project:</span>
                                    <span style={{ fontSize: '24px', fontWeight: '700', color: '#222', marginTop: '2px' }}>{group.groupName}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', border: '1px solid #ccc', borderRadius: '8px', background: 'white' }}>
                                    <img src={googlemeetSign} alt="Google Meet Sign" style={{ width: '28px', height: '28px' }} />
                                    <span style={{ fontSize: '18px', fontWeight: '500', color: '#333' }}>Meet</span>
                                    <button
                                        onClick={handleJoinMeet}
                                        style={{ border: '1px solid #777', background: 'transparent', color: '#5b7ab7', fontWeight: '600', fontSize: '14px', padding: '4px 16px', borderRadius: '16px', cursor: 'pointer', marginLeft: '4px' }}>
                                        JOIN
                                    </button>
                                </div>
                                <img src={gearEditSign} alt="Edit Settings" onClick={() => setIsEditModalOpen(true)} style={{ width: '24px', height: '24px', cursor: 'pointer' }} />
                            </div>
                        </div>

                        {/* Group Members Section */}
                        <div className="extracted-style-23">
                            <h2 className="extracted-style-24">Group Members</h2>
                            <div className="member-table-wrapper" style={{ overflowX: 'auto' }}>
                                <table className="member-list-table">
                                    <tbody>
                                        {group.members && group.members.length > 0 ? (
                                            group.members.map((member, index) => (
                                                <tr key={index}>
                                                    <td>{member.email}</td>
                                                    <td>{member.firstName}</td>
                                                    <td>{member.lastName}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" style={{ textAlign: 'center', padding: '10px' }}>No members found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Work & Comments */}
                    <div className="column-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Work Card */}
                        <div className="extracted-style-57" style={{ marginTop: '0' }}>
                            <div className="extracted-style-58">
                                <span className="extracted-style-59">Group Work</span>
                                <span className="extracted-style-60">{isWorkSubmitted ? 'Submitted' : 'Assigned'}</span>
                            </div>
                            {/* List of Uploaded Files */}
                            <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <AttachmentDisplay 
                                    files={uploadedWork.map(f => {
                                        if (f instanceof File) return f;
                                        return { ...f, isExisting: true };
                                    })} 
                                    onDelete={!isWorkSubmitted ? (index) => handleRemoveWork(index) : null} 
                                />

                                {uploadedLinks.map((link, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px',
                                        background: 'white', borderRadius: '10px', border: '1px solid #eee',
                                        transition: 'all 0.2s ease', cursor: 'pointer'
                                    }}
                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0a7e8c'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(10,126,140,0.1)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#eee'; e.currentTarget.style.boxShadow = 'none'; }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, overflow: 'hidden' }}>
                                            <div style={{
                                                width: '32px', height: '32px', background: '#f0f9fa', borderRadius: '8px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px'
                                            }}>🔗</div>
                                            <a
                                                href={link.linkUrl.startsWith('http') ? link.linkUrl : `https://${link.linkUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    fontSize: '13px', color: '#0a7e8c', fontWeight: '600',
                                                    maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap', textDecoration: 'none'
                                                }}
                                            >
                                                {link.linkUrl}
                                            </a>
                                        </div>
                                        {!isWorkSubmitted && (
                                            <svg onClick={(e) => { e.stopPropagation(); handleRemoveLink(link.linkId); }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" style={{ cursor: 'pointer', transition: 'stroke 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.stroke = '#ff4d4f'} onMouseLeave={(e) => e.currentTarget.style.stroke = '#ccc'}>
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        )}
                                    </div>
                                ))}
                            </div>                             <div className="extracted-style-61" style={{ position: 'relative', marginTop: '15px' }}>
                                <input
                                    type="file"
                                    id="work-file-input"
                                    style={{ display: 'none' }}
                                    onChange={handleFileUpload}
                                    multiple
                                />
                                {isWorkMenuOpen && (
                                    <div id="add-create-menu" className="extracted-style-63" style={{ display: 'block' }}>
                                        <div className="extracted-style-66" style={{ cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }} onClick={() => { document.getElementById('work-file-input').click(); setIsWorkMenuOpen(false); }}>
                                            <img src={uploadSign} alt="File" className="extracted-style-67" /> File
                                        </div>
                                        <div className="extracted-style-66" style={{ cursor: 'pointer' }} onClick={() => { setIsAddingLink(true); setIsWorkMenuOpen(false); }}>
                                            <span style={{ fontSize: '18px', marginRight: '10px' }}>🔗</span> Link
                                        </div>
                                    </div>
                                )}

                                <button
                                    className="extracted-style-62"
                                    id="extracted-el-3"
                                    onClick={() => setIsWorkMenuOpen(!isWorkMenuOpen)}
                                    disabled={isWorkSubmitted}
                                >
                                    Add or create
                                </button>
                            </div>

                            {/* Submit / Unsubmit Button */}
                            {(uploadedWork.length > 0 || uploadedLinks.length > 0 || isWorkSubmitted) && (
                                <button
                                    onClick={toggleWorkSubmission}
                                    style={{
                                        width: '100%',
                                        marginTop: '15px',
                                        padding: '10px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        fontWeight: '700',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        background: isWorkSubmitted ? '#e0e0e0' : '#0a7e8c',
                                        color: isWorkSubmitted ? '#666' : 'white',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {isWorkSubmitted ? 'Unsubmit' : 'Submit'}
                                </button>
                            )}

                            {/* Grading Section */}
                            {(isLeader || group.grades !== null) && (
                                <div className="extracted-style-69" style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {isLeader ? (
                                        <>
                                            <input
                                                type="text"
                                                placeholder="Add grade"
                                                className="extracted-style-70"
                                                value={gradeValue}
                                                onChange={(e) => setGradeValue(e.target.value)}
                                                onKeyDown={handleGradeUpdate}
                                            />
                                            <span style={{ fontSize: '16px', fontWeight: '600', color: '#555' }}>/ {assignment?.points || 100}</span>
                                        </>
                                    ) : (
                                        <div style={{ padding: '10px 15px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef', width: '100%', textAlign: 'center' }}>
                                            <span style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>Grade: </span>
                                            <span style={{ fontSize: '18px', color: '#2c3e50', fontWeight: '700' }}>{group.grades} / {assignment?.points || 100}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Group Comments Card */}
                        <div className="extracted-style-71">
                            <div className="extracted-style-72">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                                <span className="extracted-style-73">Group Comments</span>
                            </div>
                            <div className="extracted-style-74"></div>
                            <div className="comment-list-scroll" style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {comments && comments.length > 0 ? (
                                    comments.map((comment) => {
                                        const dt = new Date(comment.createdAt);
                                        const dateStr = dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toUpperCase();
                                        const timeStr = dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
                                        return (
                                            <Message
                                                key={comment.groupCommentId}
                                                name={`${comment.firstName} ${comment.lastName}`}
                                                date={dateStr}
                                                time={timeStr}
                                                text={comment.comment}
                                            />
                                        );
                                    })
                                ) : (
                                    <p style={{ textAlign: 'center', padding: '10px', color: '#999', fontSize: '13px' }}>No comments yet.</p>
                                )}
                            </div>
                            <div className="extracted-style-82" style={{ borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>
                                <input
                                    type="text"
                                    placeholder="Add comment...."
                                    className="extracted-style-84"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyDown={handleAddComment}
                                    style={{ border: 'none', background: 'transparent', width: '100%' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Rubric Summary Section — only shown if rubric exists */}
                {assignment?.criteria?.length > 0 && (
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#1a1f36', letterSpacing: '-0.01em' }}>Evaluation Rubric</h3>
                            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, #eee, transparent)' }}></div>
                        </div>
                        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #eee', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                            <div style={{ padding: '20px' }}>
                                <Rubric
                                    criterias={assignment.criteria.map(c => c.title)}
                                    levels={assignment.levels.map(l => l.title)}
                                    cells={assignment.rubricCells || []}
                                    readOnly={true}
                                    fullWidth={true}
                                    selections={rubricSelections}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* AI Summary & Chart Section */}
                <div className="detail-content-grid" style={{ marginTop: '40px', alignItems: 'flex-start', }}>
                    {/* AI Summary Box */}
                    <div className="column-main sidebar-card" style={{ minHeight: '220px', }}>
                        <div className="ai-section-header"
                            style={{ borderBottom: '2px solid #ddd', paddingBottom: '15px', marginBottom: '15px', width: '100%', }}>
                            <img src={aiSign} alt="AI Icon"
                                style={{ width: '24px', height: '24px', }} />
                            <span className="ai-summary-text-gradient ai-summary-text-gradient-large">AI Summary</span>
                        </div>
                        {/* AI Summary Placeholder */}
                        <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
                            The group has completed most tasks on time. Cooperation is high, but technical hurdles in task #3 required additional meetings.
                        </p>
                    </div>

                    {/* Pie Chart Column */}
                    <div className="column-sidebar"
                        style={{ alignItems: 'center', justifyContent: 'center', position: 'relative', height: '300px', display: 'flex' }}>
                        {(() => {
                            // Calculate Workload Contribution
                            // 1. Get each member's total progress (sum of task progress)
                            const memberProgress = group.members.map(m => {
                                const totalProg = m.tasks?.reduce((sum, t) => sum + (t.progress || 0), 0) || 0;
                                return { name: m.firstName, progress: totalProg };
                            });

                            // 2. Calculate Total Group Progress
                            const totalGroupProgress = memberProgress.reduce((sum, m) => sum + m.progress, 0);

                            // 3. Calculate Percentages (Totaling 100%)
                            const workloadData = memberProgress.map(m => ({
                                name: m.name,
                                percentage: totalGroupProgress > 0 ? (m.progress / totalGroupProgress) * 100 : (100 / group.members.length)
                            }));

                            // 4. Build Conic Gradient String
                            const colors = ['#71E2Db', '#47BBD6', '#2F8EBA', '#1a5f7a', '#a8dadc'];
                            let currentPercent = 0;
                            const gradientParts = workloadData.map((m, i) => {
                                const start = currentPercent;
                                currentPercent += m.percentage;
                                return `${colors[i % colors.length]} ${start}% ${currentPercent}%`;
                            });

                            return (
                                <div style={{
                                    position: 'relative',
                                    width: '220px',
                                    height: '220px',
                                    borderRadius: '50%',
                                    background: `conic-gradient(${gradientParts.join(', ')})`,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                }}>
                                    {/* Labels */}
                                    {workloadData.map((m, i) => {
                                        // Calculate position based on the middle of the segment
                                        let cumulative = 0;
                                        for (let j = 0; j < i; j++) cumulative += workloadData[j].percentage;
                                        const middlePercent = cumulative + (m.percentage / 2);
                                        const angle = (middlePercent / 100) * 360 - 90; // -90 to start from top
                                        const radius = 140; // distance from center
                                        const x = Math.cos(angle * (Math.PI / 180)) * radius;
                                        const y = Math.sin(angle * (Math.PI / 180)) * radius;

                                        return (
                                            <div key={i} style={{
                                                position: 'absolute',
                                                top: `calc(50% + ${y}px)`,
                                                left: `calc(50% + ${x}px)`,
                                                transform: 'translate(-50%, -50%)',
                                                fontSize: '12px',
                                                fontWeight: '700',
                                                color: '#333',
                                                textAlign: 'center',
                                                lineHeight: '1.2',
                                                background: 'rgba(255,255,255,0.8)',
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                whiteSpace: 'nowrap',
                                                pointerEvents: 'none'
                                            }}>
                                                {m.name}<br />{Math.round(m.percentage)}%
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })()}
                    </div>
                </div>

                {/* Meeting Tracking Section */}
                <div style={{ marginTop: '50px', width: '100%', marginBottom: '50px', }}>
                    <h2 className="dashboard-section-title-gradient" style={{ marginBottom: '20px', }}>Meeting Tracking</h2>
                    <table className="task-history-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#0a7e8c15', }}>
                                <th style={{ padding: '15px', textAlign: 'center', border: '1px solid #ccc', fontWeight: '700', color: '#0a7e8c', }}>Date</th>
                                {students.map(s => (
                                    <th key={s.userId} style={{ padding: '15px', textAlign: 'center', border: '1px solid #ccc', fontWeight: '700', color: '#0a7e8c', }}>
                                        {s.firstName} {s.lastName}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody style={{ background: 'white', }}>
                            {sortedPivotDates.length > 0 ? (
                                sortedPivotDates.map(date => (
                                    <tr key={date}>
                                        <td style={{ padding: '22px', textAlign: 'left', border: '1px solid #e5e5e5', color: '#333', fontSize: '13px', }}>{date}</td>
                                        {students.map(s => (
                                            <td key={s.userId} style={{ padding: '22px', textAlign: 'center', border: '1px solid #e5e5e5', color: '#333', fontSize: '13px', }}>
                                                {pivotTracking[date][s.userId] || '-'}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={students.length + 1} style={{ padding: '22px', textAlign: 'center', border: '1px solid #e5e5e5', color: '#999' }}>
                                        No meeting records available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Student Tasks Progress Section */}
                <TaskCard
                    studentsData={studentsTasksData}
                    onAddTask={openAddTaskModal}
                    onOpenDetail={openTaskDetail}
                />
            </div>

            {
                isEditModalOpen && (
                    <CreateGroupModal
                        onClose={() => setIsEditModalOpen(false)}
                        onSuccess={handleEditSuccess}
                        assignmentId={group.assignmentId}
                        classId={group.classId}
                        initialGroup={group}
                    />
                )
            }

            <AddTaskModal
                key={selectedMember?.userId || 'new-task'}
                isOpen={isAddTaskModalOpen}
                onClose={() => setIsAddTaskModalOpen(false)}
                member={selectedMember}
                groupId={groupId}
                assignmentId={group.assignmentId}
                onSuccess={fetchGroupData}
            />

            {
                popupMessage && (
                    <MessagePopup
                        theme={popupMessage.theme || 'green'}
                        onClose={() => setPopupMessage(null)}
                    >
                        {popupMessage.message}
                    </MessagePopup>
                )
            }

            <LinkModal
                isOpen={isAddingLink}
                onClose={() => setIsAddingLink(false)}
                onAdd={(url) => {
                    handleLinkAdd(url);
                }}
            />
        </section >
    );
}