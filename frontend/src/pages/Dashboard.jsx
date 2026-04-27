import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useClass } from "../components/ClassContext";
import { getWorkFeed } from "../services/workService";
import WorkPost from "../components/WorkPost";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Dashboard() {
    const { activeClassId } = useClass();
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchWork = useCallback(async () => {
        if (!activeClassId) return;
        try {
            setIsLoading(true);
            const data = await getWorkFeed(activeClassId);
            setAssignments(data);
        } catch (err) {
            console.error("Failed to fetch dashboard work:", err);
        } finally {
            setIsLoading(false);
        }
    }, [activeClassId]);

    useEffect(() => {
        fetchWork();
    }, [fetchWork]);

    return (
        <section id="dashboard-listing-view" className="stream-content stream-content-scrollable">
            <div id="assignments-container" className="posts-container">
                {isLoading ? (
                    <LoadingSpinner />
                ) : assignments.length > 0 ? (
                    assignments.map((work) => (
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
                                    navigate(`/assignment/${id}`, { state: { from: 'Work' } });
                                }
                            }}
                        />
                    ))
                ) : (
                    <p className="no-posts-msg">No assignments found.</p>
                )}
            </div>
        </section>
    );
}