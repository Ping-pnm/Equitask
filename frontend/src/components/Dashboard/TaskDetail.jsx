import React from 'react';
import groupSign from '../../assets/groupSign.png';
import taskSign from '../../assets/taskSign.png';
import aiSign from '../../assets/Ai-sign.png';

export default function TaskDetail({ isOpen, onClose, studentName, taskName, groupName }) {
    if (!isOpen) return null;

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
                                <div className="task-progress-fill" style={{ width: '79%' }}></div>
                            </div>
                            <span className="task-percent-text">79%</span>
                        </div>

                        <div className="task-text-description">
                            For the project proposal<br />
                            1. Create Login Page<br />
                            2. When click login button then go to Home Page
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
                                    <td>07 May 2030</td>
                                    <td>Connect login page to homepage</td>
                                    <td style={{ textAlign: 'center' }}>70%</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>02 May 2030</td>
                                    <td>Create login page</td>
                                    <td style={{ textAlign: 'center' }}>50%</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="horizontal-divider"></div>

                        {/* AI Rubrics Section */}
                        <div className="ai-section-header">
                            <img src={aiSign} alt="AI" style={{ width: '24px', height: '24px' }} />
                            <h2 className="ai-summary-text-gradient ai-summary-text-gradient-large">AI Rubrics</h2>
                        </div>

                        <table className="ai-rubrics-table">
                            <tbody>
                                <tr>
                                    <td>XXXX</td>
                                    <td>XXXX</td>
                                    <td>XXXX</td>
                                </tr>
                                <tr>
                                    <td>XXXX</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>XXXX</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Right Sidebar */}
                    <div className="column-sidebar">

                        {/* Work Card */}
                        <div className="sidebar-card">
                            <div className="sidebar-card-header">
                                <span className="sidebar-card-title">Work</span>
                                <span className="status-badge">IN PROGRESS</span>
                            </div>

                            {/* File/Link Box */}
                            <div className="file-attachment-box">
                                <div className="file-info-group">
                                    <div className="file-thumb"></div>
                                    <div>
                                        <div className="file-name">Name</div>
                                        <div className="file-source">Github</div>
                                    </div>
                                </div>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}>
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </div>

                            <button className="sidebar-action-btn">Unsubmit</button>
                        </div>

                        {/* AI Summary Card */}
                        <div className="sidebar-card">
                            <div className="ai-section-header">
                                <img src={aiSign} alt="AI" style={{ width: '18px', height: '18px' }} />
                                <span className="ai-summary-text-gradient" style={{ fontSize: '18px' }}>AI Summary</span>
                            </div>
                            <div className="ai-summary-description">
                                According to the rubric, I suggest you to edit...
                            </div>
                        </div>

                        {/* Private Comments Card */}
                        <div className="sidebar-card">
                            <span className="sidebar-card-title" style={{ display: 'block', marginBottom: '15px' }}>Private
                                Comments</span>
                            <button className="add-comment-btn">
                                <span>+</span> Add comment
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}