import { useState, useEffect, useCallback } from "react";
import { useClass } from "../components/ClassContext";
import { getWorkFeed } from "../services/workService";
import WorkPost from "../components/WorkPost";
import LoadingSpinner from "../components/LoadingSpinner";
import AssignModal from "../components/Work/AssignModal";

export default function Classwork() {
    const { activeClassId, isLeader } = useClass();
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAssign, setIsAssign] = useState(false);

    const fetchWork = useCallback(async () => {
        if (!activeClassId) return;
        try {
            setIsLoading(true);
            const data = await getWorkFeed(activeClassId);
            setAssignments(data);
        } catch (err) {
            console.error("Failed to fetch classwork:", err);
        } finally {
            setIsLoading(false);
        }
    }, [activeClassId]);

    useEffect(() => {
        fetchWork();
    }, [fetchWork]);

    function onClose(refresh = false) {
        setIsAssign(false);
        if (refresh) fetchWork();
    }

    return (
        <>
            {/* Classwork Content */}
            <section className="stream-content stream-content-scrollable">
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
                            />
                        ))
                    ) : (
                        <p className="no-posts-msg">No assignments posted yet.</p>
                    )}
                </div>
            </section>

            {/* Assign Button */}
            {isLeader && (
                <button id="btn-assign" className="btn-compose btn-assign-custom" onClick={() => { setIsAssign(true) }}>
                    <span className="btn-assign-icon">+</span> Assign
                </button>
            )}

            {isAssign && (
                <AssignModal onClose={onClose} classId={activeClassId} />
            )}
        </>
    );
}