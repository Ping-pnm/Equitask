import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import checkListIcon from '../assets/checklist-icon.png';
import { getAssignment, getAllGroupsForAssignment } from '../services/workService';
import LoadingSpinner from '../components/LoadingSpinner';
import GroupCard from '../components/Dashboard/GroupCard';
import { useAuth } from '../components/AuthContext';
import { useClass } from '../components/ClassContext';

export default function ProjectOverview() {
    const { assignmentId } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [groups, setGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { userId } = useAuth();
    const { isLeader } = useClass();

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const [assignmentData, groupsData] = await Promise.all([
                    getAssignment(assignmentId),
                    getAllGroupsForAssignment(assignmentId)
                ]);
                setAssignment(assignmentData);
                setGroups(groupsData);
            } catch (err) {
                console.error("Failed to fetch project overview:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [assignmentId]);

    if (isLoading) return <LoadingSpinner />;
    if (!assignment) return <div className="people-content-area" style={{ textAlign: 'center', padding: '50px' }}>Assignment not found.</div>;

    const filteredGroups = isLeader
        ? groups
        : groups.filter(group => group.members.some(m => m.userId === userId));

    return (
        <section id="dashboard-project-view" className="stream-content extracted-style-18">
            <div className="dashboard-page-header">
                <img src={checkListIcon} alt="Checklist" />
                <h1>{assignment.title}</h1>
            </div>

            <div className="groups-grid" id="groups-container">
                {filteredGroups.length > 0 ? (
                    filteredGroups.map(group => (
                        <GroupCard
                            key={group.groupId}
                            groupId={group.groupId}
                            assignmentId={assignmentId}
                            groupName={group.groupName}
                            overallProgress={group.groupProgress}
                            members={group.members.map(m => ({
                                name: m.name,
                                progress: m.progress,
                                tasks: m.tasks || []
                            }))}
                            summary={group.aiSummary || "This group are currently working on their project tasks..."}
                        />
                    ))
                ) : (
                    <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#999', padding: '40px' }}>No groups formed yet.</p>
                )}
            </div>
        </section>
    );
}
