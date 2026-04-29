import { useNavigate } from 'react-router-dom';

export default function GroupCard({ groupId, assignmentId, groupName, overallProgress, members, summary, isSubmitted }) {
    const navigate = useNavigate();

    // Use overallProgress if provided, otherwise calculate from members
    const baseProgress = (overallProgress != null)
        ? Number(overallProgress)
        : (members && members.length > 0)
            ? members.reduce((sum, m) => sum + (Number(m.progress) || 0), 0) / members.length
            : 0;

    const roundedProgress = isSubmitted ? 100 : Math.round(baseProgress);


    // Half-circle gauge settings
    const circumference = 188.5; // (PI * 120) / 2 approx for half circle
    const dashOffset = circumference * (1 - roundedProgress / 100);

    return (
        <div className="group-overview-card" style={{
            background: '#F8F9F9',
            borderRadius: '40px',
            padding: '35px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '420px',
            margin: '0 auto'
        }}>
            {/* Header */}
            <div style={{ width: '100%', textAlign: 'center', marginBottom: '25px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#333', margin: '0 0 10px 0' }}>{groupName || 'Group Project'}</h3>
                <div style={{ width: '100%', height: '1px', background: '#ccc' }}></div>
            </div>

            <div style={{ display: 'flex', width: '100%', gap: '20px', alignItems: 'flex-start', marginBottom: '30px' }}>
                {/* Circular Gauge */}
                <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0 }}>
                    <svg width="130" height="130" viewBox="0 0 100 100">
                        {/* Background Circle */}
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#BDC3C7" strokeWidth="12" />
                        {/* Progress Circle */}
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#5D6D7E" strokeWidth="12"
                            strokeDasharray="251.2"
                            strokeDashoffset={251.2 * (1 - roundedProgress / 100)}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dashoffset 0.8s ease', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                        />
                    </svg>
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '26px', fontWeight: '700', color: '#1a1a1a'
                    }}>
                        {roundedProgress}%
                    </div>
                </div>

                {/* AI Summary Box */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '18px' }}>✨</span>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#4BA1C0' }}>AI Summary</span>
                    </div>
                    <div style={{
                        border: '1px solid #7F8C8D',
                        borderRadius: '4px',
                        padding: '12px',
                        background: 'white',
                        minHeight: '80px',
                        fontSize: '13px',
                        color: '#333',
                        lineHeight: '1.4'
                    }}>
                        {summary ? (summary.length > 60 ? summary.substring(0, 60) + "..." : summary) : "This group are working on their project tasks..."}
                        <div style={{ textAlign: 'right', marginTop: '4px' }}>
                            <span style={{ textDecoration: 'underline', fontWeight: '700', cursor: 'pointer' }}>read more</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Individual Progress Rows */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '35px' }}>
                {(members || []).map((student, idx) => {
                    const firstName = student.name ? student.name.split(' ')[0] : 'Student';
                    const progressValue = Math.round(student.progress || 0);

                    return (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#444', minWidth: '70px', textAlign: 'right' }}>{firstName}</span>
                            <div style={{ flex: 1, height: '18px', background: '#BDC3C7', borderRadius: '9px', overflow: 'hidden' }}>
                                <div style={{ width: `${progressValue}%`, height: '100%', background: '#5D6D7E', borderRadius: '9px', transition: 'width 0.5s ease' }}></div>
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: '#333', minWidth: '40px' }}>{progressValue}%</span>
                        </div>
                    );
                })}
            </div>

            {/* More Button */}
            <button
                onClick={() => navigate(`/group-project/${groupId}`)}
                style={{
                    width: '180px',
                    padding: '14px',
                    background: '#5D6D7E',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    fontSize: '18px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}
            >
                More
            </button>
        </div>
    );
}
