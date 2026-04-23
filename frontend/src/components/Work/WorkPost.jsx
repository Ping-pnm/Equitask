import checkListIcon from '../../assets/checklist-icon.png'
import editIcon from '../../assets/editSign.png'

export default function WorkPost() {
    return (
        <div className="post-card">
            <div className="post-card-left">
                <img src={checkListIcon} alt="Checklist" className="post-card-icon" />
                <span className="post-card-title">Group Project</span>
            </div>
            <div className="post-card-right">
                <span className="post-card-due">Due 31 Dec</span>
                <img src={editIcon} alt="Edit" className="post-card-edit-icon" />
            </div>
        </div>
    );
}