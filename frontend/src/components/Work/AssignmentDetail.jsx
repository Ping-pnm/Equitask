

export default function AssingmentDetail() {
    return (
        <div id="assignment-detail-view"
            className="assignment-detail-wrapper">
            {/* Title Area */}
            <div
                className="assignment-detail-header">
                <div className="assignment-title-group">
                    <img src="../assets/checklist-icon.png" alt="Checklist"
                        className="assignment-title-icon" />
                    <div>
                        <h1 className="assignment-title-text">
                            Group Project</h1>
                        <div className="assignment-due-text">Due 31 Dec</div>
                    </div>
                </div>
                <div className="assignment-points-group">
                    <img src="../assets/editSign.png" alt="Edit" className="edit-icon-medium" />
                    <div className="assignment-points-text">100 points</div>
                </div>
            </div>

            {/* Body Text */}
            <div
                className="assignment-body-text">
                <div>[Group Project]</div>
                <div>For the project proposal, prepare your topic and answer these questions.</div>
                <ol className="assignment-questions-list">
                    <li>The name of the application and what its main objectives?</li>
                    <li>Who are the stakeholders of your applications?</li>
                    <li>What pain points or problems that your application can solve for users?</li>
                    <li>Why users need to use your application compared to other existing applications in
                        the market?</li>
                    <li>What are unique functions?</li>
                    <li>How can you sustain the application or scale up the application?</li>
                    <li>If you need to invest your own money into this project, would you do it? If not,
                        why?</li>
                    <li>Can you make profit from this application?</li>
                </ol>

                {/* Rubric Display */}
                <div className="rubrics-label">Rubrics:</div>
                <table className="rubrics-table">
                    <tbody>
                        <tr>
                            <td className="rubrics-cell"></td>
                            <td className="rubrics-cell"></td>
                            <td className="rubrics-cell"></td>
                        </tr>
                        <tr>
                            <td className="rubrics-cell"></td>
                            <td className="rubrics-cell"></td>
                            <td className="rubrics-cell"></td>
                        </tr>
                        <tr>
                            <td className="rubrics-cell"></td>
                            <td className="rubrics-cell"></td>
                            <td className="rubrics-cell"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Groups Section */}
            <div className="groups-section">
                <button
                    className="btn-create-group">Create
                    Group</button>

                {/* Groups List */}
                <div className="groups-list">
                    {/* Group 1 */}
                    <div
                        className="group-item-container">
                        <div className="group-nav-row group-row-inner">
                            <div className="group-name">Group 1</div>
                            <div className="group-progress-wrapper">
                                <div
                                    className="progress-bar-bg">
                                    <div
                                        className="progress-bar-fill-66">
                                    </div>
                                </div>
                                <span className="progress-text">66%</span>
                            </div>
                        </div>
                        <div className="btn-delete-group">
                            Delete</div>
                    </div>
                    {/* Group 2 */}
                    <div
                        className="group-item-container">
                        <div className="group-nav-row group-row-inner">
                            <div className="group-name">Group 2</div>
                            <div className="group-progress-wrapper">
                                <div
                                    className="progress-bar-bg">
                                    <div
                                        className="progress-bar-fill-33">
                                    </div>
                                </div>
                                <span className="progress-text">33%</span>
                            </div>
                        </div>
                        <div className="btn-delete-group">
                            Delete</div>
                    </div>
                    {/* Group 3 */}
                    <div
                        className="group-item-container">
                        <div className="group-nav-row group-row-inner">
                            <div className="group-name">Group 3</div>
                            <div className="group-progress-wrapper">
                                <div
                                    className="progress-bar-bg">
                                    <div
                                        className="progress-bar-fill-80">
                                    </div>
                                </div>
                                <span className="progress-text">80%</span>
                            </div>
                        </div>
                        <div className="btn-delete-group">
                            Delete</div>
                    </div>
                </div>
            </div>
        </div>
    );
}