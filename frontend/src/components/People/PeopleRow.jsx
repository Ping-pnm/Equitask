import PeopleIcon from "./PeopleIcon.";
import DeleteIcon from "./DeleteIcon";
import { useClass } from "../ClassContext";
import { useAuth } from "../AuthContext";

export default function PeopleRow({ name, memberId, onDelete }) {
    const { isLeader } = useClass();
    const { userId } = useAuth();

    return (
        <div className="person-item-horizontal">
            <div className="person-details-left">
                <PeopleIcon />
                <span className="person-name">{name}</span>
            </div>

            {(isLeader && Number(memberId) !== Number(userId)) && (
                <div className="person-action-right">
                    <button className="btn-delete-member" title="Remove from class" onClick={onDelete}>
                        <DeleteIcon />
                    </button>
                </div>
            )}
        </div>
    );
}