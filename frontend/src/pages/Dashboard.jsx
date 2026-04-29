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
            const data = await getWorkFeed(activeClassId, userId, false);
            setAssignments(data);
        } catch (err) {
            console.error("Failed to fetch dashboard work:", err);
        } finally {
            setIsLoading(false);
        }
    }, [activeClassId, userId, isLeader]);

    useEffect(() => {
        fetchWork();
    }, [fetchWork]);

    return (
        <section id="dashboard-listing-view" className="stream-content stream-content-scrollable">


            <div id="assignments-container" className={isLeader ? "posts-container" : "groups-grid"}>
                {isLoading ? (
                    <LoadingSpinner />
                ) : assignments.length > 0 ? (
                    assignments.map((work) => {
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
                                            summary={work.aiSummary || "Active project tasks and progress tracking..."}
                                            isSubmitted={!!work.isSubmitted}
                                        />
                                    );
                                } else {
                                    return (
                                        <div key={work.assignmentId} className="no-group-display" style={{ background: '#fff', padding: '24px', borderRadius: '20px', border: '1px solid #eee' }}>
                                            <h3 className="group-card-title" style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#1a1a1a' }}>{work.title}</h3>
                                            <p className="no-group-notice" style={{ margin: 0, color: '#999', fontSize: '14px' }}>You have no group for this project.</p>
                                        </div>
                                    );
                                }
                            } else {
                                // Individual assignments are hidden from members on the dashboard
                                return null;
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
                    })
                ) : (
                    <p className="no-posts-msg" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#999' }}>No assignments found.</p>
                )}
            </div>
        </section>
    );
}
