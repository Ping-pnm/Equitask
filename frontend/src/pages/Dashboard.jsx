import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { useClass } from "../components/ClassContext";
import { getWorkFeed } from "../services/workService";
import WorkPost from "../components/WorkPost";
import GroupCard from "../components/Dashboard/GroupCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Dashboard() {
    const { userId } = useAuth();
    const { activeClassId, isLeader } = useClass();
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchWork = useCallback(async () => {
        if (!activeClassId || !userId) { setIsLoading(false); return; }
        try {
            setIsLoading(true);
            const data = await getWorkFeed(activeClassId, userId, true);
            setAssignments(data);
        } catch (err) {
            console.error("Failed to fetch dashboard work:", err);
        } finally {
            setIsLoading(false);
        }
    }, [activeClassId, userId]);

    useEffect(() => {
        fetchWork();
    }, [fetchWork]);

    return (
        <section id="dashboard-listing-view" className="stream-content stream-content-scrollable">
            <div id="assignments-container" className="posts-container">
                {isLoading ? (
                    <LoadingSpinner />
                ) : assignments.length > 0 ? (
                    (() => {
                        return assignments.map((work) => {
                            // Student View
                            if (!isLeader) {
                                if (work.isGroupWork) {
                                    if (work.groupId) {
                                        return (
                                            <GroupCard
                                                key={work.assignmentId}
                                                groupId={work.groupId}
                                                assignmentId={work.assignmentId}
                                                groupName={work.groupName || `Project: ${work.title}`}
                                                overallProgress={Math.round(work.groupProgress || 0)}
                                                members={work.members}
                                                summary={null}
                                            />
                                        );
                                    } else {
                                        return (
                                            <div key={work.assignmentId} className="no-group-display">
                                                <h3 className="group-card-title">{work.title}</h3>
                                                <p className="no-group-notice">You have no group for this project.</p>
                                            </div>
                                        );
                                    }
                                } else {
                                    // Individual Assignment for Student
                                    return (
                                        <WorkPost
                                            key={work.assignmentId}
                                            title={work.title}
                                            date={new Date(work.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toUpperCase()}
                                            isGroupWork={false}
                                            assignmentId={work.assignmentId}
                                            onUpdate={fetchWork}
                                            onClick={(id) => navigate(`/group-assignment/${id}`)}
                                        />
                                    );
                                }
                            }

                            // Leader View: Standard WorkPost for all
                            return (
                                <WorkPost
                                    key={work.assignmentId}
                                    title={work.title}
                                    date={new Date(work.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toUpperCase()}
                                    isGroupWork={!!work.isGroupWork}
                                    assignmentId={work.assignmentId}
                                    onUpdate={fetchWork}
                                    onClick={(id) => {
                                        if (work.isGroupWork) {
                                            navigate(`/project/${id}`);
                                        } else {
                                            navigate(`/leader-assignment/${id}`);
                                        }
                                    }}
                                />
                            );
                        });
                    })()
                ) : (
                    <p className="no-posts-msg">No assignments found.</p>
                )}
            </div>
        </section>
    );
}