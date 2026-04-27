import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import { useClass } from "../components/ClassContext";
import { getLeaders, getMembers, deleteMembers } from "../services/classService";


import RoleHeader from "../components/People/RoleHeader";
import PeopleRow from "../components/People/PeopleRow";
import DeleteIcon from "../components/People/DeleteIcon";
import InviteModal from "../components/People/InviteModal";

export default function People() {
    const { userId } = useAuth();
    const { activeClassId } = useClass();
    const [allMembers, setAllMembers] = useState([]);

    const fetchLeaders = useCallback(() => {
        async function loadData() {
            try {
                const leaders = await getLeaders(activeClassId);
                setAllMembers((prev) => {
                    // Filter out any existing leader blocks to prevent duplicates
                    const filtered = prev.filter(block => block.type !== 'leader');
                    return [
                        ...filtered,
                        {
                            leaders,
                            type: 'leader'
                        }
                    ];
                });
            } catch (err) {
                console.error("Failed Fetching the People")
            }
        }
        loadData();
    }, [userId, activeClassId]);


    const fetchMembers = useCallback(() => {
        async function loadData() {
            try {
                const members = await getMembers(activeClassId);
                setAllMembers((prev) => {
                    // Collect IDs of everyone already in the 'leader' list
                    const leaderIds = prev
                        .filter(block => block.type === 'leader')
                        .flatMap(block => block.leaders.map(l => l.userId));

                    // Only keep members who are NOT leaders
                    const uniqueMembers = members.filter(m => !leaderIds.includes(m.userId));

                    // Filter out any existing member blocks to prevent duplicates
                    const filtered = prev.filter(block => block.type !== 'member');

                    return [
                        ...filtered,
                        {
                            members: uniqueMembers,
                            type: 'member'
                        }
                    ];
                });
            } catch (err) {
                console.error("Failed Fetching the People")
            }
        }
        loadData();
    }, [userId, activeClassId]);

    useEffect(() => {
        fetchLeaders();
        fetchMembers();
    }, [userId, activeClassId]);


    async function onDelete(targetId) {
        try {
            await deleteMembers(targetId, activeClassId);
            // Refresh both lists
            fetchLeaders();
            fetchMembers();
        } catch (err) {
            console.error("Failed to delete member:", err);
        }
    }

    return (
        <section className="people-content-area people-content">

            <div className="people-section-spacing people-section">
                <RoleHeader role='Leaders' />
                <div className="person-row-content person-row">
                    {allMembers
                        .filter(block => block.type === 'leader')
                        .flatMap(block => block.leaders)
                        .map((user) => (
                            <PeopleRow
                                key={user.userId}
                                memberId={user.userId}
                                name={`${user.firstName} ${user.lastName}`}
                                onDelete={() => onDelete(user.userId)}
                            />
                        ))
                    }
                </div>

            </div>
            <div className="people-section">
                <RoleHeader role='Members' />

                <div className="people-list-container-lg people-list">
                    {allMembers
                        .filter(block => block.type === 'member')
                        .flatMap(block => block.members)
                        .map((user) => (
                            <PeopleRow
                                key={user.userId}
                                memberId={user.userId}
                                name={`${user.firstName} ${user.lastName}`}
                                onDelete={() => onDelete(user.userId)}
                            />
                        ))
                    }
                </div>
            </div>
        </section>
    );
}