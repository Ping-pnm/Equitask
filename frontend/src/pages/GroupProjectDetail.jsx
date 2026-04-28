import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import groupSign from '../assets/groupSign.png';
import googlemeetSign from '../assets/googlemeetSign.png';
import gearEditSign from '../assets/gearEditSign.png';
import aiSign from '../assets/Ai-sign.png';
import uploadSign from '../assets/UploadSign.png';
import {
    getGroup, getAssignment, getGroupComments, addGroupComment,
    trackMeetJoin, getMeetTracking, uploadGroupWork, deleteGroupWork, submitGroupWork
} from '../services/workService';
import LoadingSpinner from '../components/LoadingSpinner';
import CreateGroupModal from '../components/Work/CreateGroupModal';
import Rubric from '../components/Rubric';
import Message from '../components/Dashboard/Message';
import { useAuth } from '../components/AuthContext';
import { useClass } from '../components/ClassContext';
import MessagePopup from '../components/MessagePopup';
import TaskCard from '../components/Dashboard/TaskCard';
import AddTaskModal from '../components/Dashboard/AddTaskModal';
import TaskDetail from '../components/Dashboard/TaskDetail';

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
    const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedTaskName, setSelectedTaskName] = useState('');
    const [popupMessage, setPopupMessage] = useState(null);

    // Work Section States
    const [isWorkMenuOpen, setIsWorkMenuOpen] = useState(false);
    const [uploadedWork, setUploadedWork] = useState([]);
    const [isWorkSubmitted, setIsWorkSubmitted] = useState(false);

    const fetchGroupData = async () => {
        try {
            const groupData = await getGroup(groupId);
            setGroup(groupData);
            setUploadedWork(groupData.files || []);
            setIsWorkSubmitted(!!groupData.isSubmitted);

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
            setPopupMessage("No Meet link available for this group.");
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

    const toggleWorkSubmission = async () => {
        const newStatus = !isWorkSubmitted;
        try {
            await submitGroupWork(groupId, group.assignmentId, newStatus);
            setIsWorkSubmitted(newStatus);
            setPopupMessage({
                message: newStatus ? "Work submitted successfully!" : "Work unsubmitted",
                theme: 'green'
            });
        } catch (err) {
            console.error("Submission error:", err);
            setPopupMessage({ message: "Failed to update submission status", theme: 'red' });
        }
    };

    const openTaskDetail = (student, task) => {
        setSelectedStudent(student);
        setSelectedTaskName(task);
        setIsTaskDetailOpen(true);
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
            tasks: member.tasks?.map(t => ({
                name: t.name,
                status: t.status,
                progress: t.progress,
                aiSummary: t.aiSummary
            })) || []
        };
    }) || [];

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
                <Link to={`/project/${group.assignmentId}`} id="extracted-el-2" className="extracted-style-20" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back to Group Project
                </Link>

                {/* Consolidated Header & Main Content Grid */}
                <div className="detail-content-grid" style={{ alignItems: 'flex-start', marginTop: '10px' }}>

                    {/* Left Side: Title & Members */}
                    <div className="column-main" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        {/* Group Title Area */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '16px', textAlign: 'center' }}>
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
                            <div className="member-table-wrapper">
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



                        {/* AI Rubric Summary Section */}
                        <div className="extracted-style-44">
                            <div className="extracted-style-45">
                                <img src={aiSign} alt="AI Icon" className="extracted-style-46" />
                                <h2 className="ai-summary-text-gradient ai-summary-text-gradient-large" style={{ margin: '0', lineHeight: '1.2' }}>AI Group Rubric Summary</h2>
                            </div>
                            <div className="extracted-style-48" style={{ overflowX: 'auto', maxWidth: '100%' }}>
                                {assignment && assignment.criteria && assignment.criteria.length > 0 ? (
                                    <Rubric
                                        criterias={assignment.criteria.map(c => c.title)}
                                        levels={assignment.levels.map(l => l.title)}
                                        cells={assignment.rubricCells}
                                        readOnly={true}
                                    />
                                ) : (
                                    <p style={{ textAlign: 'center', padding: '20px', color: '#999' }}>No rubric defined for this assignment.</p>
                                )}
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
                                {uploadedWork.map((file, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'white', borderRadius: '8px', border: '1px solid #eee' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '30px', height: '30px', background: '#f0f0f0', borderRadius: '4px' }}></div>
                                            <a
                                                href={`http://localhost:3000/${file.fileUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ fontSize: '13px', color: '#0a7e8c', fontWeight: '600', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: 'none' }}
                                            >
                                                {file.fileUrl.split('/').pop()}
                                            </a>
                                        </div>
                                        {!isWorkSubmitted && (
                                            <svg onClick={() => handleRemoveWork(idx)} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" style={{ cursor: 'pointer' }}>
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="extracted-style-61" style={{ position: 'relative', marginTop: '15px' }}>
                                {isWorkMenuOpen && (
                                    <div id="add-create-menu" className="extracted-style-63" style={{ display: 'block' }}>
                                        <div className="extracted-style-66" style={{ cursor: 'pointer' }} onClick={() => document.getElementById('work-file-input').click()}>
                                            <img src={uploadSign} alt="File" className="extracted-style-67" /> File
                                            <input
                                                type="file"
                                                id="work-file-input"
                                                style={{ display: 'none' }}
                                                onChange={handleFileUpload}
                                                multiple
                                            />
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
                            {uploadedWork.length > 0 && (
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

                            {isLeader && (
                                <div className="extracted-style-69" style={{ marginTop: '20px' }}>
                                    <input type="text" placeholder="Add grade" className="extracted-style-70" /> / 100
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
                        {/* Placeholder content */}
                    </div>

                    {/* Pie Chart Column */}
                    <div className="column-sidebar"
                        style={{ alignItems: 'center', justifyContent: 'center', position: 'relative', height: '220px', }}>
                        <div style={{
                            position: 'relative',
                            width: '220px',
                            height: '220px',
                            borderRadius: '50%',
                            background: 'conic-gradient(#71E2Db 0% 33.3%, #47BBD6 33.3% 77.7%, #2F8EBA 77.7% 100%)'
                        }}>
                            {/* Labels */}
                            <div
                                style={{ position: 'absolute', top: '15%', right: '-50px', fontSize: '11px', color: '#111', textAlign: 'center', lineHeight: '1.2', }}>
                                Student 1<br />33.3%</div>
                            <div
                                style={{ position: 'absolute', bottom: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '11px', color: '#111', textAlign: 'center', lineHeight: '1.2', }}>
                                Student 2<br />44.4%</div>
                            <div
                                style={{ position: 'absolute', top: '5%', left: '-50px', fontSize: '11px', color: '#111', textAlign: 'center', lineHeight: '1.2', }}>
                                Student 3<br />22.2%</div>
                        </div>
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

            {isEditModalOpen && (
                <CreateGroupModal
                    onClose={() => setIsEditModalOpen(false)}
                    onSuccess={handleEditSuccess}
                    assignmentId={group.assignmentId}
                    classId={group.classId}
                    initialGroup={group}
                />
            )}

            <AddTaskModal
                key={selectedMember?.userId || 'new-task'}
                isOpen={isAddTaskModalOpen}
                onClose={() => setIsAddTaskModalOpen(false)}
                member={selectedMember}
                groupId={groupId}
                assignmentId={group.assignmentId}
                onSuccess={fetchGroupData}
            />

            <TaskDetail
                isOpen={isTaskDetailOpen}
                onClose={() => setIsTaskDetailOpen(false)}
                studentName={selectedStudent}
                taskName={selectedTaskName}
                groupName={group.groupName}
            />

            {popupMessage && (
                <MessagePopup
                    theme={popupMessage.theme || 'green'}
                    onClose={() => setPopupMessage(null)}
                >
                    {popupMessage.message}
                </MessagePopup>
            )}
        </section >
    );
}