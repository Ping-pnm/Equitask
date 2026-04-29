import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getAssignment, uploadIndividualWork, deleteIndividualWork, submitIndividualWork, addLink, deleteLink
} from '../services/workService';
import { useAuth } from '../components/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import MessagePopup from '../components/MessagePopup';
import LinkModal from '../components/Work/LinkModal';
import Rubric from '../components/Rubric';
import AttachmentDisplay from '../components/AttachmentDisplay';
import aiSign from '../assets/Ai-sign.png';
import uploadSign from '../assets/UploadSign.png';

export default function IndividualAssignment() {
    const { assignmentId } = useParams();
    const { userId, user } = useAuth();
    const navigate = useNavigate();

    const [assignment, setAssignment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadedWork, setUploadedWork] = useState([]);
    const [uploadedLinks, setUploadedLinks] = useState([]);
    const [isWorkSubmitted, setIsWorkSubmitted] = useState(false);
    const [isWorkMenuOpen, setIsWorkMenuOpen] = useState(false);
    const [isAddingLink, setIsAddingLink] = useState(false);
    const [newLinkUrl, setNewLinkUrl] = useState('');
    const [popupMessage, setPopupMessage] = useState(null);
    const [rubricSelections, setRubricSelections] = useState(null);

    const fetchData = async () => {
        try {
            const data = await getAssignment(assignmentId, userId);
            setAssignment(data);
            setUploadedWork(data.userFiles || []);
            setUploadedLinks(data.userLinks || []);
            setIsWorkSubmitted(!!data.isSubmitted);
        } catch (err) {
            console.error("Failed to fetch assignment data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [assignmentId, userId]);

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        try {
            const response = await uploadIndividualWork(userId, assignmentId, files);
            setUploadedWork(prev => [...prev, ...response.files]);
            setIsWorkMenuOpen(false);
            setPopupMessage({ message: "Files uploaded successfully", theme: 'green' });
        } catch (err) {
            console.error("Upload error:", err);
            setPopupMessage({ message: "Failed to upload files", theme: 'red' });
        }
    };

    const handleRemoveWork = async (fileId) => {
        try {
            await deleteIndividualWork(fileId);
            setUploadedWork(prev => prev.filter(f => f.fileId !== fileId));
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
                assignmentId: assignmentId,
                userId: userId
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
            const result = await submitIndividualWork(userId, assignmentId, newStatus);
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
                // Clear local selections on unsubmit
                setRubricSelections(null);
            }

            setPopupMessage({
                message: newStatus ? "Work submitted successfully!" : "Work unsubmitted",
                theme: 'green'
            });
            fetchData();
        } catch (err) {
            console.error("Submission error:", err);
            setPopupMessage({ message: "Failed to update submission status", theme: 'red' });
        }
    };

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

    if (isLoading) return <LoadingSpinner />;
    if (!assignment) return <div style={{ padding: '50px', textAlign: 'center' }}>Assignment not found.</div>;

    return (
        <section className="stream-content hw1-section" style={{ background: '#fff', minHeight: '100vh' }}>
            <div className="hw1-layout" style={{ maxWidth: '1300px', margin: '0 auto', padding: '40px 20px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px' }}>

                {/* LEFT COLUMN */}
                <div className="hw1-main-col">
                    {/* Header: Icon + Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                        <div style={{ width: '64px', height: '64px' }}>
                            <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
                                <circle cx="12" cy="12" r="12" fill="#e8eaed" />
                                <circle cx="12" cy="8" r="4" fill="#5f6368" />
                                <path d="M12 13c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z" fill="#5f6368" />
                            </svg>
                        </div>
                        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#333', margin: 0 }}>
                            {assignment.title}
                        </h1>
                    </div>

                    <div style={{ marginBottom: '10px', fontSize: '15px', color: '#333', fontWeight: '500' }}>{assignment.title}</div>
                    <div style={{ margin: '0 0 30px 0', fontSize: '14px', color: '#555', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                        {assignment.instructions}
                    </div>

                    {/* Attachment Card */}
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '40px' }}>
                        {assignment.files && assignment.files.map((file, idx) => (
                            <div key={idx} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '24px',
                                padding: '10px 16px',
                                cursor: 'pointer',
                                background: '#fff'
                            }} onClick={() => window.open(`http://localhost:3000/${file.fileUrl}`, '_blank')}>
                                <div style={{ width: '28px', height: '28px', background: '#f8f9fa', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#11b4d1" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>
                                </div>
                                <div style={{ fontSize: '14px', fontWeight: '500', color: '#11b4d1' }}>{file.fileUrl.split('/').pop()}</div>
                            </div>
                        ))}
                    </div>

                    {/* Rubrics Section */}
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
                </div>

                {/* RIGHT COLUMN */}
                <div className="hw1-side-col">

                    {/* Work Card */}
                    <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', marginBottom: '20px', border: '1px solid #edf0f2', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <span style={{ fontSize: '18px', fontWeight: '700', color: '#1a1f36' }}>Your Work</span>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: isWorkSubmitted ? '#1e8e3e' : '#666', background: isWorkSubmitted ? '#e6f4ea' : '#f0f0f0', padding: '4px 10px', borderRadius: '20px' }}>
                                {isWorkSubmitted ? 'Turned in' : 'Assigned'}
                            </span>
                        </div>

                        {assignment.grades !== null && (
                            <div style={{ marginBottom: '20px', padding: '12px', background: '#f8f9fa', borderRadius: '8px', fontSize: '15px', fontWeight: '600', color: '#1e8e3e' }}>
                                Grade: {assignment.grades} / {assignment.points}
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                            <AttachmentDisplay
                                files={uploadedWork.map(f => {
                                    if (f instanceof File) return f;
                                    return { ...f, isExisting: true };
                                })}
                                onDelete={!isWorkSubmitted ? (index) => handleRemoveWork(uploadedWork[index].fileId) : null}
                            />

                            {uploadedLinks.map((link, idx) => (
                                <div key={idx}
                                    onClick={() => window.open(link.linkUrl.startsWith('http') ? link.linkUrl : `https://${link.linkUrl}`, '_blank')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px',
                                        background: '#fafafa',
                                        border: '1px solid #edf0f2',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0a7e8c'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#edf0f2'}
                                >
                                    <div style={{ color: '#0a7e8c', fontSize: '20px' }}>🔗</div>
                                    <div style={{ flex: 1, overflow: 'hidden', fontSize: '14px', fontWeight: '600', color: '#333' }}>
                                        {link.linkUrl}
                                    </div>
                                    {!isWorkSubmitted && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleRemoveLink(link.linkId); }}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: '18px' }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = '#ff4d4f'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}
                                        >✕</button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Add/Create Button */}
                        {!isWorkSubmitted && (
                            <div style={{ position: 'relative', marginBottom: '15px' }}>
                                <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileUpload} multiple />
                                {isWorkMenuOpen && (
                                    <div style={{ position: 'absolute', bottom: '110%', left: 0, right: 0, background: '#fff', border: '1px solid #eee', borderRadius: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 10 }}>
                                        <div style={{ padding: '12px 16px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#333', borderBottom: '1px solid #f0f0f0' }} onClick={() => { document.getElementById('file-upload').click(); setIsWorkMenuOpen(false); }}>File</div>
                                        <div style={{ padding: '12px 16px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#333' }} onClick={() => { setIsAddingLink(true); setIsWorkMenuOpen(false); }}>Link</div>
                                    </div>
                                )}

                                <button
                                    onClick={() => setIsWorkMenuOpen(!isWorkMenuOpen)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '24px',
                                        border: '1px solid #edf0f2',
                                        background: '#fff',
                                        color: '#0a7e8c',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f0f9fa'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                                >
                                    + Add or create
                                </button>
                            </div>
                        )}

                        {/* Submit Button */}
                        {(true) && (
                            <button
                                onClick={toggleWorkSubmission}
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: isWorkSubmitted ? '#f0f0f0' : '#0a7e8c',
                                    color: isWorkSubmitted ? '#666' : '#fff',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    fontSize: '15px',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: isWorkSubmitted ? 'none' : '0 4px 12px rgba(10,126,140,0.2)'
                                }}
                                onMouseEnter={(e) => { if (!isWorkSubmitted) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                onMouseLeave={(e) => { if (!isWorkSubmitted) e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                {isWorkSubmitted ? 'Unsubmit' : 'Submit'}
                            </button>
                        )}
                    </div>

                    {/* AI Summary Card */}
                    <div style={{ background: '#f8f9fa', borderRadius: '16px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <img src={aiSign} alt="AI" style={{ width: '20px', height: '20px' }} />
                            <span style={{ fontSize: '16px', fontWeight: '600', color: '#11b4d1' }}>AI Summary</span>
                        </div>
                        <p style={{ fontSize: '14px', color: '#555', margin: 0, lineHeight: '1.5' }}>
                            {assignment.aiSummary || "According to the rubric, I suggest you to edit..."}
                        </p>
                    </div>

                </div>
            </div>

            {popupMessage && (
                <MessagePopup theme={popupMessage.theme} onClose={() => setPopupMessage(null)}>
                    {popupMessage.message}
                </MessagePopup>
            )}

            <LinkModal
                isOpen={isAddingLink}
                onClose={() => setIsAddingLink(false)}
                onAdd={(url) => {
                    handleLinkAdd(url);
                }}
            />
        </section>
    );
}