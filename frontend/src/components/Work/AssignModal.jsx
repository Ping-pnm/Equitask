import { createPortal } from 'react-dom';
import uploadSign from '../../assets/UploadSign.png';
import checkListIcon from '../../assets/checklist-icon.png';
import { useState, useRef } from 'react';
import Rubric from '../Rubric.jsx';
import AttachmentDisplay from '../AttachmentDisplay.jsx';
import { assignWork, updateWork, getAssignment } from '../../services/workService.js';
import { useAuth } from '../AuthContext.jsx';
import { useEffect } from 'react';


export default function AssignModal({ onClose, classId, isCreate, assignmentId }) {
    const fileInputRef = useRef(null);
    const { userId } = useAuth();

    const getTodayDateTimeString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}T23:59`;
    };

    const [modalData, setModalData] = useState({
        title: '',
        instruction: '',
        useRubric: true,
        rubricCriterias: Array(2).fill(''),
        rubricLevels: Array(2).fill(''),
        rubricCells: Array.from({ length: 2 }, () => Array(2).fill('')),
        files: [],
        points: 100,
        dueDateTime: getTodayDateTimeString(),
        isGroupWork: false
    });

    useEffect(() => {
        if (!isCreate && assignmentId) {
            const loadAssignmentData = async () => {
                try {
                    const data = await getAssignment(assignmentId);
                    const fetchedCriterias = data.criteria?.length > 0 ? data.criteria.map(c => c.title) : Array(2).fill('');
                    const fetchedLevels = data.levels?.length > 0 ? data.levels.map(l => l.title) : Array(2).fill('');

                    setModalData({
                        title: data.title || '',
                        instruction: data.instructions || '',
                        points: data.points || 100,
                        dueDateTime: data.dueDate ? data.dueDate.split('.')[0].replace(' ', 'T') : getTodayDateTimeString(),
                        isGroupWork: !!data.isGroupWork,
                        rubricCriterias: fetchedCriterias,
                        rubricLevels: fetchedLevels,
                        rubricCells: data.rubricCells && data.rubricCells.length > 0 ? data.rubricCells : Array.from({ length: fetchedCriterias.length }, () => Array(fetchedLevels.length).fill('')),
                        files: data.files ? data.files.map(f => ({
                            name: f.fileName || f.fileUrl.split('-').slice(1).join('-'),
                            fileUrl: f.fileUrl,
                            isExisting: true
                        })) : []
                    });
                } catch (err) {
                    console.error("Failed to load assignment:", err);
                    alert("Error loading assignment details");
                }
            };
            loadAssignmentData();
        }
    }, [isCreate, assignmentId]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setModalData(prev => ({
            ...prev,
            files: [...prev.files, ...selectedFiles]
        }));
    };

    const handleDeleteFile = (index) => {
        setModalData(prev => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index)
        }));
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleAssign = async () => {
        try {
            const formData = new FormData();
            formData.append('classId', classId);
            formData.append('creatorId', userId);
            formData.append('title', modalData.title);
            formData.append('instruction', modalData.instruction);
            formData.append('points', modalData.points);
            formData.append('dueDate', modalData.dueDateTime);
            formData.append('isGroupWork', modalData.isGroupWork);
            formData.append('useRubric', modalData.useRubric);

            // Send arrays as JSON strings
            formData.append('rubricCriterias', JSON.stringify(modalData.rubricCriterias));
            formData.append('rubricLevels', JSON.stringify(modalData.rubricLevels));
            formData.append('rubricCells', JSON.stringify(modalData.rubricCells));
            
            // Separate existing files from new ones
            const existingFiles = modalData.files.filter(f => f.isExisting);
            formData.append('existingFiles', JSON.stringify(existingFiles));

            // Append all new files
            modalData.files.forEach((file) => {
                if (!file.isExisting) {
                    formData.append('files', file);
                }
            });

            if (isCreate) {
                await assignWork(formData);
            } else {
                await updateWork(assignmentId, formData);
            }
            onClose(true); // Close and refresh
        } catch (err) {
            console.error("Assign Error:", err);
            alert(err.message || "Failed to create assignment");
        }
    };

    const toggleGroupWork = () => {
        setModalData(prev => ({ ...prev, isGroupWork: !prev.isGroupWork }));
    };

    return createPortal(
        <div id="modal-assign" className="modal-overlay">
            <div className="modal-content modal-content-scrollable">
                {/* Header */}
                <div
                    className="modal-header-row">
                    <div className="modal-title-group">
                        <img src={checkListIcon} alt="Checklist"
                            className="assignment-title-icon" />
                        <span className="modal-title-text-custom">Assignment</span>
                    </div>
                    <button type="button" onClick={() => onClose(false)}
                        className="modal-close-symbol">&times;</button>
                </div>

                {/* Body */}
                <div className="modal-body-section">
                    <input
                        type="text"
                        placeholder="Title"
                        className="input-title-large"
                        value={modalData.title}
                        onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                    />
                    <textarea
                        placeholder="Instructions"
                        className="input-instructions-large"
                        required
                        value={modalData.instruction}
                        onChange={(e) => setModalData({ ...modalData, instruction: e.target.value })}
                    ></textarea>

                    {/* Rubrics Section */}
                    <Rubric
                        criterias={modalData.rubricCriterias}
                        levels={modalData.rubricLevels}
                        cells={modalData.rubricCells}
                        useRubric={modalData.useRubric}
                        setModalData={setModalData}
                    />
                </div>

                {/* Options */}
                <div
                    className="modal-options-row">
                    <div className="file-info-group">
                        Points
                        <div
                            className="points-input-wrapper">
                            <input type="text"
                                value={modalData.points}
                                className="points-input"
                                onChange={(e) => setModalData({ ...modalData, points: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="file-info-group">
                        Due
                        <div
                            className="due-date-wrapper">
                            <input type="datetime-local"
                                className="due-date-input"
                                value={modalData.dueDateTime}
                                onChange={(e) => setModalData({ ...modalData, dueDateTime: e.target.value })}
                            />
                            <span className="due-date-display">{modalData.dueDateTime.replace('T', ' ')}</span>
                            <span className="chevron-icon">▼</span>
                        </div>
                    </div>
                    <div className="file-info-group">
                        GroupWork
                        <div
                            id="group-work-toggle"
                            className={`toggle-switch ${modalData.isGroupWork ? 'active' : ''}`}
                            onClick={toggleGroupWork}
                        >
                            <div id="group-work-knob" className="toggle-knob"></div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer-row">
                    <div className="compose-icons" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <div className="attachments-footer-wrapper" style={{ marginBottom: '10px', width: '100%' }}>
                            <AttachmentDisplay files={modalData.files} onDelete={handleDeleteFile} />
                        </div>
                        <input
                            type="file"
                            multiple
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <button type="button"
                            className="icon-btn-custom"
                            onClick={handleUploadClick}>
                            <img src={uploadSign} alt="Upload"
                                className="modal-footer-icon" />
                        </button>
                    </div>
                    <div className="modal-actions-right">
                        <button type="button" className="btn-cancel btn-cancel-custom" onClick={() => onClose(false)}>Cancel</button>
                        <button type="button"
                            className="btn-submit-custom btn-post-cta" onClick={handleAssign}>Assign</button>
                    </div>
                </div>
            </div>
        </div>
        , document.getElementById('portal-root'));
}