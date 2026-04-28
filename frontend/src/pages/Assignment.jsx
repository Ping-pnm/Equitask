import checkListIcon from '../assets/checklist-icon.png';
import gearEditIcon from '../assets/gearEditSign.png';

export default function Assignment() {
    return (
        <section id="dashboard-hw1-view" className="stream-content hw1-section">

            {/* Two-column layout wrapper */}
            <div className="hw1-layout">

                {/* LEFT COLUMN: Assignment info + Student lists */}
                <div className="hw1-main-col">

                    {/* Back Button */}
                    <div className="hw1-back-btn" id="btn-back-to-listing"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px', fontSize: '14px', color: '#555', width: 'fit-content', }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </div>

                    {/* Header: Icon + Title + Gear + Points */}
                    <div className="hw1-header-row">
                        <div className="hw1-title-group">
                            <img src={checkListIcon} alt="Checklist" className="hw1-checklist-icon" />
                            <div>
                                <h1 className="hw1-title">Homework 1</h1>
                                <div className="hw1-due">Due 20 NOV</div>
                            </div>
                        </div>
                        <div className="hw1-header-right">
                            <img src={gearEditIcon} alt="Edit Settings" className="hw1-gear-icon"
                                title="Edit Assignment" />
                            <span className="hw1-points">10 points</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="hw1-divider"></div>

                    {/* Assignment Description */}
                    <div className="hw1-desc-title">Homework Assignment 1</div>
                    <ul className="hw1-desc-list">
                        <li>Make sure to write down the answer appropriately.</li>
                    </ul>

                    {/* Attachments */}
                    <div className="hw1-attachments">
                        <div className="hw1-attachment-pill">
                            <span className="hw1-attachment-name">Homework1</span>
                            <span className="hw1-attachment-type">PDF</span>
                        </div>
                        <div className="hw1-attachment-thumb"></div>
                    </div>

                    {/* Divider */}
                    <div className="hw1-divider"></div>

                    {/* Stats Row: counts = number of students in each section */}
                    <div className="hw1-stats-row">
                        <div className="hw1-stat-item hw1-stat-border-r">
                            <div className="hw1-stat-number" id="hw1-count-assigned">3</div>
                            <div className="hw1-stat-label">Assigned</div>
                        </div>
                        <div className="hw1-stat-item hw1-stat-border-r">
                            <div className="hw1-stat-number" id="hw1-count-turnedin">2</div>
                            <div className="hw1-stat-label">Turned in</div>
                        </div>
                        <div className="hw1-stat-item">
                            <div className="hw1-stat-number" id="hw1-count-graded">2</div>
                            <div className="hw1-stat-label">Graded</div>
                        </div>
                    </div>

                    {/* ── Graded Section ── */}
                    <div className="hw1-student-section">
                        <h2 className="hw1-section-title">
                            Graded
                            <span className="hw1-section-count" id="hw1-graded-count-badge">2</span>
                        </h2>

                        <div className="hw1-student-row" id="hw1-row-graded-1">
                            <div className="hw1-avatar">
                                <svg width="36" height="36" viewBox="0 0 45 45" fill="none">
                                    <circle cx="22.5" cy="22.5" r="22.5" fill="#8ab4c8" />
                                    <circle cx="22.5" cy="16" r="6" fill="#fff" />
                                    <path
                                        d="M10.5 35.5C10.5 28.5 15.5 25 22.5 25C29.5 25 34.5 28.5 34.5 35.5V36.5H10.5V35.5Z"
                                        fill="#fff" />
                                </svg>
                            </div>
                            <span className="hw1-student-name">Phinnawat Yaemsanguan</span>
                            <span className="hw1-grade-badge">10 / 10</span>
                            <svg className="hw1-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="#888" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </div>

                        <div className="hw1-student-row" id="hw1-row-graded-2">
                            <div className="hw1-avatar">
                                <svg width="36" height="36" viewBox="0 0 45 45" fill="none">
                                    <circle cx="22.5" cy="22.5" r="22.5" fill="#8ab4c8" />
                                    <circle cx="22.5" cy="16" r="6" fill="#fff" />
                                    <path
                                        d="M10.5 35.5C10.5 28.5 15.5 25 22.5 25C29.5 25 34.5 28.5 34.5 35.5V36.5H10.5V35.5Z"
                                        fill="#fff" />
                                </svg>
                            </div>
                            <span className="hw1-student-name">Napha Mongkolwittayakul</span>
                            <span className="hw1-grade-badge">8 / 10</span>
                            <svg className="hw1-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="#888" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </div>
                    </div>

                    {/* ── Turned In Section ── */}
                    <div className="hw1-student-section">
                        <h2 className="hw1-section-title">
                            Turned in
                            <span className="hw1-section-count" id="hw1-turnedin-count-badge">2</span>
                        </h2>

                        <div className="hw1-student-row">
                            <div className="hw1-avatar">
                                <svg width="36" height="36" viewBox="0 0 45 45" fill="none">
                                    <circle cx="22.5" cy="22.5" r="22.5" fill="#9e9e9e" />
                                    <circle cx="22.5" cy="16" r="6" fill="#fff" />
                                    <path
                                        d="M10.5 35.5C10.5 28.5 15.5 25 22.5 25C29.5 25 34.5 28.5 34.5 35.5V36.5H10.5V35.5Z"
                                        fill="#fff" />
                                </svg>
                            </div>
                            <span className="hw1-student-name">Rangsimann Sattayarom</span>
                            <svg className="hw1-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="#888" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </div>

                        <div className="hw1-student-row">
                            <div className="hw1-avatar">
                                <svg width="36" height="36" viewBox="0 0 45 45" fill="none">
                                    <circle cx="22.5" cy="22.5" r="22.5" fill="#9e9e9e" />
                                    <circle cx="22.5" cy="16" r="6" fill="#fff" />
                                    <path
                                        d="M10.5 35.5C10.5 28.5 15.5 25 22.5 25C29.5 25 34.5 28.5 34.5 35.5V36.5H10.5V35.5Z"
                                        fill="#fff" />
                                </svg>
                            </div>
                            <span className="hw1-student-name">Weerawat Charoensap</span>
                            <svg className="hw1-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="#888" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </div>
                    </div>

                    {/* ── Assigned Section ── */}
                    <div className="hw1-student-section">
                        <h2 className="hw1-section-title">
                            Assigned
                            <span className="hw1-section-count" id="hw1-assigned-count-badge">3</span>
                        </h2>

                        <div className="hw1-student-row">
                            <div className="hw1-avatar">
                                <svg width="36" height="36" viewBox="0 0 45 45" fill="none">
                                    <circle cx="22.5" cy="22.5" r="22.5" fill="#b0b0b0" />
                                    <circle cx="22.5" cy="16" r="6" fill="#fff" />
                                    <path
                                        d="M10.5 35.5C10.5 28.5 15.5 25 22.5 25C29.5 25 34.5 28.5 34.5 35.5V36.5H10.5V35.5Z"
                                        fill="#fff" />
                                </svg>
                            </div>
                            <span className="hw1-student-name">Takorn Sripetcharakul</span>
                            <svg className="hw1-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="#888" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </div>

                        <div className="hw1-student-row">
                            <div className="hw1-avatar">
                                <svg width="36" height="36" viewBox="0 0 45 45" fill="none">
                                    <circle cx="22.5" cy="22.5" r="22.5" fill="#b0b0b0" />
                                    <circle cx="22.5" cy="16" r="6" fill="#fff" />
                                    <path
                                        d="M10.5 35.5C10.5 28.5 15.5 25 22.5 25C29.5 25 34.5 28.5 34.5 35.5V36.5H10.5V35.5Z"
                                        fill="#fff" />
                                </svg>
                            </div>
                            <span className="hw1-student-name">Pornpat Jirawatcharakul</span>
                            <svg className="hw1-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="#888" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </div>

                        <div className="hw1-student-row">
                            <div className="hw1-avatar">
                                <svg width="36" height="36" viewBox="0 0 45 45" fill="none">
                                    <circle cx="22.5" cy="22.5" r="22.5" fill="#b0b0b0" />
                                    <circle cx="22.5" cy="16" r="6" fill="#fff" />
                                    <path
                                        d="M10.5 35.5C10.5 28.5 15.5 25 22.5 25C29.5 25 34.5 28.5 34.5 35.5V36.5H10.5V35.5Z"
                                        fill="#fff" />
                                </svg>
                            </div>
                            <span className="hw1-student-name">Siriphan Lertworasirikul</span>
                            <svg className="hw1-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="#888" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </div>
                    </div>

                </div>{/* end hw1-main-col */}

                {/* RIGHT COLUMN: Student grade panel (shown when a student row is clicked) */}
                <div className="hw1-side-col" id="hw1-side-panel">

                    {/* Placeholder / empty state */}
                    <div className="hw1-side-empty" id="hw1-side-empty">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        <p>Select a student to view their work</p>
                    </div>

                    {/* Student grade detail (shown dynamically) */}
                    <div className="hw1-side-detail" id="hw1-side-detail" style={{ display: 'none', }}>

                        {/* Student name header */}
                        <div className="hw1-side-student-header">
                            <div className="hw1-side-avatar">
                                <svg width="44" height="44" viewBox="0 0 45 45" fill="none">
                                    <circle cx="22.5" cy="22.5" r="22.5" fill="#8ab4c8" />
                                    <circle cx="22.5" cy="16" r="6" fill="#fff" />
                                    <path
                                        d="M10.5 35.5C10.5 28.5 15.5 25 22.5 25C29.5 25 34.5 28.5 34.5 35.5V36.5H10.5V35.5Z"
                                        fill="#fff" />
                                </svg>
                            </div>
                            <div>
                                <div className="hw1-side-name" id="hw1-side-name">Student Name</div>
                                <div className="hw1-side-status-badge" id="hw1-side-status">Turned in</div>
                            </div>
                        </div>

                        {/* Work Card */}
                        <div className="hw1-side-card">
                            <div className="hw1-side-card-header">
                                <span className="hw1-side-card-title">Work</span>
                                <span className="hw1-side-work-status" id="hw1-side-work-status">Turned in</span>
                            </div>
                            <div className="hw1-file-box">
                                <div className="hw1-file-thumb-sm"></div>
                                <div className="hw1-file-info">
                                    <div className="hw1-file-name">Homework1_submission</div>
                                    <div className="hw1-file-type">PDF</div>
                                </div>
                            </div>
                            {/* Grade input */}
                            <div className="hw1-grade-row">
                                <input type="number" className="hw1-grade-input" id="hw1-grade-input" placeholder="—"
                                    min="0" max="10" />
                                <span className="hw1-grade-max">/ 10</span>
                            </div>
                            <button className="hw1-return-btn" id="hw1-return-btn">Return</button>
                        </div>

                        {/* Private Comments */}
                        <div className="hw1-side-card">
                            <span className="hw1-side-card-title">Private Comments</span>
                            <button className="hw1-add-comment-btn">
                                <span>+</span> Add comment
                            </button>
                        </div>

                    </div>

                </div>{/* end hw1-side-col */}

            </div>{/* end hw1-layout */}

        </section>
    );
}