import groupSign from '../../assets/groupSign.png'

export default function GroupProjectDetail() {
    return (
        <section id="dashboard-group-detail-view" className="stream-content extracted-style-19"
            style={{ display: 'none', }}>
            <div id="extracted-el-2" className="extracted-style-20">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to Group Project
            </div>

            {/* Group Detail Header aligned with columns */}
            <div className="detail-content-grid" style={{ margin: '24px 0', }}>
                {/* Left Side: Aligns with Group Members column */}
                <div className="column-main"
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                    <div style={{ display: 'flex', alignItems: 'center', }}>
                        {/* Logo */}
                        <img src={groupSign} alt="Group Sign"
                            style={{ width: '72px', height: '72px', marginRight: '12px', }} />
                        {/* Text */}
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2', }}>
                            <span style={{ fontSize: '18px', fontWeight: '600', color: '#333', }}>Group Project:</span>
                            <span style={{ fontSize: '32px', fontWeight: '700', color: '#222', marginTop: '2px', }}>Group
                                1</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', }}>
                        {/* Meet Box */}
                        <div
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', border: '1px solid #ccc', borderRadius: '8px', background: 'white', marginRight: '16px', }}>
                            <img src="../public/assets/googlemeetSign.png" alt="Google Meet Sign"
                                style={{ width: '28px', height: '28px', }} />
                            <span style={{ fontSize: '18px', fontWeight: '500', color: '#333', }}>Meet</span>
                            <button
                                style={{ border: '1px solid #777', background: 'transparent', color: '#5b7ab7', fontWeight: '600', fontSize: '14px', padding: '4px 16px', borderRadius: '16px', cursor: 'pointer', marginLeft: '4px', }}>JOIN</button>
                        </div>

                        {/* Gear Icon */}
                        <img src="../public/assets/gearEditSign.png" alt="Edit Settings"
                            onClick={() => { openModal('modal-edit-group') }}
                            style={{ width: '24px', height: '24px', cursor: 'pointer', }} />
                    </div>
                </div>

                {/* Right Side: Spacer matching the right column width to preserve alignment */}
                <div className="column-sidebar" style={{ height: '0', minHeight: '0', gap: '0', }}></div>
            </div>

            <div className="extracted-style-21">

                {/* Left Column: Members & Rubric */}
                <div className="extracted-style-22">

                    {/* Group Members Section */}
                    <div className="extracted-style-23">
                        <h2 className="extracted-style-24">
                            Group Members</h2>

                        <div className="member-table-wrapper">
                            <table className="member-list-table">
                                <tbody>
                                    <tr>
                                        <td>66227xxxxx</td>
                                        <td>Name</td>
                                        <td>Surname</td>
                                    </tr>
                                    <tr>
                                        <td>66227xxxxx</td>
                                        <td>Name</td>
                                        <td>Surname</td>
                                    </tr>
                                    <tr>
                                        <td>66227xxxxx</td>
                                        <td>Name</td>
                                        <td>Surname</td>
                                    </tr>
                                    <tr>
                                        <td>66227xxxxx</td>
                                        <td>Name</td>
                                        <td>Surname</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* AI Rubric Summary Section */}
                    <div className="extracted-style-44">
                        <div className="extracted-style-45">
                            <img src="../public/assets/Ai-sign.png" alt="AI Icon" className="extracted-style-46" />
                            <h2 className="ai-summary-text-gradient ai-summary-text-gradient-large"
                                style={{ margin: '0', lineHeight: '1.2', }}>AI Group
                                Rubric Summary</h2>
                        </div>

                        <div className="extracted-style-48">
                            <table className="extracted-style-49">
                                <tbody>
                                    <tr>
                                        <td className="extracted-style-50">
                                        </td>
                                        <td className="extracted-style-51">
                                        </td>
                                        <td className="extracted-style-52">
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="extracted-style-53">
                                        </td>
                                        <td className="extracted-style-54">
                                        </td>
                                        <td className="extracted-style-55">
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

                {/* Right Column: Work & Comments */}
                <div className="extracted-style-56">

                    {/* Work Card */}
                    <div className="extracted-style-57">
                        <div className="extracted-style-58">
                            <span className="extracted-style-59">Work</span>
                            <span className="extracted-style-60">Assigned</span>
                        </div>

                        <div className="extracted-style-61">
                            <button className="extracted-style-62" id="extracted-el-3">
                                Add or create
                            </button>
                            {/* Dropdown Menu */}
                            <div id="add-create-menu" className="extracted-style-63" style={{ display: 'none', }}>
                                <div className="extracted-style-64" id="extracted-el-4">
                                    <img src="../public/assets/LinkSign.png" alt="Link"
                                        className="extracted-style-65" /> Link
                                </div>
                                <div className="extracted-style-66" id="extracted-el-5">
                                    <img src="../public/assets/UploadSign.png" alt="File"
                                        className="extracted-style-67" /> File
                                    <input type="file" id="file-upload-input" className="extracted-style-68"
                                        style={{ display: 'none', }} />
                                </div>
                            </div>
                        </div>

                        <div className="extracted-style-69">
                            <input type="text" placeholder="Add grade" className="extracted-style-70" />
                            / 100
                        </div>
                    </div>

                    {/* Group Comments Card */}
                    <div className="extracted-style-71">
                        {/* Header */}
                        <div className="extracted-style-72">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            <span className="extracted-style-73">Group Comments</span>
                        </div>
                        {/* Divider line */}
                        <div className="extracted-style-74"></div>

                        {/* Comment list */}
                        <div className="extracted-style-75">
                            <div className="extracted-style-76">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white"
                                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>
                            <div className="extracted-style-77">
                                <div className="extracted-style-78">
                                    <span className="extracted-style-79">Name
                                        Surname</span>
                                    <span className="extracted-style-80">2
                                        DEC<br />17:00</span>
                                </div>
                                <span className="extracted-style-81">Hello,
                                    .......</span>
                            </div>
                        </div>

                        {/* Add comment box */}
                        <div className="extracted-style-82">
                            <div className="extracted-style-83">
                                <input type="text" placeholder="Add comment...." className="extracted-style-84" />

                                {/* Rich Text Formatting Toolbar */}
                                <div className="extracted-style-85">
                                    <span className="extracted-style-86">B</span>
                                    <span className="extracted-style-87">I</span>
                                    <span className="extracted-style-88">U</span>
                                    {/* List Icon */}
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2" className="extracted-style-89">
                                        <line x1="8" y1="6" x2="21" y2="6"></line>
                                        <line x1="8" y1="12" x2="21" y2="12"></line>
                                        <line x1="8" y1="18" x2="21" y2="18"></line>
                                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                                    </svg>
                                    {/* Clear Format Icon */}
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2" className="extracted-style-90">
                                        <path d="M19.5 9.5L14.5 4.5" />
                                        <path d="M4.5 19.5h15" />
                                        <path d="M4.5 14.5l9-9a2.121 2.121 0 0 1 3 3l-9 9l-4.5 1z" />
                                    </svg>
                                </div>
                            </div>
                            {/* Send Button */}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#aaa"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                className="extracted-style-91">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
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
                        <img src="../public/assets/Ai-sign.png" alt="AI Icon"
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
                <table className="task-history-table">
                    <thead>
                        <tr style={{ background: '#0a7e8c15', }}>
                            <th
                                style={{ padding: '15px', textAlign: 'center', border: '1px solid #ccc', fontWeight: '700', color: '#0a7e8c', }}>
                                Date</th>
                            <th
                                style={{ padding: '15px', textAlign: 'center', border: '1px solid #ccc', fontWeight: '700', color: '#0a7e8c', }}>
                                Student 1</th>
                            <th
                                style={{ padding: '15px', textAlign: 'center', border: '1px solid #ccc', fontWeight: '700', color: '#0a7e8c', }}>
                                Student 2</th>
                            <th
                                style={{ padding: '15px', textAlign: 'center', border: '1px solid #ccc', fontWeight: '700', color: '#0a7e8c', }}>
                                Student 3</th>
                        </tr>
                    </thead>
                    <tbody style={{ background: 'white', }}>
                        <tr>
                            <td
                                style={{ padding: '22px', textAlign: 'left', border: '1px solid #e5e5e5', color: '#333', fontSize: '13px', }}>
                                xx/xx/xxxx</td>
                            <td
                                style={{ padding: '22px', textAlign: 'center', border: '1px solid #e5e5e5', color: '#333', fontSize: '13px', }}>
                                17.00</td>
                            <td
                                style={{ padding: '22px', textAlign: 'center', border: '1px solid #e5e5e5', color: '#333', fontSize: '13px', }}>
                                16.55</td>
                            <td
                                style={{ padding: '22px', textAlign: 'center', border: '1px solid #e5e5e5', color: '#333', fontSize: '13px', }}>
                                17.15</td>
                        </tr>
                        <tr>
                            <td
                                style={{ padding: '22px', textAlign: 'left', border: '1px solid #e5e5e5', color: '#333', fontSize: '13px', }}>
                                xx/xx/xxxx</td>
                            <td
                                style={{ padding: '22px', textAlign: 'center', border: '1px solid #e5e5e5', color: '#333', fontSize: '13px', }}>
                                20.30</td>
                            <td
                                style={{ padding: '22px', textAlign: 'center', border: '1px solid #e5e5e5', color: '#333', fontSize: '13px', }}>
                                20.18</td>
                            <td
                                style={{ padding: '22px', textAlign: 'center', border: '1px solid #e5e5e5', color: '#333', fontSize: '13px', }}>
                                20.22</td>
                        </tr>
                        <tr>
                            <td
                                style={{ padding: '22px', textAlign: 'left', border: '1px solid #e5e5e5', color: '#333', fontSize: '13px', }}>
                                xx/xx/xxxx</td>
                            <td
                                style={{ padding: '22px', textAlign: 'center', border: '1px solid #e5e5e5', color: '#333', fontSize: '13px', }}>
                                -</td>
                            <td
                                style={{ padding: '22px', textAlign: 'center', border: '1px solid #e5e5e5', color: '#333', fontSize: '13px', }}>
                                18.02</td>
                            <td
                                style={{ padding: '22px', textAlign: 'center', border: '1px solid #e5e5e5', color: '#333', fontSize: '13px', }}>
                                18.11</td>
                        </tr>
                        <tr>
                            <td
                                style={{ padding: '22px', textAlign: 'left', border: '1px solid #e5e5e5', color: '#333', fontSize: '13px', }}>
                                xx/xx/xxxx</td>
                            <td
                                style={{ padding: '22px', textAlign: 'center', border: '1px solid #e5e5e5', color: '#333', fontSize: '13px', }}>
                                14.30</td>
                            <td
                                style={{ padding: '22px', textAlign: 'center', border: '1px solid #e5e5e5', color: '#333', fontSize: '13px', }}>
                                -</td>
                            <td
                                style={{ padding: '22px', textAlign: 'center', border: '1px solid #e5e5e5', color: '#333', fontSize: '13px', }}>
                                14.33</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Student Tasks Progress Section */}
            <div style={{ display: 'flex', gap: '25px', width: '100%', marginBottom: '50px', flexWrap: 'wrap', }}>

                {/* Student 1 Frame */}
                <div
                    style={{ flex: '1', minWidth: '300px', background: '#e8eaeb', borderRadius: '12px', padding: '25px', display: 'flex', flexDirection: 'column', }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 25px 0', color: '#222', }}>Name Surname
                        1</h3>

                    {/* Radial Progress for 26% */}
                    {/* Circumference = 188.5, Dashes: 188.5 * 0.74 = 139.49 offset */}
                    <div style={{ position: 'relative', width: '160px', height: '85px', margin: '0 auto 20px', }}>
                        <svg width="160" height="85" viewBox="0 0 160 85">
                            <path d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke="white" strokeWidth="20"
                                strokeLinecap="round" />
                            <path d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke="#2AB3D6"
                                strokeWidth="20" strokeLinecap="round" strokeDasharray="188.5"
                                strokeDashoffset="139.49" />
                        </svg>
                        <div
                            style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', textAlign: 'center', fontSize: '16px', fontWeight: '700', color: '#111', }}>
                            26%</div>
                    </div>

                    {/* Task 1 */}
                    <div onClick={() => { openTaskDetail('Name Surname 1', 'Task 1') }}
                        style={{ background: 'white', borderRadius: '12px', padding: '15px', marginBottom: '15px', cursor: 'pointer', }}>
                        <div
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', }}>
                                <img src="../public/assets/taskSign.png" alt="Task"
                                    style={{ width: '22px', height: '22px', }} />
                                <span style={{ fontSize: '18px', color: '#333', }}>Task1 <span
                                    style={{ fontWeight: '800', }}>&gt;</span></span>
                            </div>
                            <div
                                style={{ fontSize: '10px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', background: '#fae489', color: '#111', }}>
                                IN PROGRESS</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', }}>
                            <div
                                style={{ flex: '1', height: '6px', background: '#E9ECEF', borderRadius: '4px', overflow: 'hidden', }}>
                                <div style={{ height: '100%', width: '79%', background: '#6ba7c2', borderRadius: '4px', }}>
                                </div>
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#222', }}>79%</span>
                        </div>
                        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px', }}>
                            <div
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '700', }}>
                                <img src="../public/assets/Ai-sign.png" alt="AI Icon"
                                    style={{ width: '14px', height: '14px', }} />
                                <span className="ai-summary-text-gradient ai-summary-text-gradient-small">AI
                                    Summary</span>
                            </div>
                            <span style={{ fontSize: '10px', color: '#444', lineHeight: '1.3', }}>According to the
                                rubric , I suggest<br />you to edit...........................</span>
                        </div>
                    </div>

                    {/* Task 2 */}
                    <div onClick={() => { openTaskDetail('Name Surname 1', 'Task 2') }}
                        style={{ background: 'white', borderRadius: '12px', padding: '15px', marginBottom: '15px', cursor: 'pointer', }}>
                        <div
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', }}>
                                <img src="../public/assets/taskSign.png" alt="Task"
                                    style={{ width: '22px', height: '22px', }} />
                                <span style={{ fontSize: '18px', color: '#333', }}>Task2 <span
                                    style={{ fontWeight: '800', }}>&gt;</span></span>
                            </div>
                            <div
                                style={{ fontSize: '10px', fontWeight: '600', color: '#111', textTransform: 'uppercase', }}>
                                WAITING</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', }}>
                            <div
                                style={{ flex: '1', height: '6px', background: '#E9ECEF', borderRadius: '4px', overflow: 'hidden', }}>
                                <div style={{ height: '100%', width: '0%', background: '#6ba7c2', borderRadius: '4px', }}>
                                </div>
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#222', }}>0%</span>
                        </div>
                    </div>

                    {/* Task 3 */}
                    <div onClick={() => { openTaskDetail('Name Surname 1', 'Task 3') }}
                        style={{ background: 'white', borderRadius: '12px', padding: '15px', marginBottom: '15px', cursor: 'pointer', }}>
                        <div
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', }}>
                                <img src="../public/assets/taskSign.png" alt="Task"
                                    style={{ width: '22px', height: '22px', }} />
                                <span style={{ fontSize: '18px', color: '#333', }}>Task3 <span
                                    style={{ fontWeight: '800', }}>&gt;</span></span>
                            </div>
                            <div
                                style={{ fontSize: '10px', fontWeight: '600', color: '#111', textTransform: 'uppercase', }}>
                                WAITING</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', }}>
                            <div
                                style={{ flex: '1', height: '6px', background: '#E9ECEF', borderRadius: '4px', overflow: 'hidden', }}>
                                <div style={{ height: '100%', width: '0%', background: '#6ba7c2', borderRadius: '4px', }}>
                                </div>
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#222', }}>0%</span>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '10px', }}>
                        <button onClick={() => { openAddTaskModal('Name Surname 1') }}
                            style={{ background: 'transparent', border: 'none', color: '#4bc4de', fontWeight: '700', fontSize: '13px', cursor: 'pointer', }}>Add
                            Task</button>
                    </div>
                </div>

                {/* Student 2 Frame */}
                <div
                    style={{ flex: '1', minWidth: '300px', background: '#e8eaeb', borderRadius: '12px', padding: '25px', display: 'flex', flexDirection: 'column', }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 25px 0', color: '#222', }}>Name Surname
                        2</h3>

                    {/* Radial Progress for 9% */}
                    {/* 188.5 * 0.91 = 171.53 */}
                    <div style={{ position: 'relative', width: '160px', height: '85px', margin: '0 auto 20px', }}>
                        <svg width="160" height="85" viewBox="0 0 160 85">
                            <path d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke="white" strokeWidth="20"
                                strokeLinecap="round" />
                            <path d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke="#2AB3D6"
                                strokeWidth="20" strokeLinecap="round" strokeDasharray="188.5"
                                strokeDashoffset="171.53" />
                        </svg>
                        <div
                            style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', textAlign: 'center', fontSize: '16px', fontWeight: '700', color: '#111', }}>
                            9%</div>
                    </div>

                    {/* Task 1 */}
                    <div onClick={() => { openTaskDetail('Name Surname 2', 'Task 1') }}
                        style={{ background: 'white', borderRadius: '12px', padding: '15px', marginBottom: '15px', cursor: 'pointer', }}>
                        <div
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', }}>
                                <img src="../public/assets/taskSign.png" alt="Task"
                                    style={{ width: '22px', height: '22px', }} />
                                <span style={{ fontSize: '18px', color: '#333', }}>Task1 <span
                                    style={{ fontWeight: '800', }}>&gt;</span></span>
                            </div>
                            <div
                                style={{ fontSize: '10px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', background: '#fcb0a3', color: '#111', }}>
                                AT RISK</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', }}>
                            <div
                                style={{ flex: '1', height: '6px', background: '#E9ECEF', borderRadius: '4px', overflow: 'hidden', }}>
                                <div style={{ height: '100%', width: '29%', background: '#6ba7c2', borderRadius: '4px', }}>
                                </div>
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#222', }}>29%</span>
                        </div>
                        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px', }}>
                            <div
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '700', }}>
                                <img src="../public/assets/Ai-sign.png" alt="AI Icon"
                                    style={{ width: '14px', height: '14px', }} />
                                <span className="ai-summary-text-gradient ai-summary-text-gradient-small">AI
                                    Summary</span>
                            </div>
                            <span style={{ fontSize: '10px', color: '#444', lineHeight: '1.3', }}>According to the
                                rubric , I suggest<br />you to edit...........................</span>
                        </div>
                    </div>

                    {/* Task 2 */}
                    <div onClick={() => { openTaskDetail('Name Surname 2', 'Task 2') }}
                        style={{ background: 'white', borderRadius: '12px', padding: '15px', marginBottom: '15px', cursor: 'pointer', }}>
                        <div
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', }}>
                                <img src="../public/assets/taskSign.png" alt="Task"
                                    style={{ width: '22px', height: '22px', }} />
                                <span style={{ fontSize: '18px', color: '#333', }}>Task2 <span
                                    style={{ fontWeight: '800', }}>&gt;</span></span>
                            </div>
                            <div
                                style={{ fontSize: '10px', fontWeight: '600', color: '#111', textTransform: 'uppercase', }}>
                                WAITING</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', }}>
                            <div
                                style={{ flex: '1', height: '6px', background: '#E9ECEF', borderRadius: '4px', overflow: 'hidden', }}>
                                <div style={{ height: '100%', width: '0%', background: '#6ba7c2', borderRadius: '4px', }}>
                                </div>
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#222', }}>0%</span>
                        </div>
                    </div>

                    {/* Task 3 */}
                    <div onClick={() => { openTaskDetail('Name Surname 2', 'Task 3') }}
                        style={{ background: 'white', borderRadius: '12px', padding: '15px', marginBottom: '15px', cursor: 'pointer', }}>
                        <div
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', }}>
                                <img src="../public/assets/taskSign.png" alt="Task"
                                    style={{ width: '22px', height: '22px', }} />
                                <span style={{ fontSize: '18px', color: '#333', }}>Task3 <span
                                    style={{ fontWeight: '800', }}>&gt;</span></span>
                            </div>
                            <div
                                style={{ fontSize: '10px', fontWeight: '600', color: '#111', textTransform: 'uppercase', }}>
                                WAITING</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', }}>
                            <div
                                style={{ flex: '1', height: '6px', background: '#E9ECEF', borderRadius: '4px', overflow: 'hidden', }}>
                                <div style={{ height: '100%', width: '0%', background: '#6ba7c2', borderRadius: '4px', }}>
                                </div>
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#222', }}>0%</span>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '10px', }}>
                        <button onClick={() => { openAddTaskModal('Name Surname 2') }}
                            style={{ background: 'transparent', border: 'none', color: '#4bc4de', fontWeight: '700', fontSize: '13px', cursor: 'pointer', }}>Add
                            Task</button>
                    </div>
                </div>

                {/* Student 3 Frame */}
                <div
                    style={{ flex: '1', minWidth: '300px', background: '#e8eaeb', borderRadius: '12px', padding: '25px', display: 'flex', flexDirection: 'column', }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 25px 0', color: '#222', }}>Name Surname
                        3</h3>

                    {/* Radial Progress for 57% */}
                    {/* 188.5 * 0.43 = 81.05 */}
                    <div style={{ position: 'relative', width: '160px', height: '85px', margin: '0 auto 20px', }}>
                        <svg width="160" height="85" viewBox="0 0 160 85">
                            <path d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke="white" strokeWidth="20"
                                strokeLinecap="round" />
                            <path d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke="#2AB3D6"
                                strokeWidth="20" strokeLinecap="round" strokeDasharray="188.5"
                                strokeDashoffset="81.05" />
                        </svg>
                        <div
                            style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', textAlign: 'center', fontSize: '16px', fontWeight: '700', color: '#111', }}>
                            57%</div>
                    </div>

                    {/* Task 1 */}
                    <div onClick={() => { openTaskDetail('Name Surname 3', 'Task 1') }}
                        style={{ background: 'white', borderRadius: '12px', padding: '15px', marginBottom: '15px', cursor: 'pointer', }}>
                        <div
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', }}>
                                <img src="../public/assets/taskSign.png" alt="Task"
                                    style={{ width: '22px', height: '22px', }} />
                                <span style={{ fontSize: '18px', color: '#333', }}>Task1 <span
                                    style={{ fontWeight: '800', }}>&gt;</span></span>
                            </div>
                            <div
                                style={{ fontSize: '10px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', background: '#5ec390', color: 'white', }}>
                                SUCCESS</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', }}>
                            <div
                                style={{ flex: '1', height: '6px', background: '#E9ECEF', borderRadius: '4px', overflow: 'hidden', }}>
                                <div
                                    style={{ height: '100%', width: '100%', background: '#6ba7c2', borderRadius: '4px', }}>
                                </div>
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#222', }}>100%</span>
                        </div>
                        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px', }}>
                            <div
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '700', }}>
                                <img src="../public/assets/Ai-sign.png" alt="AI Icon"
                                    style={{ width: '14px', height: '14px', }} />
                                <span className="ai-summary-text-gradient ai-summary-text-gradient-small">AI
                                    Summary</span>
                            </div>
                            <span style={{ fontSize: '10px', color: '#444', lineHeight: '1.3', }}>This task is
                                done!</span>
                        </div>
                    </div>

                    {/* Task 2 */}
                    <div onClick={() => { openTaskDetail('Name Surname 3', 'Task 2') }}
                        style={{ background: 'white', borderRadius: '12px', padding: '15px', marginBottom: '15px', cursor: 'pointer', }}>
                        <div
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', }}>
                                <img src="../public/assets/taskSign.png" alt="Task"
                                    style={{ width: '22px', height: '22px', }} />
                                <span style={{ fontSize: '18px', color: '#333', }}>Task2 <span
                                    style={{ fontWeight: '800', }}>&gt;</span></span>
                            </div>
                            <div
                                style={{ fontSize: '10px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', background: '#fae489', color: '#111', }}>
                                IN PROGRESS</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', }}>
                            <div
                                style={{ flex: '1', height: '6px', background: '#E9ECEF', borderRadius: '4px', overflow: 'hidden', }}>
                                <div style={{ height: '100%', width: '71%', background: '#6ba7c2', borderRadius: '4px', }}>
                                </div>
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#222', }}>71%</span>
                        </div>
                        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px', }}>
                            <div
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '700', }}>
                                <img src="../public/assets/Ai-sign.png" alt="AI Icon"
                                    style={{ width: '14px', height: '14px', }} />
                                <span className="ai-summary-text-gradient ai-summary-text-gradient-small">AI
                                    Summary</span>
                            </div>
                            <span style={{ fontSize: '10px', color: '#444', lineHeight: '1.3', }}>According to the
                                rubric , I suggest<br />you to edit...</span>
                        </div>
                    </div>

                    {/* Task 3 */}
                    <div onClick={() => { openTaskDetail('Name Surname 3', 'Task 3') }}
                        style={{ background: 'white', borderRadius: '12px', padding: '15px', marginBottom: '15px', cursor: 'pointer', }}>
                        <div
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', }}>
                                <img src="../public/assets/taskSign.png" alt="Task"
                                    style={{ width: '22px', height: '22px', }} />
                                <span style={{ fontSize: '18px', color: '#333', }}>Task3 <span
                                    style={{ fontWeight: '800', }}>&gt;</span></span>
                            </div>
                            <div
                                style={{ fontSize: '10px', fontWeight: '600', color: '#111', textTransform: 'uppercase', }}>
                                WAITING</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', }}>
                            <div
                                style={{ flex: '1', height: '6px', background: '#E9ECEF', borderRadius: '4px', overflow: 'hidden', }}>
                                <div style={{ height: '100%', width: '0%', background: '#6ba7c2', borderRadius: '4px', }}>
                                </div>
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#222', }}>0%</span>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '10px', }}>
                        <button onClick={() => { openAddTaskModal('Name Surname 3') }}
                            style={{ background: 'transparent', border: 'none', color: '#4bc4de', fontWeight: '700', fontSize: '13px', cursor: 'pointer', }}>Add
                            Task</button>
                    </div>
                </div>

            </div>


        </section>
    );
}