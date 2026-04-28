import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import groupSign from '../assets/groupSign.png';
import googlemeetSign from '../assets/googlemeetSign.png';
import gearEditSign from '../assets/gearEditSign.png';
import aiSign from '../assets/Ai-sign.png';
import linkSign from '../assets/LinkSign.png';
import uploadSign from '../assets/UploadSign.png';
import { getGroup, getAssignment, getGroupComments, addGroupComment, trackMeetJoin, getMeetTracking } from '../services/workService';
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
    const [selectedTaskName, setSelectedTaskName] = useState('');
    const [popupMessage, setPopupMessage] = useState(null);

    // Work Section States
    const [isWorkMenuOpen, setIsWorkMenuOpen] = useState(false);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [newLink, setNewLink] = useState('');
    const [uploadedWork, setUploadedWork] = useState([]);
    const [isWorkSubmitted, setIsWorkSubmitted] = useState(false);

    const fetchGroupData = async () => {
        try {
            const groupData = await getGroup(groupId);
            setGroup(groupData);

            // Also fetch assignment for rubrics
            const assignmentData = await getAssignment(groupData.assignmentId);
            setAssignment(assignmentData);

            // Fetch group comments
            fetchComments();

            // Fetch meet tracking
            fetchMeetHistory();
        } catch (err) {
            console.error("Failed to fetch group/assignment details:", err);
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
    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setUploadedWork([...uploadedWork, ...files.map(f => f.name)]);
            setIsWorkMenuOpen(false);
        }
    };

    const handleRemoveWork = (index) => {
        if (isWorkSubmitted) return; // Cannot remove if submitted
        setUploadedWork(uploadedWork.filter((_, i) => i !== index));
    };

    const toggleWorkSubmission = () => {
        setIsWorkSubmitted(!isWorkSubmitted);
    };

    const handleAddLink = () => {
        if (newLink.trim()) {
            setUploadedWork([...uploadedWork, newLink.trim()]);
            setNewLink('');
            setIsLinkModalOpen(false);
            setIsWorkMenuOpen(false);
        }
    };
    const openTaskDetail = (student, task) => {
        setSelectedStudent(student);
        setSelectedTaskName(task);
        setIsTaskDetailOpen(true);
    };

    const openAddTaskModal = (student) => {
        setSelectedStudent(student);
        setIsAddTaskModalOpen(true);
    };

    const studentsTasksData = group?.members?.map((member, index) => {
        const demoData = [
            {
                overallProgress: 26,
                tasks: [
                    { name: "Task 1", status: "IN PROGRESS", progress: 79, aiSummary: "According to the rubric , I suggest you to edit..........................." },
                    { name: "Task 2", status: "WAITING", progress: 0 },
                    { name: "Task 3", status: "WAITING", progress: 0 }
                ]
            },
            {
                overallProgress: 9,
                tasks: [
                    { name: "Task 1", status: "AT RISK", progress: 29, aiSummary: "According to the rubric , I suggest you to edit..........................." },
                    { name: "Task 2", status: "WAITING", progress: 0 },
                    { name: "Task 3", status: "WAITING", progress: 0 }
                ]
            },
            {
                overallProgress: 57,
                tasks: [
                    { name: "Task 1", status: "SUCCESS", progress: 100, aiSummary: "This task is done!" },
                    { name: "Task 2", status: "IN PROGRESS", progress: 71, aiSummary: "According to the rubric , I suggest you to edit..." },
                    { name: "Task 3", status: "WAITING", progress: 0 }
                ]
            }
        ];

        const data = demoData[index] || {
            overallProgress: 0,
            tasks: [
                { name: "Task 1", status: "WAITING", progress: 0 },
                { name: "Task 2", status: "WAITING", progress: 0 },
                { name: "Task 3", status: "WAITING", progress: 0 }
            ]
        };

        return {
            name: `${member.firstName} ${member.lastName}`,
            ...data
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
                                <span className="extracted-style-60">Assigned</span>
                            </div>
                            {/* List of Uploaded Files */}
                            <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {uploadedWork.map((fileName, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'white', borderRadius: '8px', border: '1px solid #eee' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '30px', height: '30px', background: '#f0f0f0', borderRadius: '4px' }}></div>
                                            <span style={{ fontSize: '13px', color: '#333', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName}</span>
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
                                        <div className="extracted-style-64" style={{ cursor: 'pointer' }} onClick={() => setIsLinkModalOpen(true)}>
                                            <img src={linkSign} alt="Link" className="extracted-style-65" /> Link
                                        </div>
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
                isOpen={isAddTaskModalOpen}
                onClose={() => setIsAddTaskModalOpen(false)}
                studentName={selectedStudent}
            />

            <TaskDetail
                isOpen={isTaskDetailOpen}
                onClose={() => setIsTaskDetailOpen(false)}
                studentName={selectedStudent}
                taskName={selectedTaskName}
                groupName={group.groupName}
            />

            {popupMessage && (
                <MessagePopup theme="red" onClose={() => setPopupMessage(null)}>
                    {popupMessage}
                </MessagePopup>
            )}

            {/* Link Modal */}
            {isLinkModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#222' }}>Add Link</h3>
                        <div style={{ paddingBottom: '5px', borderBottom: '1.5px solid #0a7e8c', marginBottom: '30px' }}>
                            <input
                                type="text"
                                placeholder="https://..."
                                value={newLink}
                                onChange={(e) => setNewLink(e.target.value)}
                                style={{ width: '100%', border: 'none', outline: 'none', fontSize: '15px' }}
                                autoFocus
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                            <button
                                onClick={() => setIsLinkModalOpen(false)}
                                style={{ background: 'transparent', border: 'none', color: '#666', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddLink}
                                style={{ background: '#0a7e8c', color: 'white', border: 'none', padding: '8px 25px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section >
    );
}