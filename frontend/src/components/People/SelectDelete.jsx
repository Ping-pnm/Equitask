

export default function SelectDelete() {
    return (
        <>
            <div onclick="toggleSelectAll()" id="btn-select-all" className="members-action-btn">
                <div id="checkbox-select-all" data-selected="false" className="custom-checkbox-box">
                </div>
                Select All
            </div>
            <div onclick="deleteSelectedMembers()" className="members-action-btn">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#56c4df"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path
                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                    </path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                Delete
            </div>
        </>

    );
}