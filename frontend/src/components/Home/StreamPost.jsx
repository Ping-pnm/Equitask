import checkListIcon from '../../assets/checklist-icon.png';

export default function StreamPost({ author, title, date, }) {
    return (
        <div
            className="post-card"
        >
            <div className="post-icon-wrapper">
                <img src={checkListIcon} alt="Post Icon" />
            </div>
            <div className="post-info">
                <div className="post-title">
                    {author} posted a new assignment: {title}
                </div>
                <div className="post-date">{date}</div>
            </div>
        </div>
    );
}
