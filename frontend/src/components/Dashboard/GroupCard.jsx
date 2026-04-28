import { useNavigate } from 'react-router-dom';
import aiLogo from '../../assets/Ai-sign.png';
import ProgressBar from '../ProgressBar';

export default function GroupCard({ groupId, assignmentId, groupName, overallProgress, members, summary }) {
    const navigate = useNavigate();
    return (
        <div className="group-overview-card">
            <div className="group-card-header">
                <h3 className="group-card-title">{groupName}</h3>
                <div className="group-card-divider"></div>
            </div>

            <div className="group-card-middle">
                {/* Circular Progress */}
                <div className="circular-progress-container">
                    <div className="circular-progress" style={{
                        background: `conic-gradient(#63778f ${overallProgress * 3.6}deg, #e0e0e0 0deg)`
                    }}>
                        <div className="circular-progress-inner">
                            <span className="progress-value">{overallProgress}%</span>
                        </div>
                    </div>
                </div>

                {/* AI Summary Box */}
                <div className="ai-summary-box">
                    <div className="ai-summary-header">
                        <img src={aiLogo} alt="Ai summary logo" /> AI Summary
                    </div>
                    <div className="ai-summary-content">
                        <p>
                            {summary ? `${summary}... ` : "No summary available for this group yet. "}
                            {summary && <span className="read-more-link">read more</span>}
                        </p>
                    </div>
                </div>
            </div>

            <div className="group-card-members">
                {members && members.length > 0 ? (
                    members.map((student, idx) => (
                        <div key={idx} className="student-progress-row">
                            <span className="student-name">{student.name}</span>
                            <ProgressBar progress={student.progress} />
                        </div>
                    ))
                ) : (
                    <p className="no-members-msg" style={{ fontSize: '12px', color: '#999', textAlign: 'center' }}>
                        Join this group to see member progress.
                    </p>
                )}
            </div>

            <button 
                className="btn-group-more" 
                onClick={() => navigate(`/group-project/${groupId}`)}
            >
                More
            </button>
        </div>
    );
}
