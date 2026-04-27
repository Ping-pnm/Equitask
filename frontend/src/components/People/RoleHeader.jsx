import { useState } from "react";
import { useClass } from "../ClassContext";
import InviteIcon from "./InviteIcon";
import InviteModal from "./InviteModal";

export default function LeaderHeader({ role, onRefresh }) {
    const [isInviting, setIsInviting] = useState(false);
    const { isLeader } = useClass();

    function handleClick() {
        setIsInviting(true);
    }

    const inviteType = role.toLowerCase().includes('leader') ? 'leader' : 'member';

    return (
        <div className="people-section-header section-header">
            <h2 className="people-section-title">{role}</h2>

            {isLeader && <InviteIcon handleClick={handleClick} />}

            {isInviting && (
                <InviteModal 
                    type={inviteType} 
                    onClose={() => setIsInviting(false)} 
                    onRefresh={onRefresh}
                />
            )}
        </div>
    );

}