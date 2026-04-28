import { useClass } from './ClassContext';

import AssignModal from './Work/AssignModal';

import checkListIcon from '../assets/checklist-icon.png'
import editIcon from '../assets/editSign.png'
import { useState } from 'react';


export default function WorkPost({ author, title, date, assignmentId, onUpdate, onClick }) {
    const { isLeader, activeClassId } = useClass();
    const [isEditing, setIsEditing] = useState(false);

    // If author is provided, it's a stream post
    const isStreamType = !!author;

    return (
        <>
            <div className={`post-card-work ${isStreamType ? 'post-card-stream' : ''}`} onClick={() => onClick && onClick(assignmentId)}>
                <div className="post-card-left">
                    {isStreamType ? <div className="post-icon-wrapper"><img src={checkListIcon} alt="Checklist" className="post-card-icon" /></div> : <img src={checkListIcon} alt="Checklist" className="post-card-icon" />
                    }
                    <div className="post-info">
                        <span className="post-card-title">
                            {isStreamType ? `${author} posted a new assignment: ${title}` : title}
                        </span>
                        {isStreamType && <div className="post-date">{date}</div>}
                    </div>
                </div>
                {!isStreamType && (
                    <div className="post-card-right">
                        <span className="post-card-due">Due {date}</span>
                        {isLeader && (
                            <div className="post-card-actions">
                                <img src={editIcon} alt="Edit"
                                    className="post-card-edit-icon"
                                    onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} />
                            </div>
                        )}
                    </div>
                )}
            </div>
            {isEditing && <AssignModal
                onClose={(refresh) => {
                    setIsEditing(false);
                    if (refresh && onUpdate) onUpdate();
                }}
                classId={activeClassId}
                isCreate={false}
                assignmentId={assignmentId}
            />}
        </>
    );
}