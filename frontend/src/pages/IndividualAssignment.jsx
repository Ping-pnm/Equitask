import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getAssignment, uploadIndividualWork, deleteIndividualWork, submitIndividualWork
} from '../services/workService';
import { useAuth } from '../components/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import MessagePopup from '../components/MessagePopup';
import Rubric from '../components/Rubric';
import aiSign from '../assets/Ai-sign.png';
import uploadSign from '../assets/UploadSign.png';

export default function IndividualAssignment() {
    const { assignmentId } = useParams();
    const { userId, user } = useAuth();
    const navigate = useNavigate();

    const [assignment, setAssignment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadedWork, setUploadedWork] = useState([]);
    const [isWorkSubmitted, setIsWorkSubmitted] = useState(false);
    const [isWorkMenuOpen, setIsWorkMenuOpen] = useState(false);
    const [popupMessage, setPopupMessage] = useState(null);

    const fetchData = async () => {
        try {
            const data = await getAssignment(assignmentId, userId);
            setAssignment(data);
            setUploadedWork(data.userFiles || []);
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

    const toggleWorkSubmission = async () => {
        const newStatus = !isWorkSubmitted;
        try {
            await submitIndividualWork(userId, assignmentId, newStatus);
            setIsWorkSubmitted(newStatus);
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
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#11b4d1" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                                </div>
                                <div style={{ fontSize: '14px', fontWeight: '500', color: '#11b4d1' }}>{file.fileUrl.split('/').pop()}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ borderTop: '1px solid #eee', marginBottom: '30px' }}></div>

                    {/* AI Rubrics Table */}
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <img src={aiSign} alt="AI" style={{ width: '24px', height: '24px' }} />
                            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#11b4d1', margin: 0 }}>AI Rubrics</h2>
                        </div>
                        {assignment.criteria && assignment.criteria.length > 0 ? (
                            <Rubric
                                criterias={assignment.criteria.map(c => c.title)}
                                levels={assignment.levels.map(l => l.title)}
                                cells={assignment.rubricCells}
                                readOnly={true}
                            />
                        ) : (
                            <p style={{ color: '#888', fontSize: '14px' }}>No rubrics assigned.</p>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="hw1-side-col">

                    {/* Work Card */}
                    <div style={{ background: '#f8f9fa', borderRadius: '16px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ fontSize: '20px', fontWeight: '600', color: '#333' }}>Work</span>
                            <span style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>{isWorkSubmitted ? 'Turned in' : 'Assigned'}</span>
                        </div>
                        
                        {assignment.grades !== null && (
                            <div style={{ marginBottom: '20px', fontSize: '15px', fontWeight: '600', color: '#1e8e3e' }}>
                                Grade: {assignment.grades} / {assignment.points}
                            </div>
                        )}

                        {/* File Submissions */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                            {uploadedWork.map((file, idx) => (
                                <div key={idx} 
                                    onClick={() => window.open(`http://localhost:3000/${file.fileUrl}`, '_blank')}
                                    style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px',
                                    background: '#fff',
                                    border: '1px solid #ddd',
                                    borderRadius: '12px',
                                    position: 'relative',
                                    cursor: 'pointer'
                                }}>
                                    <div style={{ width: '40px', height: '40px', background: '#f0f0f0', borderRadius: '4px' }}></div>
                                    <div style={{ flex: 1, overflow: 'hidden' }}>
                                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {file.fileUrl.split('/').pop()}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#888' }}>Attachment</div>
                                    </div>
                                    {!isWorkSubmitted && (
                                        <button
                                            onClick={() => handleRemoveWork(file.fileId)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Add or Create Button */}
                        <div style={{ position: 'relative', marginBottom: '15px' }}>
                            {isWorkMenuOpen && (
                                <div style={{ position: 'absolute', bottom: '110%', left: 0, right: 0, background: '#fff', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10 }}>
                                    <div style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }} onClick={() => document.getElementById('file-upload').click()}>
                                        <img src={uploadSign} alt="upload" style={{ width: '20px' }} /> File
                                        <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileUpload} multiple />
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={() => setIsWorkMenuOpen(!isWorkMenuOpen)}
                                disabled={isWorkSubmitted}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '24px',
                                    border: '1px solid #ddd',
                                    background: '#fff',
                                    color: '#11b4d1',
                                    fontWeight: '600',
                                    cursor: isWorkSubmitted ? 'not-allowed' : 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Add or create
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={toggleWorkSubmission}
                            disabled={uploadedWork.length === 0}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                border: 'none',
                                background: isWorkSubmitted ? '#e0e0e0' : '#11b4d1',
                                color: isWorkSubmitted ? '#666' : '#fff',
                                fontWeight: '700',
                                cursor: uploadedWork.length === 0 ? 'not-allowed' : 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            {isWorkSubmitted ? 'Unsubmit' : 'Submit'}
                        </button>
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
        </section>
    );
}