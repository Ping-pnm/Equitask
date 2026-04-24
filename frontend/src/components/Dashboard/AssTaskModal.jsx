

export default function AddTaskModal() {
    return (
        <div id="modal-add-task" className="modal-overlay hidden">
            <div className="modal-content modal-edit-content" style={{ maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', }}>
                {/* Header */}
                <div className="modal-title-row">
                    <h2 className="modal-title-text" style={{ color: '#5cc3e0', }}>Add Task : <span id="add-task-student-name">Name
                        Surname</span></h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', }}>
                        <span onClick={() => { closeModal('modal-add-task') }}
                            style={{ fontSize: '16px', color: '#666', cursor: 'pointer', fontWeight: '500', }}>Cancel</span>
                        <button type="submit" onClick={() => { closeModal('modal-add-task') }} className="modal-submit-btn"
                            style={{ background: '#5cc3e0', padding: '8px 30px', fontSize: '16px', borderRadius: '8px', }}>Add</button>
                    </div>
                </div>

                {/* Body */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', }}>
                    <div className="modal-input-wrapper" style={{ padding: '5px 15px', }}>
                        <input type="text" placeholder="Task Name" className="modal-input-field" style={{ padding: '15px 0', }} />
                    </div>

                    <div className="modal-input-wrapper" style={{ padding: '15px', }}>
                        <textarea placeholder="Details"
                            style={{ width: '100%', height: '120px', border: 'none', background: 'transparent', fontSize: '16px', color: '#333', outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: '1.5', }}></textarea>
                    </div>

                    {/* Rubrics Section */}
                    <div className="modal-input-wrapper" style={{ padding: '20px', }}>
                        <div
                            style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '14px', fontWeight: '700', color: '#b3b9c6', marginBottom: '15px', }}>
                            Rubrics
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000', }}>
                                Rows:
                                <svg onClick={() => { updateRubric('add-task', 'row', -1) }} width="18" height="18"
                                    viewBox="0 0 24 24" fill="black" stroke="white" strokeWidth="2"
                                    style={{ cursor: 'pointer', }}>
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="8" y1="12" x2="16" y2="12"></line>
                                </svg>
                                <span id="rubric-rows-add-task" style={{ fontSize: '16px', }}>3</span>
                                <svg onClick={() => { updateRubric('add-task', 'row', 1) }} width="18" height="18" viewBox="0 0 24 24"
                                    fill="black" stroke="white" strokeWidth="2" style={{ cursor: 'pointer', }}>
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="16"></line>
                                    <line x1="8" y1="12" x2="16" y2="12"></line>
                                </svg>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000', }}>
                                Columns:
                                <svg onClick={() => { updateRubric('add-task', 'col', -1) }} width="18" height="18"
                                    viewBox="0 0 24 24" fill="black" stroke="white" strokeWidth="2"
                                    style={{ cursor: 'pointer', }}>
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="8" y1="12" x2="16" y2="12"></line>
                                </svg>
                                <span id="rubric-cols-add-task" style={{ fontSize: '16px', }}>3</span>
                                <svg onClick={() => { updateRubric('add-task', 'col', 1) }} width="18" height="18" viewBox="0 0 24 24"
                                    fill="black" stroke="white" strokeWidth="2" style={{ cursor: 'pointer', }}>
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="16"></line>
                                    <line x1="8" y1="12" x2="16" y2="12"></line>
                                </svg>
                            </div>
                        </div>
                        {/* Table */}
                        <div style={{ width: '100%', overflow: 'hidden', }}>
                            <table className="ai-rubrics-table">
                                <tbody id="rubric-table-add-task">
                                    <tr>
                                        <td contentEditable="true" style={{ height: '60px', verticalAlign: 'top', }}></td>
                                        <td contentEditable="true" style={{ height: '60px', verticalAlign: 'top', }}></td>
                                        <td contentEditable="true" style={{ height: '60px', verticalAlign: 'top', }}></td>
                                    </tr>
                                    <tr>
                                        <td contentEditable="true" style={{ height: '60px', verticalAlign: 'top', }}></td>
                                        <td contentEditable="true" style={{ height: '60px', verticalAlign: 'top', }}></td>
                                        <td contentEditable="true" style={{ height: '60px', verticalAlign: 'top', }}></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}