import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import groupSign from '../assets/groupSign.png';
import taskSign from '../assets/taskSign.png';
import aiSign from '../assets/Ai-sign.png';
import uploadSign from '../assets/UploadSign.png';
import Rubric from '../components/Rubric';
import StatusBadge from '../components/Dashboard/StatusBadge';
import { getTaskDetail, uploadTaskWork, deleteTaskWork, submitTaskWork, getAssignment, addLink, deleteLink } from '../services/workService';
import MessagePopup from '../components/MessagePopup';
import AttachmentDisplay from '../components/AttachmentDisplay';
import { useClass } from '../components/ClassContext';
import LinkModal from '../components/Work/LinkModal';

export default function TaskDetail() {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const { isLeader } = useClass();

    const [task, setTask] = useState(null);
    const [assignment, setAssignment] = useState(null);
    const [uploadedWork, setUploadedWork] = useState([]);
    const [uploadedLinks, setUploadedLinks] = useState([]);
    const [isWorkSubmitted, setIsWorkSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isWorkMenuOpen, setIsWorkMenuOpen] = useState(false);
    const [isAddingLink, setIsAddingLink] = useState(false);
    const [newLinkUrl, setNewLinkUrl] = useState('');
    const [rubricSelections, setRubricSelections] = useState(null);

    useEffect(() => {
        if (taskId) {
            fetchData();
        }
    }, [taskId]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const taskData = await getTaskDetail(taskId);

            if (!taskData) {
                setTask(null);
                return;
            }

            setTask(taskData);
            setUploadedWork(taskData.files || []);
            setUploadedLinks(taskData.links || []);
            setIsWorkSubmitted(!!taskData.isSubmitted);

            // Use rubric data from task directly (task now only has its own rubric, no assignment fallback)
            if (taskData.criteria) {
                taskData.criteria.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            }
            if (taskData.levels) {
                taskData.levels.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            }
            setAssignment(taskData);
        } catch (err) {
            console.error("Failed to fetch task detail:", err);
            setTask(null);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateAccuracy = (overrideSelections = null) => {
        if (!assignment?.criteria || !assignment?.levels) return 0;

        // 1. Sort levels to establish the true Best (index 0) to Worst order
        const sortedLevels = [...assignment.levels].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        const totalLevels = sortedLevels.length;
        if (totalLevels === 0) return 0;
        const divisor = totalLevels > 1 ? (totalLevels - 1) : 1;

        const activeSelections = overrideSelections || rubricSelections;
        if (!activeSelections) return 0;

        let totalPoints = 0;

        assignment.criteria.forEach((criteria, criteriaIdx) => {
            let selectedLevelId = null;

            // Scenario A: Reading from local state (an array of raw indices like [0, 2, -1])
            if (typeof activeSelections[criteriaIdx] === 'number') {
                const rawIndex = activeSelections[criteriaIdx];
                if (rawIndex >= 0) {
                    // Get the ID from the unsorted array so we know exactly what was clicked
                    selectedLevelId = assignment.levels[rawIndex]?.levelId;
                }
            }
            // Scenario B: Reading from the submission override (an array of objects)
            else if (Array.isArray(activeSelections)) {
                const sel = activeSelections.find(s => s.criteriaId === criteria.criteriaId);
                selectedLevelId = sel?.levelId;
            }

            // 2. If a valid selection exists, calculate based on its SORTED rank
            if (selectedLevelId) {
                const rankIndex = sortedLevels.findIndex(l => l.levelId === selectedLevelId);

                if (rankIndex !== -1) {
                    // Calculate percentage (rankIndex 0 = 100%, highest rankIndex = 0%)
                    const rowScore = ((totalLevels - 1 - rankIndex) / divisor) * 100;
                    totalPoints += rowScore;
                    console.log(`Evaluating Criteria: ${criteria.title} | Rank: ${rankIndex} | Score: ${rowScore.toFixed(1)}%`);
                }
            }
        });

        const numCriteria = assignment.criteria.length;
        return numCriteria > 0 ? Math.round(totalPoints / numCriteria) : 0;
    };

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        try {
            const response = await uploadTaskWork(taskId, task.groupId, task.assignmentId, files);
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

    const handleLinkAdd = async (url) => {
        const linkUrl = url || newLinkUrl;
        if (!linkUrl.trim()) return;
        try {
            const res = await addLink({
                linkUrl: linkUrl,
                assignmentId: task.assignmentId,
                taskId: taskId
            });
            setUploadedLinks(prev => [...prev, { linkId: res.linkId, linkUrl: linkUrl }]);
            setNewLinkUrl('');
            setIsAddingLink(false);
            setIsWorkMenuOpen(false);
        } catch (err) {
            console.error("Link add error:", err);
        }
    };

    const handleRemoveLink = async (linkId) => {
        try {
            await deleteLink(linkId);
            setUploadedLinks(prev => prev.filter(l => l.linkId !== linkId));
        } catch (err) {
            console.error("Remove link error:", err);
        }
    };

    const toggleWorkSubmission = async () => {
        const newStatus = !isWorkSubmitted;

        try {
            const result = await submitTaskWork(taskId, newStatus);
            setIsWorkSubmitted(newStatus);

            // Update local rubric selections for immediate UI feedback if submitting
            if (newStatus && result.selections && assignment?.levels) {
                const newIndices = assignment.criteria.map(c => {
                    const sel = result.selections.find(s => s.criteriaId === c.criteriaId);
                    if (!sel) return -1;
                    return assignment.levels.findIndex(l => l.levelId === sel.levelId);
                });
                setRubricSelections(newIndices);
            } else if (!newStatus) {
                // Clear local selections on unsubmit if desired
                setRubricSelections(null);
            }

            // Re-fetch data to get updated logs and stats
            fetchData();
        } catch (err) {
            console.error("Submission error:", err);
        }
    };

    useEffect(() => {
        const hasLogs = task?.logs && task.logs.length > 0;

        if (isWorkSubmitted && assignment?.criteria && hasLogs && !rubricSelections) {
            const currentSelections = assignment.criteria.map((c) => {
                if (c.selectedLevelId) {
                    const levelIdx = assignment.levels.findIndex(l => l.levelId === c.selectedLevelId);
                    if (levelIdx !== -1) return levelIdx;
                }
                // No default/random selection if not in DB
                return -1;
            });

            // Only set if we actually have valid selections (any index >= 0)
            if (currentSelections.some(idx => idx >= 0)) {
                setRubricSelections(currentSelections);
            } else {
                setRubricSelections(null);
            }
        } else if (!isWorkSubmitted || !hasLogs) {
            setRubricSelections(null);
        }
    }, [isWorkSubmitted, assignment, rubricSelections, task?.logs]);

    if (isLoading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading task...</div>;
    if (!task) return <div style={{ padding: '50px', textAlign: 'center' }}>Task not found.</div>;

    const taskName = task.name;
    const taskProgress = task.progress || 0;
    const taskDescription = task.instruction || task.details || task.description || "No description provided.";
    const taskLogs = task.logs || [];


    return (
        <div className="main-container-no-padding" style={{ background: '#fcfcfc', height: '100%', overflowY: 'auto', padding: '60px 40px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'none',
                        border: 'none',
                        color: '#666',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginBottom: '20px',
                        padding: 0
                    }}
                >
                    <span style={{ fontSize: '20px' }}>←</span> Back
                </button>

                {/* 1. Breadcrumb Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
                    <img src={groupSign} alt="Group" style={{ width: '60px', height: '60px' }} />
                    <h1 style={{ fontSize: '32px', fontWeight: '800', margin: 0, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        {task.groupName || 'Group Project'} <span style={{ color: '#ccc', fontWeight: '300' }}>&gt;</span> {task.studentName || 'Student'}
                    </h1>
                </div>

                {/* 2. Task Row with Progress */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
                    <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={taskSign} alt="Task" style={{ width: '40px', height: '40px' }} />
                    </div>
                    <h2 style={{ fontSize: '28px', fontWeight: '700', margin: 0, color: '#333' }}>{taskName}</h2>

                    <div style={{ flex: '1', maxWidth: '400px', height: '12px', background: '#f0f0f0', borderRadius: '6px', margin: '0 20px', overflow: 'hidden', position: 'relative' }}>
                        <div style={{ width: `${taskProgress}%`, height: '100%', background: 'linear-gradient(90deg, #0a7e8c, #2ab3d6)', borderRadius: '6px', transition: 'width 0.5s ease' }}></div>
                    </div>
                    <span style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a1a' }}>{taskProgress}%</span>
                </div>

                {/* 3. Description */}
                <div style={{ paddingLeft: '68px', marginBottom: '40px' }}>
                    <p style={{ fontSize: '18px', color: '#666', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap' }}>{taskDescription}</p>
                </div>

                <div style={{ display: 'flex', gap: '50px' }}>
                    {/* Left Column */}
                    <div style={{ flex: '1' }}>
                        {/* Activity Table */}
                        <div style={{ marginBottom: '50px' }}>
                            <div style={{ borderTop: '1px solid #eee', paddingTop: '30px' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: '#e0f2f1' }}>
                                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '800', color: '#004d40' }}>Date Last Updated</th>
                                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '800', color: '#004d40' }}>Message (activity)</th>
                                            <th style={{ padding: '15px', textAlign: 'center', fontSize: '14px', fontWeight: '800', color: '#004d40' }}>Accuracy</th>
                                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '800', color: '#004d40' }}>AI Comments</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {taskLogs.length > 0 ? taskLogs.map((log, idx) => (
                                            <tr key={log.attempt_id || idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                                <td style={{ padding: '15px', fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                                                    <span style={{ background: '#f5f5f5', padding: '4px 10px', borderRadius: '15px' }}>
                                                        {new Date(log.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '15px', fontSize: '14px', color: '#444' }}>{log.message || '-'}</td>
                                                <td style={{ padding: '15px', textAlign: 'center', fontSize: '14px', fontWeight: '700', color: '#1a1a1a' }}>{log.progress}%</td>
                                                <td style={{ padding: '15px', fontSize: '13px', color: '#888' }}>-</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: '#999' }}>No activity records yet</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* AI Rubrics Section */}
                        {assignment?.criteria?.length > 0 && (
                            <div style={{ marginTop: '60px', borderTop: '1px solid #eee', paddingTop: '40px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#1a1f36', letterSpacing: '-0.02em' }}>AI Rubrics</h3>
                                    <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, #eee, transparent)' }}></div>
                                </div>
                                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #eee', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                                    <div style={{ padding: '20px 25px', background: '#fafbfc', borderBottom: '1px solid #eee' }}>
                                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#4f566b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rubric Detail</h4>
                                    </div>
                                    <div style={{ padding: '25px' }}>
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
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div style={{ width: '380px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        {/* Your Work Card */}
                        <div style={{ background: '#f5f7f8', borderRadius: '20px', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                <h3 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#1a1a1a' }}>Your Work</h3>
                                <StatusBadge progress={taskProgress} />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' }}>
                                <AttachmentDisplay 
                                    files={uploadedWork.map(f => {
                                        if (f instanceof File) return f;
                                        return { ...f, isExisting: true };
                                    })} 
                                    onDelete={!isWorkSubmitted ? (index) => handleRemoveWork(uploadedWork[index].fileId) : null} 
                                />

                                {uploadedLinks.map((link, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'white', borderRadius: '12px', border: '1px solid #eef',
                                        transition: 'all 0.2s ease'
                                    }}
                                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0a7e8c'}
                                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#eef'}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, overflow: 'hidden' }}>
                                            <div style={{ width: '32px', height: '32px', background: '#f0f9fa', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🔗</div>
                                            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                                <a href={link.linkUrl.startsWith('http') ? link.linkUrl : `https://${link.linkUrl}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: '#0a7e8c', fontWeight: '700', textDecoration: 'none', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {link.linkUrl}
                                                </a>
                                                <span style={{ fontSize: '10px', color: '#999' }}>External Link</span>
                                            </div>
                                        </div>
                                        {!isWorkSubmitted && (
                                            <button onClick={() => handleRemoveLink(link.linkId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', padding: '5px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ff4d4f'} onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {!isWorkSubmitted && (
                                    <div style={{ position: 'relative' }}>
                                        <input type="file" id="work-file-input" style={{ display: 'none' }} onChange={handleFileUpload} multiple />
                                        {isWorkMenuOpen && (
                                            <div style={{ position: 'absolute', bottom: '110%', left: 0, right: 0, background: 'white', border: '1px solid #eee', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.12)', zIndex: 20 }}>
                                                <div onClick={() => { document.getElementById('work-file-input').click(); setIsWorkMenuOpen(false); }} style={{ padding: '16px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f0f0f0' }}>
                                                    <img src={uploadSign} alt="Upload" style={{ width: '18px', height: '18px' }} /> Upload from device
                                                </div>
                                                <div onClick={() => setIsAddingLink(true)} style={{ padding: '16px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <span style={{ fontSize: '18px' }}>🔗</span> Add Link
                                                </div>
                                            </div>
                                        )}

                                        <button onClick={() => setIsWorkMenuOpen(!isWorkMenuOpen)} style={{ width: '100%', padding: '14px', background: 'white', color: '#666', border: '1px solid #ddd', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>+ Add or Create</button>
                                    </div>
                                )}
                            </div>

                            {(true) && (
                                <button onClick={toggleWorkSubmission} style={{ width: '100%', padding: '16px', borderRadius: '25px', border: '1px solid #0a7e8c', fontWeight: '800', cursor: 'pointer', background: isWorkSubmitted ? 'transparent' : '#0a7e8c', color: isWorkSubmitted ? '#0a7e8c' : 'white', transition: 'all 0.2s' }}>
                                    {isWorkSubmitted ? 'Unsubmit' : 'Submit for Grading'}
                                </button>
                            )}
                        </div>

                        {/* AI Summary Card */}
                        <div style={{ background: '#f5f7f8', borderRadius: '20px', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                <img src={aiSign} alt="AI" style={{ width: '20px', height: '20px' }} />
                                <h3 className="ai-summary-text-gradient" style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>AI Summary</h3>
                            </div>
                            <p style={{ fontSize: '14px', color: '#4a4a4a', lineHeight: '1.7', margin: 0 }}>
                                {task.aiSummary || "According to the rubric, I suggest you to check your submission for alignment with the criteria levels. Further feedback will be generated upon submission."}
                            </p>
                        </div>

                    </div>
                </div>
            </div>
            <LinkModal
                isOpen={isAddingLink}
                onClose={() => setIsAddingLink(false)}
                onAdd={(url) => {
                    handleLinkAdd(url);
                }}
            />
        </div>
    );
}