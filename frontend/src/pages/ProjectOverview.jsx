import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import checkListIcon from '../assets/checklist-icon.png';
import { getAssignment, getAllGroupsForAssignment } from '../services/workService';
import LoadingSpinner from '../components/LoadingSpinner';
import GroupCard from '../components/Dashboard/GroupCard';

export default function ProjectOverview() {
    const { assignmentId } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [groups, setGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

    return (
        <section id="dashboard-project-view" className="stream-content extracted-style-18">
            <div className="dashboard-page-header">
                <img src={checkListIcon} alt="Checklist" />
                <h1>{assignment.title}</h1>
            </div>

            <div className="groups-grid" id="groups-container">
                {groups.length > 0 ? (
                    groups.map(group => (
                        <GroupCard
                            key={group.groupId}
                            groupName={group.groupName}
                            overallProgress={Math.floor(Math.random() * 100)} // Placeholder
                            members={group.members.map(m => ({
                                name: m.firstName,
                                progress: Math.floor(Math.random() * 100) // Placeholder
                            }))}
                            summary="are currently working on the initial phases of the project..." // Placeholder
                        />
                    ))
                ) : (
                    <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#999', padding: '40px' }}>No groups formed yet.</p>
                )}
            </div>
        </section>
    );
}
