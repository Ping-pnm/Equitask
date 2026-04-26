export default function LoadingSpinner() {
    return (
        <div className="loading-spinner-container">
            <div className="spinner-glow"></div>
            <div className="spinner-ring"></div>
            <span className="loading-text">Loading...</span>
        </div>
    );
}
