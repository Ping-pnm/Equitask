import checkListIcon from '../assets/checklist-icon.png'
import editIcon from '../assets/editSign.png'

export default function WorkPost({ title, date }) {
    return (
        <div className="post-card-work">
            <div className="post-card-left">
                <img src={checkListIcon} alt="Checklist" className="post-card-icon" />
                <span className="post-card-title">{title}</span>
            </div>
            <div className="post-card-right">
                <span className="post-card-due">Due {date}</span>
                <img src={editIcon} alt="Edit" className="post-card-edit-icon" />
            </div>
        </div>
    );
}