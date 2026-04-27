import { useClass } from './ClassContext';

import AssignModal from './Work/AssignModal';

import checkListIcon from '../assets/checklist-icon.png'
import editIcon from '../assets/editSign.png'
import { useState } from 'react';


export default function WorkPost({ title, date, isGroupWork, assignmentId, onUpdate }) {
    const { isLeader, activeClassId } = useClass();
    const [isEditing, setIsEditing] = useState(false);


    return (
        <div className="post-card-work">
            <div className="post-card-left">
                <img src={checkListIcon} alt="Checklist" className="post-card-icon" />
                <span className="post-card-title">{title}</span>
            </div>
            <div className="post-card-right">
                <span className="post-card-due">Due {date}</span>
                {isLeader && (
                    <div className="post-card-actions">
                        <img src={editIcon} alt="Edit"
                            className="post-card-edit-icon"
                            onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} />
                    </div>
                )}
                {isEditing && <AssignModal
                    onClose={(refresh) => {
                        setIsEditing(false);
                        if (refresh && onUpdate) onUpdate();
                    }}
                    classId={activeClassId}
                    isCreate={false}
                    assignmentId={assignmentId}
                />}
            </div>
        </div>
    );
}