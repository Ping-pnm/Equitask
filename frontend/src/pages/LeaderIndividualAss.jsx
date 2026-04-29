import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAssignment, getAllIndividualSubmissions } from '../services/workService';
import LoadingSpinner from '../components/LoadingSpinner';
import checkListIcon from '../assets/checklist-icon.png';
import { useAuth } from '../components/AuthContext';
import { useClass } from '../components/ClassContext';

export default function LeaderIndividualAss() {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { isLeader } = useClass();

    const [assignment, setAssignment] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [assignmentData, submissionsData] = await Promise.all([
                    getAssignment(assignmentId),
                    getAllIndividualSubmissions(assignmentId)
                ]);
                setAssignment(assignmentData);
                setSubmissions(submissionsData);
                if (submissionsData.length > 0) {
                    setSelectedStudent(submissionsData[0]);
                }
            } catch (err) {
                console.error("Failed to fetch leader data:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [assignmentId]);

    if (isLoading) return <LoadingSpinner />;
    if (!assignment) return <div style={{ padding: '50px', textAlign: 'center' }}>Assignment not found.</div>;

    const turnedInList = submissions.filter(s => s.isSubmitted && s.grades === null);
    const assignedList = submissions.filter(s => !s.isSubmitted);
    const gradedList = submissions.filter(s => s.grades !== null);

    return (
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 380px', height: 'calc(100vh - 100px)', background: '#fff' }}>
            
            {/* LEFT COLUMN: Assignment Detail & Student List */}
            <div style={{ padding: '30px 50px', overflowY: 'auto', borderRight: '1px solid #eee' }}>
                <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#5f6368', fontSize: '14px', marginBottom: '20px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    Back to Dashboard
                </Link>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <img src={checkListIcon} alt="icon" style={{ width: '48px', height: '48px' }} />
                        <div>
                            <h1 style={{ fontSize: '32px', fontWeight: '500', color: '#3c4043', margin: 0 }}>{assignment.title}</h1>
                            <div style={{ fontSize: '14px', color: '#5f6368', marginTop: '4px' }}>Due {new Date(assignment.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toUpperCase()}</div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', color: '#3c4043', fontWeight: '500' }}>{assignment.points} points</div>
                    </div>
                </div>

                <div style={{ marginBottom: '40px' }}>
                    <div style={{ color: '#5f6368', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                        {assignment.instructions}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                        {assignment.files && assignment.files.map((file, i) => (
                            <div key={i} style={{ border: '1px solid #dadce0', borderRadius: '24px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', minWidth: '120px', cursor: 'pointer' }} onClick={() => window.open(`http://localhost:3000/${file.fileUrl}`, '_blank')}>
                                <div style={{ width: '28px', height: '28px', background: '#f8f9fa', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#11b4d1" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                                </div>
                                <span style={{ color: '#11b4d1', fontWeight: '500', fontSize: '13px' }}>{file.fileUrl.split('/').pop()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '60px', borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '30px' }}>
                    <div>
                        <div style={{ fontSize: '32px', color: '#3c4043' }}>{assignedList.length}</div>
                        <div style={{ fontSize: '12px', color: '#5f6368' }}>Assigned</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '32px', color: '#3c4043' }}>{turnedInList.length}</div>
                        <div style={{ fontSize: '12px', color: '#5f6368' }}>Turned In</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '32px', color: '#3c4043' }}>{gradedList.length}</div>
                        <div style={{ fontSize: '12px', color: '#5f6368' }}>Graded</div>
                    </div>
                </div>

                {/* Student Sections */}
                {[['Graded', gradedList], ['Turned In', turnedInList], ['Assigned', assignedList]].map(([label, list]) => (
                    list.length > 0 && (
                        <div key={label} style={{ marginBottom: '30px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#3c4043', margin: 0 }}>{label}</h3>
                                <span style={{ background: '#e8eaed', borderRadius: '12px', padding: '2px 8px', fontSize: '12px', fontWeight: '500' }}>{list.length}</span>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {list.map(sub => (
                                    <div 
                                        key={sub.userId} 
                                        onClick={() => setSelectedStudent(sub)}
                                        style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'space-between', 
                                            padding: '12px 16px', 
                                            borderRadius: '8px', 
                                            cursor: 'pointer',
                                            background: selectedStudent?.userId === sub.userId ? '#f1f3f4' : 'transparent',
                                            borderBottom: '1px solid #f1f3f4'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{ width: '36px', height: '36px' }}>
                                                <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
                                                    <circle cx="12" cy="12" r="12" fill="#e8eaed" />
                                                    <circle cx="12" cy="8" r="4" fill="#5f6368" />
                                                    <path d="M12 13c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z" fill="#5f6368" />
                                                </svg>
                                            </div>
                                            <span style={{ fontSize: '14px', color: '#3c4043' }}>{sub.firstName} {sub.lastName}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                            {sub.grades !== null && (
                                                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e8e3e' }}>{sub.grades} / {assignment.points}</span>
                                            )}
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bdc1c6" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ))}
            </div>

            {/* RIGHT COLUMN: Grading & Work Detail */}
            <div style={{ padding: '30px', background: '#fff', borderLeft: '1px solid #eee', overflowY: 'auto' }}>
                {selectedStudent ? (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                            <div style={{ width: '48px', height: '48px' }}>
                                <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
                                    <circle cx="12" cy="12" r="12" fill="#e8eaed" />
                                    <circle cx="12" cy="8" r="4" fill="#5f6368" />
                                    <path d="M12 13c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z" fill="#5f6368" />
                                </svg>
                            </div>
                            <div>
                                <div style={{ fontSize: '16px', fontWeight: '600', color: '#3c4043' }}>{selectedStudent.firstName} {selectedStudent.lastName}</div>
                                <div style={{ fontSize: '12px', color: '#d93025', background: '#fce8e6', padding: '2px 8px', borderRadius: '12px', display: 'inline-block', marginTop: '4px' }}>
                                    {selectedStudent.isSubmitted ? 'Turned in' : 'Assigned'}
                                </div>
                            </div>
                        </div>

                        <div style={{ border: '1px solid #dadce0', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <span style={{ fontSize: '14px', fontWeight: '600', color: '#3c4043' }}>Work</span>
                                <span style={{ fontSize: '12px', color: '#1e8e3e', fontWeight: '600' }}>{selectedStudent.isSubmitted ? 'Submitted' : 'Assigned'}</span>
                            </div>

                            {selectedStudent.files && selectedStudent.files.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {selectedStudent.files.map((f, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid #dadce0', borderRadius: '8px', cursor: 'pointer' }} onClick={() => window.open(`http://localhost:3000/${f.fileUrl}`, '_blank')}>
                                            <div style={{ width: '32px', height: '32px', background: '#ea4335', borderRadius: '4px' }}></div>
                                            <div style={{ overflow: 'hidden' }}>
                                                <div style={{ fontSize: '13px', fontWeight: '500', color: '#3c4043', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{f.fileUrl.split('/').pop()}</div>
                                                <div style={{ fontSize: '11px', color: '#70757a' }}>PDF</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '20px', color: '#70757a', fontSize: '13px' }}>No work attached</div>
                            )}

                            {(selectedStudent.isSubmitted || selectedStudent.grades !== null) && (
                                <>
                                    <div style={{ marginTop: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <input 
                                            type="text" 
                                            placeholder="—"
                                            defaultValue={selectedStudent.grades}
                                            style={{ width: '60px', border: 'none', borderBottom: '2px solid #11b4d1', textAlign: 'center', fontSize: '18px', padding: '5px' }}
                                        />
                                        <span style={{ fontSize: '16px', color: '#5f6368' }}>/ {assignment.points}</span>
                                    </div>

                                    <button style={{ width: '100%', marginTop: '20px', padding: '10px', borderRadius: '4px', border: 'none', background: '#11b4d1', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>
                                        Return
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', color: '#70757a', padding: '50px 0' }}>Select a student to grade their work</div>
                )}
            </div>
        </section>
    );
}