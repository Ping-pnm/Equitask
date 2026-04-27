export default function ProgressBar({ progress }) {
    return (
        <div className="group-progress-bar-wrapper">
            <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="progress-percentage-text">{progress}%</span>
        </div>
    );
}
