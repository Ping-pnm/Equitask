import React, { useState } from 'react';
import Rubric from '../Rubric';
import { createTask } from '../../services/taskService';

export default function AddTaskModal({ isOpen, onClose, member, groupId, assignmentId, onSuccess }) {
    const [modalData, setModalData] = useState({
        taskName: '',
        details: '',
        useRubric: true,
        rubricCriterias: ['', '', ''],
        rubricLevels: ['', '', ''],
        rubricCells: [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ]
    });

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!modalData.taskName.trim()) {
            alert("Please enter a task name");
            return;
        }

        try {
            const taskPayload = {
                name: modalData.taskName,
                details: modalData.details,
                userId: member.userId,
                groupId: groupId,
                assignmentId: assignmentId,
                rubrics: modalData.useRubric ? {
                    criterias: modalData.rubricCriterias,
                    levels: modalData.rubricLevels,
                    cells: modalData.rubricCells
                } : null
            };

            await createTask(taskPayload);
            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            console.error("Failed to create task:", err);
            alert("Error creating task. Please try again.");
        }
    };

    return (
        <div id="modal-add-task" className="modal-overlay" style={{ display: 'flex' }}>
            <div className="modal-content modal-edit-content" style={{ maxWidth: '950px', width: '90%', maxHeight: '95vh', overflowY: 'auto' }}>
                {/* Header */}
                <div className="modal-title-row">
                    <h2 className="modal-title-text" style={{ color: '#5cc3e0' }}>
                        Add Task : <span id="add-task-student-name">{member?.firstName} {member?.lastName}</span>
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <span onClick={onClose}
                            style={{ fontSize: '16px', color: '#666', cursor: 'pointer', fontWeight: '500' }}>Cancel</span>
                        <button type="submit" onClick={handleSubmit} className="modal-submit-btn"
                            style={{ background: '#5cc3e0', padding: '8px 30px', fontSize: '16px', borderRadius: '8px' }}>Assign</button>
                    </div>
                </div>

                {/* Body */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="modal-input-wrapper" style={{ padding: '5px 15px' }}>
                        <input 
                            type="text" 
                            placeholder="Task Name" 
                            className="modal-input-field" 
                            style={{ padding: '15px 0' }} 
                            value={modalData.taskName}
                            onChange={(e) => setModalData({...modalData, taskName: e.target.value})}
                        />
                    </div>

                    <div className="modal-input-wrapper" style={{ padding: '15px' }}>
                        <textarea 
                            placeholder="Details"
                            style={{ width: '100%', height: '120px', border: 'none', background: 'transparent', fontSize: '16px', color: '#333', outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: '1.5' }}
                            value={modalData.details}
                            onChange={(e) => setModalData({...modalData, details: e.target.value})}
                        ></textarea>
                    </div>

                    {/* Rubrics Section */}
                    <div className="modal-input-wrapper" style={{ padding: '0 20px 20px 20px' }}>
                        <Rubric 
                            criterias={modalData.rubricCriterias}
                            levels={modalData.rubricLevels}
                            cells={modalData.rubricCells}
                            useRubric={modalData.useRubric}
                            setModalData={setModalData}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}