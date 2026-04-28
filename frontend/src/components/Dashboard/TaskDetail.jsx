import React, { useState, useEffect } from 'react';
import groupSign from '../../assets/groupSign.png';
import taskSign from '../../assets/taskSign.png';
import aiSign from '../../assets/Ai-sign.png';
import uploadSign from '../../assets/UploadSign.png';
import Rubric from '../Rubric';
import StatusBadge from './StatusBadge';
import { getTaskDetail, uploadTaskWork, deleteTaskWork, submitTaskWork } from '../../services/workService';
import { useClass } from '../../components/ClassContext';
import { useAuth } from '../../components/AuthContext';

export default function TaskDetail({ isOpen, onClose, studentName, task, groupName, assignment }) {
    const { isLeader } = useClass();
    const [uploadedWork, setUploadedWork] = useState([]);
    const [isWorkSubmitted, setIsWorkSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isWorkMenuOpen, setIsWorkMenuOpen] = useState(false);

    useEffect(() => {
        if (isOpen && task?.taskId) {
            fetchTaskData();
        }
    }, [isOpen, task?.taskId]);

    const fetchTaskData = async () => {
        try {
            setIsLoading(true);
            const data = await getTaskDetail(task.taskId);
            setUploadedWork(data.files || []);
            setIsWorkSubmitted(!!data.isSubmitted);
        } catch (err) {
            console.error("Failed to fetch task detail:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        try {
            const response = await uploadTaskWork(task.taskId, task.groupId, task.assignmentId, files);
            setUploadedWork(prev => [...prev, ...response.files]);
            setIsWorkMenuOpen(false);
        } catch (err) {
            console.error("Upload error:", err);
        }
    };

    const handleRemoveWork = async (fileId) => {
        try {
            await deleteTaskWork(fileId);
            setUploadedWork(prev => prev.filter(f => f.fileId !== fileId));
        } catch (err) {
            console.error("Remove error:", err);
        }
    };

    const toggleWorkSubmission = async () => {
        const newStatus = !isWorkSubmitted;
        try {
            await submitTaskWork(task.taskId, newStatus);
            setIsWorkSubmitted(newStatus);
        } catch (err) {
            console.error("Submission error:", err);
        }
    };

    if (!isOpen || !task) return null;

    const taskName = task.name;
    const taskProgress = task.progress || 0;
    const taskDescription = task.instruction || task.details || task.description || "No description provided.";

    return (
        <section id="dashboard-task-detail-view" className="stream-content dashboard-view-detail"
            style={{
                display: 'block',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 1000,
                background: '#f4f7f9',
                overflowY: 'auto',
                padding: '20px'
            }}>
            <div className="main-dashboard-wrapper" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Breadcrumbs / Header */}
                <div onClick={onClose} id="btn-back-to-group" className="breadcrumb-container" style={{ cursor: 'pointer', marginBottom: '20px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    <div className="breadcrumb-content">
                        <img src={groupSign} alt="Group" className="breadcrumb-logo" />
                        <span className="breadcrumb-text">{groupName} <span className="breadcrumb-separator">&gt;</span> <span
                            id="task-detail-student-name">{studentName}</span></span>
                    </div>
                </div>

                {/* Content Grid: Left Main + Right Sidebar */}
                <div className="detail-content-grid">

                    {/* Left Column */}
                    <div className="column-main">
                        {/* Task Header Section */}
                        <div className="task-header-row">
                            <img src={taskSign} alt="Task" style={{ width: '32px', height: '32px' }} />
                            <span id="task-detail-task-name" className="task-header-title">{taskName}</span>
                            <div className="task-progress-container">
                                <div className="task-progress-fill" style={{ width: `${taskProgress}%` }}></div>
                            </div>
                            <span className="task-percent-text">{taskProgress}%</span>
                        </div>

                        <div className="task-text-description" dangerouslySetInnerHTML={{ __html: taskDescription.replace(/\n/g, '<br />') }}>
                        </div>

                        <div className="horizontal-divider"></div>

                        {/* Update History Table */}
                        <table className="task-history-table">
                            <thead>
                                <tr>
                                    <th>Date Last Updated</th>
                                    <th>Message (git commit)</th>
                                    <th style={{ textAlign: 'center' }}>Accuracy</th>
                                    <th>AI Comments</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>-</td>
                                    <td>No commits yet</td>
                                    <td style={{ textAlign: 'center' }}>0%</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Right Sidebar */}
                    <div className="column-sidebar">

                        {/* Work Card */}
                        <div className="extracted-style-57" style={{ marginTop: '0' }}>
                            <div className="extracted-style-58">
                                <span className="extracted-style-59">Work</span>
                                <StatusBadge progress={isWorkSubmitted ? 100 : taskProgress} />
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
                                            <svg onClick={() => handleRemoveWork(file.fileId)} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" style={{ cursor: 'pointer' }}>
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
                                    style={{ width: '100%' }}
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
                        </div>

                        {/* AI Summary Card */}
                        <div className="sidebar-card">
                            <div className="ai-section-header">
                                <img src={aiSign} alt="AI" style={{ width: '18px', height: '18px' }} />
                                <span className="ai-summary-text-gradient" style={{ fontSize: '18px' }}>AI Summary</span>
                            </div>
                            <div className="ai-summary-description">
                                {task.aiSummary || "No AI summary generated for this task yet."}
                            </div>
                        </div>

                    </div>
                </div>

                <div className="horizontal-divider" style={{ margin: '30px 0' }}></div>

                {/* AI Rubrics Section (Full Width) */}
                <div className="ai-rubrics-full-width">
                    <div className="ai-section-header">
                        <img src={aiSign} alt="AI" style={{ width: '24px', height: '24px' }} />
                        <h2 className="ai-summary-text-gradient ai-summary-text-gradient-large">AI Rubrics</h2>
                    </div>

                    <div style={{ marginTop: '15px' }}>
                        {assignment && assignment.criteria && assignment.criteria.length > 0 ? (
                            <Rubric
                                criterias={assignment.criteria.map(c => c.title)}
                                levels={assignment.levels.map(l => l.title)}
                                cells={assignment.rubricCells}
                                readOnly={true}
                                fullWidth={true}
                            />
                        ) : (
                            <p style={{ color: '#999', fontSize: '14px' }}>No rubric defined for this assignment.</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}