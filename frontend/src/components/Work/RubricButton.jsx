export default function RubricButton({ onClick, isPlus }) {
    return (
        <svg
            width="14" height="14" viewBox="0 0 24 24" fill="black"
            stroke="white" stroke-width="2"
            className="modal-config-icon"
            onClick={onClick}
            style={{ cursor: 'pointer' }}
        >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
            {isPlus && <line x1="12" y1="8" x2="12" y2="16"></line>}
        </svg>
    );
}